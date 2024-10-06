import util from "util";
import { exec } from "child_process";
const execPromise = util.promisify(exec);

class MosquittoRepo {
    async updateMosquittoPassword(userId: string, apiKey: string): Promise<void> {
        const command = `sudo mosquitto_passwd -b /etc/mosquitto/passwd ${userId} ${apiKey}`;
        await execPromise(command);
        const { stdout } = await execPromise(`pidof mosquitto`);
        const pid = stdout.trim();
        if (!pid) {
            return;
        }
        await execPromise(`sudo kill -HUP ${pid}`);
    }

    async deleteMosquittoPassword(userId: string): Promise<void> {
        const command = `sudo mosquitto_passwd -D /etc/mosquitto/passwd ${userId}`;
        await execPromise(command);
        const { stdout } = await execPromise(`pidof mosquitto`);
        const pid = stdout.trim();
        if (!pid) {
            return;
        }
        await execPromise(`sudo kill -HUP ${pid}`);
    }
}

export default MosquittoRepo;
