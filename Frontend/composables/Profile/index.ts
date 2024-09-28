import getData from "./getData";
import type { Config } from "../utils";

interface Profile {
    getData: getData;
}

const createProfile = (config: Config): Profile => ({
    getData: new getData(config.public.apiUrl)
});

export default createProfile;