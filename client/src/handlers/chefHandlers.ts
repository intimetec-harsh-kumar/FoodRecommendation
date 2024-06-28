import { Socket } from "socket.io-client";

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

	async viewNotifications(notificationTypeId?: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"viewNotifications",
				notificationTypeId,
				(response: any) => {
					if (response.notification.length > 0) {
						console.log(response.notification);
					} else {
						console.log("No records found.");
					}
					resolve(response);
				}
			);
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

	async sendFoodNotification(
		foodItemIdsToRollOutForNextDay: any
	): Promise<void> {
		this.socket.emit(
			"sendFoodItemNotificationForNextDay",
			foodItemIdsToRollOutForNextDay
		);
	}

	async viewRecommendations(): Promise<any[]> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewRecommendations", (response: any) => {
				if (response) {
					resolve(response.recommendations);
				} else {
					reject("Error occurred while fetching recommendations");
				}
			});
		});
	}

	async viewVotedItems(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewVotedItems", (response: any) => {
				if (response) {
					console.log(response.votedItems);
				} else {
					console.log("Error occured while fetching voted items data");
				}
				resolve(response);
			});
		});
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
