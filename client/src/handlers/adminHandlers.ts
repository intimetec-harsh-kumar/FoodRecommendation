import { Socket } from "socket.io-client";
import InputHandlerService from "../services/inputHandlerService";
import ActionHandlers from "../handlers/actionHandlers";

class AdminHandlers extends ActionHandlers {
	constructor(socket: Socket) {
		super(socket);
	}

	async addItem(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const item_name = await InputHandlerService.askQuestion(
				"Enter item name: "
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

	async updateItem() {
		return new Promise(async (resolve, reject) => {
			const id = parseInt(
				await InputHandlerService.askQuestion("Enter item ID to update: ")
			);
			const item_name = await InputHandlerService.askQuestion(
				"Enter new item name: "
			);
			const price = parseFloat(
				await InputHandlerService.askQuestion("Enter new item price: ")
			);
			const availability_status =
				(await InputHandlerService.askQuestion(
					"Is the item available? (yes/no): "
				)) === "yes";
			const meal_type_id = parseInt(
				await InputHandlerService.askQuestion("Enter new meal type ID: ")
			);
			this.socket.emit(
				"updateItem",
				{ id, item_name, price, availability_status, meal_type_id },
				(response: any) => {
					if (response.success) {
						console.log(response.message);
						resolve(response.success);
					} else {
						console.log(response.message);
						reject(new Error(response.message));
					}
				}
			);
		});
	}

	async deleteItem() {
		return new Promise(async (resolve, reject) => {
			const id = parseInt(
				await InputHandlerService.askQuestion("Enter item ID to delete: ")
			);

			this.socket.emit("deleteItem", id, (response: any) => {
				console.log(response);
				if (response.success) {
					console.log(response.message);
					resolve(response.message);
				} else {
					console.error(response.message);
					reject(new Error(response.message));
				}
			});
		});
	}

	async viewItems() {
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

	async viewMealTypes() {
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
}

export default AdminHandlers;
