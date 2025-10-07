// Email.ir SMTP Service for Iranian Email
// Documentation: https://email.ir/

interface EmailIrConfig {
  apiKey: string;
  baseUrl: string;
  fromEmail: string;
  fromName: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

class EmailIrService {
  private config: EmailIrConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_EMAILIR_API_KEY || '',
      baseUrl: import.meta.env.VITE_EMAILIR_BASE_URL || 'https://api.email.ir/v1',
      fromEmail: import.meta.env.VITE_EMAILIR_FROM_EMAIL || 'noreply@vteemo.com',
      fromName: import.meta.env.VITE_EMAILIR_FROM_NAME || 'ویتیمو',
    };
  }

  /**
   * Send email via Email.ir
   * @param params Email parameters
   */
  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          from: {
            email: this.config.fromEmail,
            name: this.config.fromName,
          },
          to: [{ email: params.to }],
          subject: params.subject,
          [params.isHtml ? 'html' : 'text']: params.body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Email.ir error:', data);
        return {
          success: false,
          message: data.message || 'خطا در ارسال ایمیل',
        };
      }

      return {
        success: true,
        message: 'ایمیل با موفقیت ارسال شد',
      };
    } catch (error) {
      console.error('Email.ir service error:', error);
      return {
        success: false,
        message: 'خطا در اتصال به سرویس ارسال ایمیل',
      };
    }
  }

  /**
   * Send verification email with OTP code
   * @param email User email address
   * @param code 6-digit OTP code
   * @param username User's username
   */
  async sendVerificationEmail(
    email: string,
    code: string,
    username: string
  ): Promise<{ success: boolean; message?: string }> {
    const htmlBody = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .code-box {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 5px;
          }
          .info {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-top: 20px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 ویتیمو</h1>
            <p>پلتفرم اشتراک‌گذاری ویدیو</p>
          </div>
          <div class="content">
            <h2>سلام ${username} عزیز!</h2>
            <p>کد تایید شما برای ثبت‌نام در ویتیمو:</p>
            <div class="code-box">${code}</div>
            <div class="info">
              <p>این کد برای 5 دقیقه معتبر است.</p>
              <p>اگر شما درخواست این کد را نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 ویتیمو | تمامی حقوق محفوظ است</p>
            <p>vteemo.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'کد تایید ویتیمو',
      body: htmlBody,
      isHtml: true,
    });
  }

  /**
   * Send welcome email to new users
   * @param email User email address
   * @param username User's username
   */
  async sendWelcomeEmail(
    email: string,
    username: string
  ): Promise<{ success: boolean; message?: string }> {
    const htmlBody = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 به ویتیمو خوش آمدید!</h1>
          </div>
          <div class="content">
            <h2>سلام ${username} عزیز!</h2>
            <p>از اینکه به جمع ما پیوستید بسیار خوشحالیم.</p>
            <p>ویتیمو یک پلتفرم پیشرفته برای اشتراک‌گذاری و تماشای ویدیوهای با کیفیت است.</p>
            <p style="text-align: center;">
              <a href="https://vteemo.com" class="button">شروع کنید</a>
            </p>
            <h3>امکانات ویتیمو:</h3>
            <ul>
              <li>📤 آپلود و اشتراک‌گذاری ویدیوها</li>
              <li>🎥 پخش زنده</li>
              <li>🎧 پادکست</li>
              <li>💰 درآمدزایی از محتوا</li>
              <li>👥 تعامل با سایر کاربران</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 ویتیمو | تمامی حقوق محفوظ است</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'به ویتیمو خوش آمدید!',
      body: htmlBody,
      isHtml: true,
    });
  }

  /**
   * Send password reset email
   * @param email User email address
   * @param resetToken Password reset token
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<{ success: boolean; message?: string }> {
    const resetLink = `https://vteemo.com/reset-password?token=${resetToken}`;
    const htmlBody = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 بازیابی رمز عبور</h1>
          </div>
          <div class="content">
            <p>برای بازیابی رمز عبور خود روی دکمه زیر کلیک کنید:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">بازیابی رمز عبور</a>
            </p>
            <p style="color: #666; font-size: 12px;">این لینک برای 1 ساعت معتبر است.</p>
            <p style="color: #666; font-size: 12px;">اگر شما درخواست بازیابی رمز عبور نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
          </div>
          <div class="footer">
            <p>© 2024 ویتیمو | تمامی حقوق محفوظ است</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'بازیابی رمز عبور ویتیمو',
      body: htmlBody,
      isHtml: true,
    });
  }
}

export default new EmailIrService();
