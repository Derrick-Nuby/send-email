const content = `
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
    .content {
      padding: 20px;
      text-align: left;
      color: #333;
      font-size: 16px;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 15px;
    }
    .content a {
      color: #007BFF;
      text-decoration: none;
      font-weight: bold;
    }
    .content a:hover {
      text-decoration: underline;
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
      .content p {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your SMTP Settings</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>
        We have received a request to verify your SMTP settings. Please click the link below to verify your SMTP configuration:
      </p>
      <p>
        <a href="${process.env.BASE_URL}/smtps/verify/${token}" target="_blank">
          Verify SMTP Settings
        </a>
      </p>
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Thank you,<br/>The DercedGroup Team</p>
    </div>
    <div class="footer">
      <p><strong>DercedGroup Ltd</strong></p>
      <p>Located: Kigali, Gasabo, Gacuriro</p>
      <p>&copy; ${new Date().getFullYear()} DercedGroup Ltd. All rights reserved.</p>
      <p><a href="https://DercedGroup.com" target="_blank">Visit Our Website</a></p>
    </div>
  </div>
</body>
</html>
`;