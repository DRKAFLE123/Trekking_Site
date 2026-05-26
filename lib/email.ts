import { Resend } from 'resend';

// Initialize Resend
// It is safe to initialize here, but we check if the key exists before sending.
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Utility to send an email using Resend API.
 * 
 * Note: If testing locally without a RESEND_API_KEY, this will mock the send and log it.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev'; // Fallback for local testing

  if (!apiKey) {
    console.warn("=============================================");
    console.warn("RESEND_API_KEY is not defined in .env. Mocking email send.");
    console.warn("To:", to);
    console.warn("Subject:", subject);
    console.warn("=============================================");
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: `Nature Heaven Treks <${fromEmail}>`,
      to,
      subject,
      html,
      replyTo,
    });

    if (data.error) {
      console.error("Resend API error:", data.error);
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error };
  }
}

/**
 * Premium Email Template Wrapper
 * Wraps the provided content in a beautiful, modern, mobile-responsive HTML container.
 */
export function getPremiumEmailTemplate(
  enquiryType: string,
  title: string,
  contentHtml: string,
  replyToEmail?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
  body {
    margin: 0;
    padding: 0;
    background-color: #f8f5f0;
    font-family: 'Inter', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  }
  .header {
    background-color: #1a2e1f;
    padding: 40px 20px;
    text-align: center;
    border-bottom: 4px solid #E84C1E;
  }
  .enquiry-type {
    display: inline-block;
    background-color: #F5A623;
    color: #1a2e1f;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .header h1 {
    margin: 0;
    color: #ffffff;
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    letter-spacing: 0.5px;
  }
  .header p {
    margin: 10px 0 0;
    color: #a3b8aa;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .content {
    padding: 40px;
    color: #3D3D3D;
    font-size: 16px;
    line-height: 1.6;
  }
  .content h2 {
    color: #1a2e1f;
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    margin-top: 0;
    margin-bottom: 20px;
  }
  .content p {
    margin-bottom: 20px;
  }
  .content strong {
    color: #1a2e1f;
  }
  .footer {
    background-color: #f1ede5;
    padding: 30px;
    text-align: center;
    color: #6B6B6B;
    font-size: 12px;
  }
  .footer a {
    color: #E84C1E;
    text-decoration: none;
    font-weight: 600;
  }
  .btn {
    display: inline-block;
    background-color: #E84C1E;
    color: #ffffff;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    margin: 20px 0;
  }
  .btn:hover {
    background-color: #d14118;
    color: #ffffff;
  }
  .info-box {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-left: 4px solid #1a2e1f;
    padding: 20px;
    border-radius: 4px;
    margin: 20px 0;
  }
  .info-box p {
    margin: 0 0 10px;
  }
  .info-box p:last-child {
    margin: 0;
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
  }
  .data-table th, .data-table td {
    border: 1px solid #e9ecef;
    padding: 12px 15px;
    text-align: left;
  }
  .data-table th {
    background-color: #f8f9fa;
    color: #1a2e1f;
    width: 35%;
    font-weight: 600;
  }
  .data-table td {
    color: #3D3D3D;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${enquiryType ? `<div class="enquiry-type">${enquiryType}</div>` : ''}
      <h1>Nature Heaven Treks</h1>
      <p>Himalayan Adventures</p>
    </div>
    <div class="content">
      ${title ? `<h2>${title}</h2>` : ''}
      ${contentHtml}
      
      ${replyToEmail ? `
      <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 30px;">
        <a href="mailto:${replyToEmail}" class="btn">Reply to User</a>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Nature Heaven Treks. All rights reserved.</p>
      <p>Pakjonal Marga -16, Thamel, Kathmandu, Nepal</p>
      <p><a href="https://natureheaventreks.com">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

