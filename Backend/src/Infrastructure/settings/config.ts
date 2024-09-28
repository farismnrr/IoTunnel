import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { setInterval } from "timers";

function generateAdminKey() {
    const adminKey = `admin-${nanoid(100)}-${Date.now()}-${uuidv4()}`;
    return adminKey;
}

let adminKey = generateAdminKey();

setInterval(() => {
    adminKey = generateAdminKey();
}, 60 * 60 * 1000);

const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || "localhost"
    },
    jwt: {
        adminKey: process.env.NODE_ENV === "production" ? adminKey : process.env.ADMIN_KEY,
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
        otpHtml: "public/OTP/index.html"
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
    },
    storage: {
        projectId: process.env.PROJECT_ID,
        bucketName: process.env.BUCKET_NAME,
        keyFilename: process.env.KEY_FILENAME
    },
    photo: {
        default: process.env.DEFAULT_PHOTO
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    timeOut: {
        otp: 5 * 60 * 1000,
        mosquitto: 1 * 1000,
        trial: 1 * 60 * 1000,
        oneMonth: 1 * 30 * 24 * 60 * 60 * 1000,
        threeMonth: 3 * 30 * 24 * 60 * 60 * 1000,
        sixMonth: 6 * 30 * 24 * 60 * 60 * 1000
    }
};

export default config;
