import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL")

def send_welcome_email(to_email: str, username: str, password: str):
    subject = "Your Emby Account Details"
    html_content = f"""
    <html>
    <body style="margin:0; padding:0; background-color:#121212; font-family: Arial, sans-serif; color:#ffffff;">
        <div style="max-width:600px; margin:auto; background-color:#1e1e1e; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <div style="background-color:#00e676; padding:20px; text-align:center;">
                <h1 style="margin:0; font-size:28px; color:#121212; font-weight:bold;">
                    Welcome to Emby
                </h1>
            </div>

            <!-- Body -->
            <div style="padding:20px; color:#ffffff;">
                <p style="font-size:18px;">Hello <strong>{username}</strong>,</p>
                <p style="font-size:16px; line-height:1.5;">
                    Your Emby account has been successfully created. You can now enjoy unlimited streaming of your favorite media.
                </p>

                <!-- Login Details Box -->
                <div style="background-color:#2c2c2c; padding:15px; border-radius:6px; margin:20px 0; border:1px solid #00e676;">
                    <p style="margin:5px 0;"><strong>Username:</strong> {username}</p>
                    <p style="margin:5px 0;"><strong>Password:</strong> {password}</p>
                </div>

                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                    <a href="https://emby.justpurple.org" 
                       style="background-color:#00e676; color:#121212; padding:14px 28px; 
                              text-decoration:none; border-radius:4px; font-weight:bold; font-size:16px;">
                        Login to Emby
                    </a>
                </div>

                <p style="font-size:14px; color:#bbbbbb; text-align:center;">
                    Please change your password after your first login for security.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color:#181818; padding:15px; text-align:center; font-size:12px; color:#777;">
                © {username[:1].upper()}Media Server - Powered by Emby
            </div>
        </div>
    </body>
    </html>
    """
    # html_content = f"""
    # <html>
    # <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    #     <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
    #         <h2 style="text-align: center; color: #4CAF50;">Welcome to Emby</h2>
    #         <p>Hello <strong>{username}</strong>,</p>
    #         <p>Your Emby account has been successfully created. You can log in using the details below:</p>
    #         <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ccc; margin: 15px 0;">
    #             <p><strong>Username:</strong> {username}</p>
    #             <p><strong>Password:</strong> {password}</p>
    #         </div>
    #         <p style="text-align: center;">
    #             <a href="http://emby.justpurple.org" 
    #                style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    #                Login to Emby
    #             </a>
    #         </p>
    #         <p style="font-size: 12px; color: #666; text-align: center;">
    #             Please change your password after your first login.
    #         </p>
    #     </div>
    # </body>
    # </html>
    # """
    body = f"""
    Hello {username},

    Your Emby account has been created successfully.

    Login Details:
    -------------------------
    Username: {username}
    Password: {password}
    Login URL: http://your-emby-server:8096

    Please change your password after logging in.

    Enjoy your streaming!
    """

    msg = MIMEText(html_content, "html")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        print(f"✅ Welcome email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
