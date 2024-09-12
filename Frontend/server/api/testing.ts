import { useFetch } from "nuxt/app";

const handler = async () => {
    const config = useRuntimeConfig();
    const response = await useFetch(
        `${config.public.apiUrl}/${config.public.apiVersion}/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "farismnrr1726148744047@gmail.com",
                password: "*Test12345"
            })
        }
    );

    return response;
};

export default handler;
