import { Socket } from "socket.io-client";
import { ILog } from "../models/ILog";
import { IFoodItem } from "../models/IFoodItem";

class AdminHandlers {
	constructor(private socket: Socket) {}

	async handleAddItem(item: IFoodItem): Promise<IFoodItem> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("addItem", item, (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.message);
				}
			});
		});
	}

	async handleUpdateItem(item: IFoodItem): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("updateItem", item, (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.message);
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

	async viewItems(): Promise<IFoodItem[]> {
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

	async viewLog(): Promise<ILog[]> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewLog", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else {
					resolve(response.log);
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

	async logout() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout", (response: any) => {
				resolve(response.message);
			});
		});
	}
}

export default AdminHandlers;
