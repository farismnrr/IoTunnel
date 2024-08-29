import type { IOtpCode, IAuth } from "../../Common/models/types";
import { Pool } from "pg";

class AuthRepository {
	private readonly _pool: Pool;

	constructor() {
		this._pool = new Pool();
	}

	// Start OTP Repository
	async addOtp(email: string, otpCode: number): Promise<void> {
		await this.deleteOtpByEmail(email);
		const createdAt = new Date();
		const otpExpiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);
		const addOtpQuery = {
			text: `
          		INSERT INTO otp_codes (email, otp_code, created_at, otp_expires_at) 
          		VALUES ($1, $2, $3, $4)
        	`,
			values: [email, otpCode, createdAt, otpExpiresAt]
		};
		await this._pool.query(addOtpQuery);
	}

	async getOtp(): Promise<IOtpCode[] | null> {
		const getOtpQuery = {
			text: `SELECT otp_code FROM otp_codes`
		};
		const result = await this._pool.query(getOtpQuery);
		return result.rows || null;
	}

	async getEmailbyOtp(otpCode: number): Promise<string | null> {
		const getEmailbyOtpQuery = {
			text: `
          		SELECT email FROM otp_codes 
          		WHERE otp_code = $1
        	`,
			values: [otpCode]
		};
		const result = await this._pool.query(getEmailbyOtpQuery);
		return result.rows[0]?.email || null;
	}

	async getOtpByEmail(email: string): Promise<IOtpCode | null> {
		const getOtpByEmailQuery = {
			text: `
          		SELECT otp_code FROM otp_codes 
          		WHERE email = $1
        	`,
			values: [email]
		};
		const result = await this._pool.query(getOtpByEmailQuery);
		return result.rows[0] || null;
	}

	async deleteOtp(): Promise<void> {
		const deleteOtpQuery = {
			text: `DELETE FROM otp_codes WHERE otp_expires_at > NOW()`
		};
		await this._pool.query(deleteOtpQuery);
	}

	async deleteOtpByEmail(email: string): Promise<void> {
		const deleteOtpByEmailQuery = {
			text: `DELETE FROM otp_codes WHERE email = $1`,
			values: [email]
		};
		await this._pool.query(deleteOtpByEmailQuery);
	}
	// End OTP Repository

	// Start Admin Auth Repository
	async addAdminAuth(auth: IAuth): Promise<void> {
		const createdAt = new Date();
		await this.deleteAdminAuth(auth.id);
		const addAdminAuthQuery = {
			text: `
          		INSERT INTO auths (admin_id, refresh_token, access_token, role, created_at, updated_at) 
          		VALUES ($1, $2, $3, $4, $5, $5)
        	`,
			values: [auth.id, auth.refresh_token, auth.access_token, auth.role, createdAt]
		};
		await this._pool.query(addAdminAuthQuery);
	}

	async getAdminAuth(refreshToken: string): Promise<IAuth | null> {
		const getAdminAuthQuery = {
			text: `
          		SELECT admin_id, refresh_token, access_token, role FROM auths WHERE refresh_token = $1
        	`,
			values: [refreshToken]
		};
		const result = await this._pool.query(getAdminAuthQuery);
		return result.rows[0] || null;
	}

	async getAdminRole(adminId: string): Promise<string | null> {
		const getAdminRoleQuery = {
			text: `
			SELECT role FROM auths WHERE admin_id = $1
        	`,
			values: [adminId]
		};
		const result = await this._pool.query(getAdminRoleQuery);
		return result.rows[0]?.role || null;
	}

	async editAdminAuth(accessToken: string, refreshToken: string): Promise<void> {
		const updatedAt = new Date();
		const editAdminAuthQuery = {
			text: `
          		UPDATE auths SET access_token = $1, updated_at = $2 WHERE refresh_token = $3
        	`,
			values: [accessToken, updatedAt, refreshToken]
		};
		await this._pool.query(editAdminAuthQuery);
	}

	async deleteAdminAuth(refreshToken: string): Promise<void> {
		const deleteAdminAuthQuery = {
			text: `
          		DELETE FROM auths WHERE refresh_token = $1
        	`,
			values: [refreshToken]
		};
		await this._pool.query(deleteAdminAuthQuery);
	}
	// End Admin Auth Repository
}

export default AuthRepository;
