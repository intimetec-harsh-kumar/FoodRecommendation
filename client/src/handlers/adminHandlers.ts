import { Socket } from "socket.io-client";

class AdminHandlers {
	constructor(private socket: Socket) {}

	async addItem(
		item_name: string,
		price: number,
		availability_status: boolean,
		meal_type_id: number
	): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"addItem",
				{ item_name, price, availability_status, meal_type_id },
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

	async updateItem(
		id: number,
		item_name: string,
		price: number,
		availability_status: boolean,
		meal_type_id: number
	) {
		return new Promise(async (resolve, reject) => {
			this.socket.emit(
				"updateItem",
				{ id, item_name, price, availability_status, meal_type_id },
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

	async deleteItem(id: number) {
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

	async viewItems() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewItems", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else if (response.items.length === 0) {
					resolve("No records found.");
				} else {
					resolve(response.items);
				}
			});
		});
	}

	async viewMealTypes() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewMealTypes", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else if (response.mealType.length === 0) {
					resolve("No records found.");
				} else {
					resolve(response.mealType);
				}
			});
		});
	}

	async viewLog() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("viewLog", (response: any) => {
				if (response.error) {
					resolve(response.error);
				} else if (response.log.length === 0) {
					resolve("No records found.");
				} else {
					resolve(response.log);
				}
			});
		});
	}

	async logout() {
		return new Promise(async (resolve, reject) => {
			this.socket.emit("logout", (response: any) => {
				if (response) {
					console.log("response", response);
				} else {
					console.log("Error occured while logging out");
				}
				resolve(response);
			});
		});
	}
}

export default AdminHandlers;
