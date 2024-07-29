import { Socket } from "socket.io-client";
import { INotification } from "../models/INotification";
import { IFoodItem } from "../models/IFoodItem";

class EmployeeHandlers {
	constructor(private socket: Socket) {}

	async viewNotifications(
		notificationTypeId?: number
	): Promise<INotification[]> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"viewNotifications",
				notificationTypeId,
				(response: any) => {
					if (response.error) {
						resolve(response.error);
					} else {
						resolve(response.notification);
					}
				}
			);
		});
	}

	async viewMenuItems(): Promise<IFoodItem[]> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewItems", (response: any) => {
				if (response.error) {
					resolve(response.error);
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
	): Promise<any> {
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

	async selectFoodItemForNextDay(foodItemIds: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"selectFoodItemForNextDay",
				foodItemIds,
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

	async updateProfile(profileData: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("updateProfile", profileData, (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.message);
				}
			});
		});
	}

	async logout(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout", (response: any) => {
				resolve(response.message);
			});
		});
	}
}

export default EmployeeHandlers;
