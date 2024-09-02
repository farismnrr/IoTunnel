import type { IOtpCode, IAuth } from "../../../Common/models/types";
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
		const otpQuery = {
			text: `
          		INSERT INTO otp_codes (email, otp_code, created_at, otp_expires_at) 
          		VALUES ($1, $2, $3, $4)
        	`,
			values: [email, otpCode, createdAt, otpExpiresAt]
		};
		await this._pool.query(otpQuery);
	}

	async getOtp(): Promise<IOtpCode[] | null> {
		const otpQuery = {
			text: `SELECT otp_code FROM otp_codes`
		};
		const otpResult = await this._pool.query(otpQuery);
		return otpResult.rows || null;
	}

	async getEmailbyOtp(otpCode: number): Promise<string | null> {
		const otpQuery = {
			text: `
          		SELECT email FROM otp_codes 
          		WHERE otp_code = $1
        	`,
			values: [otpCode]
		};
		const otpResult = await this._pool.query(otpQuery);
		return otpResult.rows[0]?.email || null;
	}

	async getOtpByEmail(email: string): Promise<IOtpCode | null> {
		const otpQuery = {
			text: `
          		SELECT otp_code FROM otp_codes 
          		WHERE email = $1
        	`,
			values: [email]
		};
		const otpResult = await this._pool.query(otpQuery);
		return otpResult.rows[0] || null;
	}

	async deleteOtpByEmail(email: string): Promise<void> {
		const otpQuery = {
			text: `DELETE FROM otp_codes WHERE email = $1`,
			values: [email]
		};
		await this._pool.query(otpQuery);
	}
	// End OTP Repository

	// Start Admin Auth Repository
	async addAdminAuth(auth: IAuth): Promise<void> {
		const createdAt = new Date();
		await this.deleteAdminAuth(auth.id);
		const adminAuthQuery = {
			text: `
          		INSERT INTO auths (admin_id, refresh_token, access_token, role, created_at, updated_at) 
          		VALUES ($1, $2, $3, $4, $5, $5)
        	`,
			values: [auth.id, auth.refresh_token, auth.access_token, auth.role, createdAt]
		};
		await this._pool.query(adminAuthQuery);
	}

	async getAdminAuth(refreshToken: string): Promise<IAuth | null> {
		const adminAuthQuery = {
			text: `
				SELECT admin_id, refresh_token, access_token, role 
				FROM auths 
				WHERE refresh_token = $1
			`,
			values: [refreshToken]
		};
		const adminAuthResult = await this._pool.query(adminAuthQuery);
		return adminAuthResult.rows[0] || null;
	}

	async getAdminRole(adminId: string): Promise<string | null> {
		const adminAuthQuery = {
			text: `SELECT role FROM auths WHERE admin_id = $1`,
			values: [adminId]
		};
		const adminAuthResult = await this._pool.query(adminAuthQuery);
		return adminAuthResult.rows[0]?.role || null;
	}

	async editAdminAuth(accessToken: string, refreshToken: string): Promise<void> {
		const updatedAt = new Date();
		const adminAuthQuery = {
			text: `
          		UPDATE auths SET access_token = $1, updated_at = $2 WHERE refresh_token = $3
        	`,
			values: [accessToken, updatedAt, refreshToken]
		};
		await this._pool.query(adminAuthQuery);
	}

	async deleteAdminAuth(refreshToken: string): Promise<void> {
		const adminAuthQuery = {
			text: `DELETE FROM auths WHERE refresh_token = $1`,
			values: [refreshToken]
		};
		await this._pool.query(adminAuthQuery);
	}
	// End Admin Auth Repository

	// Start User Auth Repository
	async addUserAuth(auth: IAuth): Promise<void> {
		const createdAt = new Date();
		await this.deleteUserAuth(auth.id);
		const userAuthQuery = {
			text: `
          		INSERT INTO auths (user_id, refresh_token, access_token, role, created_at, updated_at) 
          		VALUES ($1, $2, $3, $4, $5, $5)
        	`,
			values: [auth.id, auth.refresh_token, auth.access_token, auth.role, createdAt]
		};
		await this._pool.query(userAuthQuery);
	}

	async getUserAuth(refreshToken: string): Promise<IAuth | null> {
		const userAuthQuery = {
			text: `
				SELECT user_id, refresh_token, access_token, role 
				FROM auths 
				WHERE refresh_token = $1
			`,
			values: [refreshToken]
		};
		const userAuthResult = await this._pool.query(userAuthQuery);
		return userAuthResult.rows[0] || null;
	}

	async getUserRole(userId: string): Promise<string | null> {
		const userAuthQuery = {
			text: `SELECT role FROM auths WHERE user_id = $1`,
			values: [userId]
		};
		const userAuthResult = await this._pool.query(userAuthQuery);
		return userAuthResult.rows[0]?.role || null;
	}

	async editUserAuth(accessToken: string, refreshToken: string): Promise<void> {
		const updatedAt = new Date();
		const userAuthQuery = {
			text: `
          		UPDATE auths SET access_token = $1, updated_at = $2 WHERE refresh_token = $3
        	`,
			values: [accessToken, updatedAt, refreshToken]
		};
		await this._pool.query(userAuthQuery);
	}

	async deleteUserAuth(refreshToken: string): Promise<void> {
		const userAuthQuery = {
			text: `DELETE FROM auths WHERE refresh_token = $1`,
			values: [refreshToken]
		};
		await this._pool.query(userAuthQuery);
	}
	// End User Auth Repository
}

export default AuthRepository;
