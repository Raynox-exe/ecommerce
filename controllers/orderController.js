const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

exports.createOrder = async (req, res) => {
  const { items } = req.body; // Expect items to be [{ productId, quantity }]
  
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  try {
    const userId = req.user.id;
    let totalAmount = 0;
    
    // Calculate total amount and verify stock
    const orderItemsData = [];
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      const price = parseFloat(product.price);
      totalAmount += price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: price
      });
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = await Order.create({
      userId,
      totalAmount
    });

    // Add orderId to items
    const finalOrderItems = orderItemsData.map(item => ({ ...item, orderId: order.id }));
    await OrderItem.bulkCreate(finalOrderItems);

    // Dispatch Order Confirmation Email
    const user = await User.findByPk(userId);
    if(user && user.email) {
      sendMail(
        user.email,
        `Order Confirmation #${order.id}`,
        `<h2>Thank you for your order!</h2>
         <p>Hi ${user.username},</p>
         <p>Your secure purchase has been received and confirmed!</p>
         <p><strong>Order ID:</strong> ${order.id}</p>
         <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
         <p>We'll notify you when your package ships!</p>`
      ).catch(err => console.error('Order email failed:', err));
    }

    res.status(201).json({ message: 'Order created successfully', orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [Product]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalSales = await Order.sum('totalAmount') || 0;
    const totalOrders = await Order.count();
    const totalCustomers = await User.count({ where: { role: 'customer' } });
    const totalProducts = await Product.count();

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [User]
    });

    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [require('sequelize').Op.lt]: 5
        }
      },
      limit: 5
    });

    res.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: OrderItem, include: [Product] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
