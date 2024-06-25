import { Socket } from "socket.io";
import FoodItemService from "../services/foodItemService";
import NotificationService from "../services/notificationService";
import DateService from "../services/dateService";
import UserDetail from "../User/userDetail";
import LogService from "../services/logService";
import foodItemService from "../services/foodItemService";

class FoodItemHandler {
	public async handleAddItem(
		socket: Socket,
		item: {
			item_name: string;
			price: number;
			availability_status: boolean;
			meal_type_id: number;
		},
		callback: (response: { success: boolean; message: string }) => void
	): Promise<void> {
		try {
			const addedItem = await FoodItemService.addItem(item);
			console.log("addeditem inisde socketSevice", addedItem);

			if (addedItem) {
				console.log(`Item ${item.item_name} added successfully`);
				let userEmail = UserDetail.getUserDetail();
				this.addLog(userEmail, "AddItems");
				NotificationService.pushNotification({
					NotificationTypeId: 1,
					Message: `${item.item_name} have been added to the Items`,
					Date: DateService.getCurrentDate(),
				});
				callback({
					success: true,
					message: `Item ${item.item_name} added successfully`,
				});
			} else {
				console.log(`Failed to delete item with name ${item.item_name}`);
				callback({
					success: false,
					message: `Failed to delete item with name ${item.item_name}`,
				});
			}
		} catch (err) {
			console.error("Error deleting item:", err);
			callback({
				success: false,
				message: "An error occurred while adding the item",
			});
		}
	}

	public async handleUpdateItem(
		socket: Socket,
		item: {
			id: number;
			item_name: string;
			price: number;
			availability_status: boolean;
			meal_type_id: number;
		},
		callback: (response: { success: boolean; message: string }) => void
	): Promise<void> {
		try {
			const updatedItem = await FoodItemService.updateItem(item);
			if (updatedItem) {
				console.log(`Item with id ${item.id} updated successfully`);
				let userEmail = UserDetail.getUserDetail();
				this.addLog(userEmail, "UpdateItem");
				NotificationService.pushNotification({
					NotificationTypeId: 2,
					Message: `${item.item_name} have been updated to the Items`,
					Date: DateService.getCurrentDate(),
				});
				callback({
					success: true,
					message: `Item with id ${item.id} updated successfully`,
				});
			} else {
				callback({
					success: false,
					message: `Failed to update item with id ${item.id}`,
				});
			}
		} catch (err) {
			callback({
				success: false,
				message: `Failed to update item with id ${item.id}`,
			});
		}
	}

	public async handleDeleteItem(
		socket: Socket,
		itemId: number,
		callback: (response: { success: boolean; message: string }) => void
	): Promise<void> {
		try {
			const deletedItem = await FoodItemService.deleteItem(itemId);
			if (deletedItem) {
				console.log(`Item with ID ${itemId} deleted successfully`);
				let userEmail = UserDetail.getUserDetail();
				this.addLog(userEmail, "DeleteItem");
				NotificationService.pushNotification({
					NotificationTypeId: 3,
					Message: `${itemId} have been deleted from the Items`,
					Date: DateService.getCurrentDate(),
				});
				callback({
					success: true,
					message: `Item with ID ${itemId} deleted successfully`,
				});
			} else {
				callback({
					success: false,
					message: `Failed to delete item with id ${itemId}`,
				});
			}
		} catch (err) {
			console.error("Error deleting item:", err);
			callback({
				success: false,
				message: "An error occurred while deleting the item",
			});
		}
	}

	public async handleViewItems(
		socket: Socket,
		callback: (response: {
			items: {
				id: number;
				item_name: string;
				price: number;
				availability_status: number;
				meal_type_id: number;
			}[];
		}) => void
	): Promise<any> {
		try {
			const items = await FoodItemService.getItems();
			let userEmail = UserDetail.getUserDetail();
			this.addLog(userEmail, "ViewItems");
			callback({ items: items });
		} catch (err) {
			console.error("Error retrieving items:", err);
		}
	}

	public async handleViewMealTypes(
		socket: Socket,
		callback: (response: {
			mealType: {
				id: number;
				type_name: string;
			}[];
		}) => void
	): Promise<any> {
		try {
			const mealType = await FoodItemService.getMealTypes();
			callback({ mealType: mealType });
		} catch (err) {
			console.error("Error retrieving meal types:", err);
		}
	}

	public async handleViewVotedItems(
		socket: Socket,
		callback: (response: {
			votedItems: {
				id: number;
				foodItemId: number;
				userEmail: string;
				Date: Date;
			}[];
		}) => void
	): Promise<any> {
		try {
			let currentDate = DateService.getCurrentDate();
			const votedItem = await FoodItemService.getVotedItem(currentDate);
			callback({ votedItems: votedItem });
		} catch (err) {
			console.error("Error retrieving voted items:", err);
		}
	}

	public async handleViewAvailableFoodItems(
		socket: Socket,
		callback: (response: {
			items: {
				id: number;
				item_name: string;
				price: number;
				availability_status: number;
				meal_type_id: number;
			}[];
		}) => void
	): Promise<any> {
		try {
			const items = await FoodItemService.getAvailableItems();
			callback({ items: items });
		} catch (err) {
			console.error("Error retrieving items:", err);
		}
	}

	public async selectFoodItemForNextDay(
		foodItemId: number,
		callback: (response: { message: string }) => void
	): Promise<any> {
		try {
			let votedItem = {
				foodItemId: foodItemId,
				userEmail: UserDetail.getUserDetail(),
				date: DateService.getCurrentDate(),
			};
			const selectedItem = await FoodItemService.addVotedItem(votedItem);
			if (selectedItem) {
				callback({
					message: `Item with id ${foodItemId} choosen successfully`,
				});
			} else {
				callback({ message: `Failed to choose an Item with id ${foodItemId}` });
			}
		} catch (error) {
			console.error("Error retrieving items:", error);
		}
	}

	addLog(email: string | null, action: string) {
		let logObject = {
			userEmail: email,
			action: action,
			timestamp: DateService.getCurrentTimestamp(),
		};
		LogService.addLogs(logObject);
	}
}
export default new FoodItemHandler();
