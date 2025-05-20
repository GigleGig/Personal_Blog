import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a function to generate a random 6-digit code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create email transporter
const createTransporter = () => {
  // For Gmail, app passwords should not have spaces
  // Gmail app passwords are typically 16 characters, remove any spaces
  const password = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/\s+/g, '') : '';
  
  console.log(`Using email: ${process.env.EMAIL_USER}`);
  console.log(`Email host: ${process.env.EMAIL_HOST}`);
  console.log(`Email port: ${process.env.EMAIL_PORT}`);
  // Don't log the full password for security reasons
  console.log(`Password length: ${password.length}`);
  console.log(`Using secure connection: ${false}`);
  
  // Gmail specific configuration
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service instead of custom host/port
    auth: {
      user: process.env.EMAIL_USER,
      pass: password
    },
    debug: true, // Enable debug output
    logger: true  // Log information to the console
  });
};

// Send verification code email
export const sendVerificationCode = async (email, code) => {
  try {
    console.log(`Attempting to send verification code to ${email}`);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Blog Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Blog Admin Login Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 2px; text-align: center; padding: 10px; background-color: #f5f5f5;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };
    
    console.log('Sending email with options:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email: ' + error.message);
  }
}; 