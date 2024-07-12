import { Socket } from "socket.io-client";
import { INotification } from "../models/INotification";
import { IFoodItem } from "../models/IFoodItem";

class ChefHandlers {
	constructor(private socket: Socket) {}

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

	async viewMealTypes(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewMealTypes", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.mealType);
				}
			});
		});
	}

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

	async viewAvailableFoodItems(): Promise<IFoodItem[]> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewAvailableFoodItems", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.items);
				}
			});
		});
	}

	async sendFoodNotificationForNextDay(
		foodItemIdsToRollOutForNextDay: any
	): Promise<unknown> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"sendFoodItemNotificationForNextDay",
				foodItemIdsToRollOutForNextDay,
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

	async viewRecommendations(
		mealType: number,
		numberOfRecommendation: number
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"viewRecommendations",
				mealType,
				numberOfRecommendation,
				(response: any) => {
					if (response.error) {
						resolve(response.error);
					} else {
						resolve(response.recommendations);
					}
				}
			);
		});
	}

	async viewVotedItems(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewVotedItems", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.votedItems);
				}
			});
		});
	}

	async viewDiscardMenuItemList(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewDiscardMenuItemList", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.items);
				}
			});
		});
	}

	async handleDeleteItem(id: number) {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("deleteItem", id, (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.message);
				}
			});
		});
	}

	async handleSendNotificationForDetailedFeedback(
		foodItemIdForDetailedFeedback: number,
		questions: string
	): Promise<unknown> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"sendNotificationForDetailedFeedback",
				foodItemIdForDetailedFeedback,
				questions,
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

	async prepareFood(foodItemId: number): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("prepareFood", foodItemId, (response: any) => {
				resolve(response.message);
			});
		});
	}

	async logout() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout", (response: any) => {
				resolve(response.message);
			});
		});
	}
}

export default ChefHandlers;
