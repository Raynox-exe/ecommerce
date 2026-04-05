const nodemailer = require('nodemailer');

/**
 * Global Mailer Utility
 * Configured using Ethereal Mail (Mock SMTP for Development).
 * Switch out host, port, and auth for a real provider (like SendGrid or AWS SES) in production.
 */

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lilla.herzog1@ethereal.email',
        pass: '6Jg55GkZ1b58VvTz6T'
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML formatted email body
 */
exports.sendMail = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: '"NDU Mart Delivery System" <noreply@ndumart.test>',
            to,
            subject,
            html: htmlContent
        });
        
        console.log(`\n============================`);
        console.log(`📧  MOCK EMAIL SENT TO: ${to}`);
        console.log(`✉️  SUBJECT: ${subject}`);
        console.log(`🔗  PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}`);
        console.log(`============================\n`);
        
        return info;
    } catch (error) {
        console.error('Email Dispatch Error:', error);
        throw error;
    }
};
