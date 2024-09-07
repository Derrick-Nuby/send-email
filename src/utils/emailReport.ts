// utils/emailReport.ts

export interface EmailReport {
  subject: string;
  htmlContent: string;
}

export const formatAdminReport = (info: any): EmailReport => {
  // Extract relevant information from the 'info' object
  const accepted = info.accepted || [];
  const rejected = info.rejected || [];
  const messageId = info.messageId || '';
  const response = info.response || '';

  const totalSent = accepted.length;
  const totalFailed = rejected.length;

  // Create the email subject
  const subject = `Email Report: ${totalSent} Sent, ${totalFailed} Failed`;

  // Create the HTML content
  const htmlContent = `
  <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        color: #333;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #007BFF;
        padding: 20px;
        color: #ffffff;
        text-align: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .summary {
        margin-bottom: 20px;
        text-align: center;
        color: #007BFF;
      }
      .summary p {
        font-size: 18px;
        margin: 10px 0;
      }
      .summary strong {
        color: #0056b3;
      }
      .details {
        margin-top: 30px;
      }
      .details h2 {
        font-size: 20px;
        color: #333;
        margin-bottom: 10px;
        border-bottom: 2px solid #007BFF;
        padding-bottom: 5px;
      }
      .details table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .details table, .details th, .details td {
        border: 1px solid #ddd;
      }
      .details th, .details td {
        padding: 10px;
        text-align: left;
      }
      .success {
        color: #28a745;
      }
      .failure {
        color: #dc3545;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 14px;
        color: #777;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #007BFF;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      /* Responsive styling */
      @media (max-width: 768px) {
        .container {
          padding: 15px;
        }
        .header h1 {
          font-size: 20px;
        }
        .summary p {
          font-size: 16px;
        }
        .details h2 {
          font-size: 18px;
        }
        .details th, .details td {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Sending Report - DerceGroup Ltd</h1>
      </div>
      <div class="summary">
        <p><strong>Total Emails Sent:</strong> ${totalSent}</p>
        <p><strong>Total Emails Failed:</strong> ${totalFailed}</p>
        <p><strong>Message ID:</strong> ${messageId}</p>
      </div>
      <div class="details">
        <h2>Accepted Recipients</h2>
        ${accepted.length > 0
      ? `
        <table>
          <tr>
            <th>Email Address</th>
          </tr>
          ${accepted
        .map(
          (email: string) => `
          <tr>
            <td class="success">${email}</td>
          </tr>
          `
        )
        .join('')}
        </table>
        `
      : `<p>No emails were accepted.</p>`
    }
        
        <h2>Rejected Recipients</h2>
        ${rejected.length > 0
      ? `
        <table>
          <tr>
            <th>Email Address</th>
          </tr>
          ${rejected
        .map(
          (email: string) => `
          <tr>
            <td class="failure">${email}</td>
          </tr>
          `
        )
        .join('')}
        </table>
        `
      : `<p>No emails were rejected.</p>`
    }
        
        <h2>Server Response</h2>
        <p>${response}</p>
      </div>
      <div class="footer">
        <p><strong>DerceGroup Ltd</strong></p>
        <p>Located: Kigali, Gasabo, Gacuriro</p>
        <p>&copy; ${new Date().getFullYear()} DerceGroup Ltd. All rights reserved.</p>
        <p><a href="https://dercegroup.com">Visit Our Website</a></p>
      </div>
    </div>
  </body>
  </html>
`;

  return {
    subject,
    htmlContent,
  };
};
