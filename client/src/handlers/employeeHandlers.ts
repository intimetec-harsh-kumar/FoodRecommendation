import { Socket } from "socket.io-client";

class EmployeeHandlers {
	constructor(private socket: Socket) {}

	async viewNotifications(notificationTypeId?: number) {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"viewNotifications",
				notificationTypeId,
				(response: any) => {
					if (response.error) {
						resolve(response.error);
					} else if (response.notification.length === 0) {
						resolve("No records found");
					} else {
						resolve(response.notification);
					}
				}
			);
		});
	}

	async viewMenuItems() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewItems", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else if (response.items.length === 0) {
					resolve("No records found");
				} else {
					resolve(response.items);
				}
			});
		});
	}

	async provideFeedback(
		food_item_id: string,
		rating: string,
		comment: string
	): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"provideFeedback",
				{ food_item_id, rating, comment },
				(response: any) => {
					if (response.error) {
						resolve(response.error);
					} else {
						resolve(response.message);
					}
				}
			);
		});
	}

	async selectFoodItemForNextDay(foodItemId: any): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"selectFoodItemForNextDay",
				foodItemId,
				(response: any) => {
					if (response.error) {
						resolve(response.error);
					} else {
						resolve(response.message);
					}
				}
			);
		});
	}

	async logout() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout");
		});
	}
}

export default EmployeeHandlers;
