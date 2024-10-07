import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

const toastOptions = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 1000
};

export { toast, toastOptions };
