import nodemailer from "nodemailer";
import Config from "../../../settings/config";
import axios from "axios";

class MailRepository {
    private readonly _transporter: nodemailer.Transporter;

    constructor() {
        this._transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: Config.smtp.user,
                pass: Config.smtp.pass
            }
        });
    }

    private async _getHtmlTemplate(
        templateUrl: string,
        replacements: { [key: string]: string }
    ): Promise<string> {
        let htmlBody = await axios.get(templateUrl).then((response) => {
            if (typeof response.data === 'string') {
                return response.data;
            } else {
                throw new Error('Unexpected response data type');
            }
        });
        for (const [key, value] of Object.entries(replacements)) {
            htmlBody = htmlBody.replace(new RegExp(`{{${key}}}`, "g"), value);
        }
        return htmlBody;
    }

    private async _sendMail(to: string, subject: string, htmlBody: string): Promise<void> {
        const mailOptions = {
            from: Config.mail.brandName,
            to,
            subject,
            html: htmlBody
        };
        await this._transporter.sendMail(mailOptions);
    }

    async sendOtpRegisterMail(to: string, otpCode: number): Promise<void> {
        const htmlTemplateUrl = "https://storage.googleapis.com/iotunnel-storage/smtp/index.html";
        const replacements = {
            otp_code: otpCode.toString(),
            website: Config.mail.website,
            company_name: Config.mail.brandName,
            company_name_2: Config.mail.brandName,
            company_address: Config.mail.companyAddress,
            company_address_2: Config.mail.companyAddress2,
            customer_name: "Customer",
            content_otp: Config.mail.registerContent
        };
        const htmlBody = await this._getHtmlTemplate(htmlTemplateUrl, replacements);
        await this._sendMail(to, "OTP Verification", htmlBody);
    }

    async sendOtpResetPasswordMail(
        to: string,
        otpCode: number,
        customerName: string
    ): Promise<void> {
        const htmlTemplateUrl = "https://storage.googleapis.com/iotunnel-storage/smtp/index.html";
        const replacements = {
            otp_code: otpCode.toString(),
            website: Config.mail.website,
            company_name: Config.mail.brandName,
            company_address: Config.mail.companyAddress,
            company_address_2: Config.mail.companyAddress2,
            customer_name: customerName,
            content_otp: Config.mail.resetPasswordContent
        };
        const htmlBody = await this._getHtmlTemplate(htmlTemplateUrl, replacements);
        await this._sendMail(to, "Reset Password", htmlBody);
    }
}

export default MailRepository;
