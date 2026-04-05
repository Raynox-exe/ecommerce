const fs = require('fs');
let c = fs.readFileSync('../ecommerce_frontend/admin_dashboard_v2.html', 'utf8');
c = c.replace(/\\\`/g, '`');
c = c.replace(/\\\$/g, '$');
c = c.replace(/Nexus Retail/g, 'NDU Mart');
fs.writeFileSync('../ecommerce_frontend/admin_dashboard_v2.html', c);
console.log('Fixed');
