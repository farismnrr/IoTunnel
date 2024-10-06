import type { IOtpCode, IAuth } from "../../../../Common/models/types";
import { Pool } from "pg";

class AuthRepository {
    private readonly _pool: Pool;
    private readonly _expiredTime: number;

    constructor(expiredTime: number) {
        this._pool = new Pool();
        this._expiredTime = expiredTime;
    }

    // Start OTP Repository
    async addOtp(email: string, otpCode: number): Promise<void> {
        await this.deleteOtpByEmail(email);
        const createdAt = new Date();
        const otpExpiresAt = new Date(createdAt.getTime() + this._expiredTime);
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

    // Start Delete Expired OTP and Subscription
    async deleteExpiredOtp(): Promise<void> {
        const currentTime = new Date();
        const otpQuery = {
            text: `DELETE FROM otp_codes WHERE otp_expires_at < $1`,
            values: [currentTime]
        };
        const result = await this._pool.query(otpQuery);
        const deletedCount = result.rowCount;
        if (deletedCount === 0) {
            return;
        }
        console.log(`Deleted ${deletedCount} expired OTP(s)`);
    }

    async deleteExpiredSubscription(): Promise<void> {
        const currentTime = new Date();
        const subscriptionQuery = {
            text: `DELETE FROM subscriptions WHERE subscription_end_date < $1`,
            values: [currentTime]
        };
        const result = await this._pool.query(subscriptionQuery);
        const deletedCount = result.rowCount;
        if (deletedCount === 0) {
            return;
        }
        console.log(`Deleted ${deletedCount} expired subscription(s)`);
    }
    // End Delete Expired OTP and Subscription

    // Start Admin Auth Repository
    async addAdminAuth(auth: IAuth): Promise<void> {
        const createdAt = new Date();
        await this.deleteAdminAuthByAdminId(auth.id);
        const adminAuthQuery = {
            text: `
          		INSERT INTO auths (admin_id, refresh_token, access_token, role, created_at, updated_at) 
          		VALUES ($1, $2, $3, $4, $5, $5)
        	`,
            values: [auth.id, auth.refresh_token, auth.access_token, auth.role, createdAt]
        };
        await this._pool.query(adminAuthQuery);
    }

    async getAdminAuth(refreshToken: string): Promise<number> {
        await this.deleteExpiredOtp();
        await this.deleteExpiredSubscription();
        const adminAuthQuery = {
            text: `
                SELECT COUNT(*) as admin_count
                FROM auths 
                WHERE refresh_token = $1
            `,
            values: [refreshToken]
        };
        const adminAuthResult = await this._pool.query(adminAuthQuery);
        return adminAuthResult.rows[0]?.admin_count || 0;
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

    async deleteAdminAuthByAdminId(adminId: string): Promise<void> {
        const adminAuthQuery = {
            text: `DELETE FROM auths WHERE admin_id = $1`,
            values: [adminId]
        };
        await this._pool.query(adminAuthQuery);
    }
    // End Admin Auth Repository

    // Start User Auth Repository
    async addUserAuth(auth: IAuth): Promise<void> {
        const createdAt = new Date();
        await this.deleteUserAuthByUserId(auth.id);
        const userAuthQuery = {
            text: `
          		INSERT INTO auths (user_id, refresh_token, access_token, role, created_at, updated_at) 
          		VALUES ($1, $2, $3, $4, $5, $5)
        	`,
            values: [auth.id, auth.refresh_token, auth.access_token, auth.role, createdAt]
        };
        await this._pool.query(userAuthQuery);
    }

    async getUserAuth(refreshToken: string): Promise<number> {
        await this.deleteExpiredOtp();
        await this.deleteExpiredSubscription();
        const userAuthQuery = {
            text: `
                SELECT COUNT(*) as user_count
                FROM auths 
                WHERE refresh_token = $1
            `,
            values: [refreshToken]
        };
        const userAuthResult = await this._pool.query(userAuthQuery);
        return parseInt(userAuthResult.rows[0]?.user_count) || 0;
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

    async deleteUserAuthByUserId(userId: string): Promise<void> {
        const userAuthQuery = {
            text: `DELETE FROM auths WHERE user_id = $1`,
            values: [userId]
        };
        await this._pool.query(userAuthQuery);
    }
    // End User Auth Repository
}

export default AuthRepository;
