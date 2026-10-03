# InfoNest Email OTP Setup

The registration flow now sends a real 6-digit OTP to the email address entered by the user. The OTP expires after 5 minutes and is never returned to the frontend.

## Gmail setup

1. Use a Gmail account that you control for the InfoNest sender address.
2. Turn on 2-Step Verification for that Google account.
3. Create a Google App Password for the account.
4. In `backend/.env`, set:

```env
EMAIL_USER=yourgmail@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

Do not commit `.env` or share the app password.

## Install dependencies

From the `backend` folder run:

```bash
npm install
npm run dev
```

The backend uses Nodemailer with Gmail SMTP. If email credentials are missing or the email cannot be sent, the registration OTP request returns an error instead of showing a mock OTP.
