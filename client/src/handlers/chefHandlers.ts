import { Socket } from "socket.io-client";
import InputHandlerService from "../services/inputHandlerService";

class ChefHandlers {
	constructor(private socket: Socket) {}

	async viewMenuItems(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewItems", (response: any) => {
				if (response.items.length > 0) {
					console.log(response.items);
				} else {
					console.log("No records found.");
				}
				resolve(response.items);
			});
		});
	}

	async viewMealTypes(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewMealTypes", (response: any) => {
				if (response.mealType.length > 0) {
					console.log(response.mealType);
				} else {
					console.log("no data found");
				}
				resolve(response.mealType);
			});
		});
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
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewAvailableFoodItems", (response: any) => {
				if (response.items.length > 0) {
					console.log(response.items);
				} else {
					console.log("No records found.");
				}
				resolve(response);
			});
		});
	}

	async sendFoodNotification(): Promise<void> {
		const message = await InputHandlerService.askQuestion(
			"Enter the notification message: "
		);
		this.socket.emit("sendNotification", { message });
	}

	async viewRecommendations(): Promise<void> {
		this.socket.emit("viewRecommendations");
	}

	async logout() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout", (response: any) => {
				if (response) {
					console.log(response);
				} else {
					console.log("Error occured while logging out");
				}
				resolve(response);
			});
		});
	}
}

export default ChefHandlers;
