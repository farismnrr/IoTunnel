const config = {
	server: {
		port: process.env.PORT || 3000,
		host: process.env.HOST || "localhost"
	},
	jwt: {
		serverKey: process.env.SERVER_KEY,
		accessTokenKey: process.env.ACCESS_TOKEN_KEY,
		refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
		accessTokenAge: process.env.ACCESS_TOKEN_AGE
	},
	smtp: {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	},
	mail: {
		brandName: "IoTunnel",
		website: "https://iotunnel.cloud",
		companyAddress: "Universitas Pembangunan Nasional Veteran Jawa Timur",
		companyAddress2: "Jl. Raya Rungkut Madya, Gunung Anyar, Kota Surabaya, Jawa Timur 60294",
		registerContent:
			"To complete your registration, we've sent the OTP below. This OTP is valid for 5 minutes. Please enter the code to verify your account and get started with IoTunnel",
		resetPasswordContent:
			"To reset your password, we've sent the OTP below. This OTP is valid for 5 minutes. Please enter the code to reset your password",
		otpHtml: "../../../../public/OTP/index.html"
	},
	midtrans: {
		serverKey: process.env.MIDTRANS_SERVER_KEY,
		clientKey: process.env.MIDTRANS_CLIENT_KEY,
		snapUrl: process.env.MIDTRANS_SNAP_URL,
		coreUrl: process.env.MIDTRANS_CORE_URL
	},
	mosquitto: {
		url: process.env.MOSQUITTO_URL
	},
	db: {
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT
	}
};

export default config;
