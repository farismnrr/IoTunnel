import type {
	ITransaction,
	ICustomer,
	IOrderItem,
	IPayment,
	IPaymentStatus
} from "../../../Common/models/types";
import Config from "../../settings/config";

class MidtransRepository {
	async createTransaction(
		transactionDetails: ITransaction,
		customerDetails: ICustomer,
		itemDetails: IOrderItem[]
	): Promise<IPayment> {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Basic ${btoa(Config.midtrans.serverKey as string)}`
			},
			body: JSON.stringify({
				transaction_details: transactionDetails,
				credit_card: {
					secure: true
				},
				item_details: itemDetails,
				customer_details: customerDetails
			})
		};

		const response = await fetch(`${Config.midtrans.snapUrl}/transactions`, options);
		const responseJson = await response.json();
		return responseJson as IPayment;
	}

	async getTransactionStatus(orderId: string): Promise<IPaymentStatus> {
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Basic ${btoa(Config.midtrans.serverKey as string)}`
			}
		};
		const response = await fetch(`${Config.midtrans.coreUrl}/${orderId}/status`, options);
		const responseJson = await response.json();
		
		const paymentStatus: IPaymentStatus = {
			id: responseJson.order_id,
			payment_type: responseJson.payment_type,
			transaction_status: responseJson.transaction_status
		};
		
		return paymentStatus;
	}
}

export default MidtransRepository;
