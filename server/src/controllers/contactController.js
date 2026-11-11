import { ContactEnquiry } from '../models/ContactEnquiry.js';

export const submitContactEnquiry = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are all required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email: email.toLowerCase(),
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted. Our grievance support cell will respond shortly.',
      enquiryId: enquiry._id
    });
  } catch (error) {
    next(error);
  }
};

