import Signin from "./SignIn";
import Signup from "./SignUp";
import type { Config } from "../utils";

interface Authentication {
    signin: Signin;
    signup: Signup;
}

const createAuthentication = (config: Config): Authentication => ({
    signin: new Signin(config.public.apiUrl, config.public.apiSecret),
    signup: new Signup(config.public.apiUrl, config.public.apiSecret)
});

export default createAuthentication;
