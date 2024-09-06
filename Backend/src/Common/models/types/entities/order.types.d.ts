import { IProduct } from "./product.types";
import { ISubscription } from "./subscription.types";

interface IOrder {
	id: string;
	user_id: string;
    product_id: string;
	status: string;
	token: string;
	payment_url: string;
}

interface ITransaction {
    order_id: string;
    gross_amount: number;
}

interface ICustomer {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

interface IOrderItem {
    id: string;
    price: number;
    quantity: number;
    name: string;
}

interface IPayment {
    token: string;
    redirect_url: string;
}

interface IOrderWithPaymentUrl extends IPayment {
    transaction_status: string;
}

interface IPaymentStatus {
    id: string;
    payment_type: string;
    transaction_status: string;
}

interface IOrderData {
	id: string;
	payment_type: string;
	transaction_status: string;
	product: IProduct;
	subscription: ISubscription | null;
}

export type { IOrder, ITransaction, ICustomer, IOrderItem, IPayment, IPaymentStatus, IOrderWithPaymentUrl, IOrderData };