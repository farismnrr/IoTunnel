import Otp from "./Otp";
import type { Config } from "../utils";

interface Verification {
    otp: Otp;
}

const createVerification = (config: Config): Verification => ({
    otp: new Otp(config.public.apiUrl, config.public.apiSecret)
});

export default createVerification;
