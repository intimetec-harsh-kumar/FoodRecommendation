import { Socket } from "socket.io-client";
import InputHandlerService from "../services/inputHandlerService";

class ChefHandlers {
	constructor(private socket: Socket) {}

	async viewMenuItems(): Promise<void> {
		this.socket.emit("viewMenuItems");
	}

	async viewMealTypes(): Promise<void> {
		this.socket.emit("viewMealTypes");
	}

	async viewNotifications(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewNotifications", (response: any) => {
				if (response.notification.length > 0) {
					console.log(response.notification);
				} else {
					console.log("No records found.");
				}
				resolve(response);
			});
		});
	}

	async viewAvailableFoodItems(): Promise<void> {
		this.socket.emit("viewAvailableFoodItems");
	}

	async sendNotification(): Promise<void> {
		const message = await InputHandlerService.askQuestion(
			"Enter the notification message: "
		);
		this.socket.emit("sendNotification", { message });
	}

	async viewRecommendations(): Promise<void> {
		this.socket.emit("viewRecommendations");
	}
}

export default ChefHandlers;
