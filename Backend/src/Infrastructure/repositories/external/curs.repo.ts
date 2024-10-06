import axios from "axios";

class CursRepository {
    async konversiUSDKeIDR(USD: number): Promise<number> {
        try {
            const endpoint = "https://api.exchangerate-api.com/v4/latest/USD";
            const response = await axios.get(endpoint);
            const kurs = response.data.rates.IDR;
            const IDR = Math.floor(USD * kurs);

            return IDR;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }
}

export default CursRepository;
