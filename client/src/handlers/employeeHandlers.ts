import { Socket } from "socket.io-client";
import ActionHandlers from "../handlers/actionHandlers";
import InputHandlerService from "../services/inputHandlerService";

class EmployeeHandlers extends ActionHandlers {
	constructor(socket: Socket) {
		super(socket);
	}

	async viewNotifications(notificationTypeId?: number) {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"viewNotifications",
				notificationTypeId,
				(response: any) => {
					if (response.notification.length > 0) {
						console.log(response.notification);
					} else {
						console.log("no data found");
					}
					resolve(response.items);
				}
			);
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

	async provideFeedback(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const foodItemId = await InputHandlerService.askQuestion(
				"Enter item Id: "
			);
			const rating = await InputHandlerService.askQuestion(
				"Enter your rating (0-5): "
			);
			const comment = await InputHandlerService.askQuestion(
				"Enter you feedback: "
			);
			this.socket.emit(
				"provideFeedback",
				{ foodItemId, rating, comment },
				(response: any) => {
					if (response) {
						console.log(response.message);
						resolve(response.message);
					} else {
						console.log("Failed to provide feedback:", response.message);
						reject(new Error(response.message));
					}
				}
			);
		});
	}

	async selectFoodItemForNextDay(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const foodItemId = await InputHandlerService.askQuestion(
				"Enter item Id: "
			);
			// const rating = await InputHandlerService.askQuestion(
			// 	"Enter your rating (0-5): "
			// );
			// const comment = await InputHandlerService.askQuestion(
			// 	"Enter you feedback: "
			// );
			this.socket.emit(
				"selectFoodItemForNextDay",
				foodItemId,
				(response: any) => {
					if (response) {
						console.log(response.message);
						resolve(response.message);
					} else {
						console.log("Failed to select food item:", response.message);
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
