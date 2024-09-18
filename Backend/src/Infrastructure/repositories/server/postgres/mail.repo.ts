import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import Config from "../../../settings/config";

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
		templatePath: string,
		replacements: { [key: string]: string }
	): Promise<string> {
		let htmlBody = fs.readFileSync(path.resolve(templatePath), "utf8");
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
		const htmlTemplatePath = path.resolve(Config.mail.otpHtml);
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
		const htmlBody = await this._getHtmlTemplate(htmlTemplatePath, replacements);
		await this._sendMail(to, "OTP Verification", htmlBody);
	}

	async sendOtpResetPasswordMail(
		to: string,
		otpCode: number,
		customerName: string
	): Promise<void> {
		const htmlTemplatePath = path.resolve(Config.mail.otpHtml);
		const replacements = {
			otp_code: otpCode.toString(),
			website: Config.mail.website,
			company_name: Config.mail.brandName,
			company_address: Config.mail.companyAddress,
			company_address_2: Config.mail.companyAddress2,
			customer_name: customerName,
			content_otp: Config.mail.resetPasswordContent
		};
		const htmlBody = await this._getHtmlTemplate(htmlTemplatePath, replacements);
		await this._sendMail(to, "Reset Password", htmlBody);
	}
}

export default MailRepository;
