import { Socket } from "socket.io-client";
import ActionHandlers from "../handlers/actionHandlers";
import InputHandlerService from "../services/inputHandlerService";

class EmployeeHandlers extends ActionHandlers {
	constructor(socket: Socket) {
		super(socket);
	}

	async viewNotifications() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewNotifications", (response: any) => {
				if (response.notification.length > 0) {
					console.log(response.notification);
				} else {
					console.log("no data found");
				}
				resolve(response.items);
			});
		});
	}

	async viewMenuItems() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewItems", (response: any) => {
				if (response.items.length > 0) {
					console.log(response.items);
				} else {
					console.log("no data found");
				}
				resolve(response.items);
			});
		});
	}

	async sendFeedback(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const item_name = await InputHandlerService.askQuestion(
				"Enter item Id: "
			);
			const price = parseFloat(
				await InputHandlerService.askQuestion("Enter item price: ")
			);
			const availability_status =
				(await InputHandlerService.askQuestion(
					"Is the item available? (yes/no): "
				)) === "yes";
			const meal_type_id = parseInt(
				await InputHandlerService.askQuestion(
					"Enter meal type ID (1: breakfast, 2: lunch, 3: dinner): "
				)
			);
			this.socket.emit(
				"addItem",
				{ item_name, price, availability_status, meal_type_id },
				(response: any) => {
					if (response.success) {
						console.log(response.message);
						resolve(response.message);
					} else {
						console.log("Failed to add item:", response.message);
						reject(new Error(response.message));
					}
				}
			);
		});
	}

	async logout() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout");
			// , (response: any) => {
			// 	if (response) {
			// 		console.log("response", response);
			// 	} else {
			// 		console.log("Error occured while logging out");
			// 	}
			// 	resolve(response);
			// });
		});
	}
}

export default EmployeeHandlers;
