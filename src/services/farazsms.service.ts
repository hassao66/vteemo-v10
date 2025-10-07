// FarazSMS API Service for Iranian SMS Authentication
// Documentation: https://farazsms.com/

interface FarazSMSConfig {
  apiKey: string;
  baseUrl: string;
}

class FarazSMSService {
  private config: FarazSMSConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_FARAZSMS_API_KEY || '',
      baseUrl: import.meta.env.VITE_FARAZSMS_BASE_URL || 'https://api.farazsms.com/v2',
    };
  }

  /**
   * Send OTP via SMS
   * @param phone Iranian phone number (format: 09xxxxxxxxx)
   * @param code 6-digit OTP code
   */
  async sendOTP(phone: string, code: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Validate Iranian phone number format
      if (!/^09\d{9}$/.test(phone)) {
        return {
          success: false,
          message: 'شماره موبایل نامعتبر است',
        };
      }

      const response = await fetch(`${this.config.baseUrl}/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          recipient: phone,
          message: `کد تایید ویتیمو: ${code}\nاین کد برای 5 دقیقه معتبر است.`,
          sender: import.meta.env.VITE_FARAZSMS_SENDER || '1000000000',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('FarazSMS error:', data);
        return {
          success: false,
          message: data.message || 'خطا در ارسال پیامک',
        };
      }

      return {
        success: true,
        message: 'کد تایید با موفقیت ارسال شد',
      };
    } catch (error) {
      console.error('FarazSMS service error:', error);
      return {
        success: false,
        message: 'خطا در اتصال به سرویس ارسال پیامک',
      };
    }
  }

  /**
   * Send verification SMS using pattern
   * @param phone Iranian phone number
   * @param patternCode Pattern code from FarazSMS panel
   * @param variables Pattern variables
   */
  async sendPattern(
    phone: string,
    patternCode: string,
    variables: Record<string, string>
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/sms/pattern`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          recipient: phone,
          pattern_code: patternCode,
          variables,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('FarazSMS pattern error:', data);
        return {
          success: false,
          message: data.message || 'خطا در ارسال پیامک',
        };
      }

      return {
        success: true,
        message: 'پیامک با موفقیت ارسال شد',
      };
    } catch (error) {
      console.error('FarazSMS pattern service error:', error);
      return {
        success: false,
        message: 'خطا در اتصال به سرویس ارسال پیامک',
      };
    }
  }

  /**
   * Check SMS delivery status
   * @param messageId Message ID returned from send method
   */
  async checkStatus(messageId: string): Promise<{ success: boolean; status?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/sms/status/${messageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
        };
      }

      return {
        success: true,
        status: data.status,
      };
    } catch (error) {
      console.error('FarazSMS status check error:', error);
      return {
        success: false,
      };
    }
  }
}

export default new FarazSMSService();
