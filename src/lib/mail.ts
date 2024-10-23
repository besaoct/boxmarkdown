
import { Resend } from "resend";

const ResendAPIKey = process.env.RESEND_API_KEY as string;

const resend = new Resend(ResendAPIKey);

export const sendContactEmail = async ({email, name, message}:{
    email: string, 
    name: string,
    message: string
  }) => {
    await resend.emails.send({
      from: "team@horofy.com",
      to: "xhafin@gmail.com",
      subject: `BOXmarkdown | You got a message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border: 1px solid #e0e0e0;">
            <h2 style="color: #4a90e2; text-align: center;">You've Received a New Message!</h2>
            <p style="text-align: center; color: #555;">Hi <strong>${name}</strong>,</p>
            <p style="text-align: center; color: #555;">You have received a new message from <strong>${email}</strong>. The details are below:</p>
  
            <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="color: #4a90e2; text-align: left; border-bottom: 2px solid #4a90e2;">Message</h3>
              <p style="color: #333; font-size: 16px; margin-top: 10px;">
                "${message}"
              </p>
            </div>
  
            <p style="margin-top: 20px; text-align: center; color: #555;">
              You can reply to this email directly to follow up with <strong>${email}</strong>.
            </p>
  
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Reply to ${name}
              </a>
            </div>
          </div>
  
          <footer style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            <p>&copy; 2024 Horofy. All rights reserved.</p>
            <p>Team Horofy | <a href="mailto:team@horofy.com" style="color: #4a90e2;">team@horofy.com</a></p>
          </footer>
        </div>
      `
    });
  };
  