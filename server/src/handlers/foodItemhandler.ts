import { Socket } from "socket.io";
import FoodItemService from "../services/foodItemService";
import NotificationService from "../services/notificationService";
import DateService from "../services/dateService";
import User from "../shared/user";
import LogService from "../services/logService";
import { IFoodItem } from "../models/IFoodItem";
import { IMealType } from "../models/IMealType";
import ConsoleService from "../services/consoleService";

class FoodItemHandler {
	public async handleAddItem(
		socket: Socket,
		item: IFoodItem,
		callback: (response: {
			success: boolean;
			message: string;
			error?: string;
		}) => void
	): Promise<void> {
		try {
			const addedItem = await FoodItemService.addItem(item);
			if (addedItem) {
				ConsoleService.displayMessage(
					`Item ${item.item_name} added successfully`
				);
				let userEmail = User.getLoggedInUserEmail(socket.id);
				this.addLog(userEmail, "AddItems");
				NotificationService.pushNotification({
					notification_type_id: 1,
					message: `${item.item_name} have been added to the Items`,
					Date: DateService.getCurrentDate(),
				});
				callback({
					success: true,
					message: `Item ${item.item_name} added successfully`,
				});
			} else {
				ConsoleService.displayMessage(
					`Failed to delete item with name ${item.item_name}`
				);
				callback({
					success: false,
					message: `Failed to delete item with name ${item.item_name}`,
				});
			}
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({
				success: false,
				message: "An error occurred while adding the item",
				error: `Error occured: ${error.message}`,
			});
		}
	}

	public async handleUpdateItem(
		socket: Socket,
		item: IFoodItem,
		callback: (response: {
			success: boolean;
			message: string;
			error?: string;
		}) => void
	): Promise<void> {
		try {
			const updatedItem = await FoodItemService.updateItem(item);
			if (updatedItem) {
				ConsoleService.displayMessage(
					`Item with id ${item.id} updated successfully`
				);
				let userEmail = User.getLoggedInUserEmail(socket.id);
				this.addLog(userEmail, "UpdateItem");
				NotificationService.pushNotification({
					notification_type_id: 2,
					message: `${item.item_name} have been updated to the Items`,
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
		} catch (error: any) {
			ConsoleService.displayMessage(`Error occured: ${error.message}`);

			callback({
				success: false,
				message: `Failed to update item with id ${item.id}`,
				error: `Error occured: ${error.message}`,
			});
		}
	}

	public async handleDeleteItem(
		socket: Socket,
		itemId: number,
		callback: (response: {
			success: boolean;
			message: string;
			error?: string;
		}) => void
	): Promise<void> {
		try {
			const deletedItem = await FoodItemService.deleteItem(itemId);
			if (deletedItem) {
				ConsoleService.displayMessage(
					`Item with ID ${itemId} deleted successfully`
				);
				let userEmail = User.getLoggedInUserEmail(socket.id);
				this.addLog(userEmail, "DeleteItem");
				NotificationService.pushNotification({
					notification_type_id: 3,
					message: `${itemId} have been deleted from the Items`,
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
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({
				success: false,
				message: "An error occurred while deleting the item",
				error: `Error occured: ${error.message}`,
			});
		}
	}

	public async handleViewItems(
		socket: Socket,
		callback: (response: { items: IFoodItem[]; error?: string }) => void
	): Promise<any> {
		try {
			const items = await FoodItemService.getItems();
			let userEmail = User.getLoggedInUserEmail(socket.id);
			this.addLog(userEmail, "ViewItems");
			callback({ items: items });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({ items: [], error: `Error occured: ${error.message}` });
		}
	}

	public async handleViewMealTypes(
		socket: Socket,
		callback: (response: { mealType: IMealType[]; error?: string }) => void
	): Promise<any> {
		try {
			const mealType = await FoodItemService.getMealTypes();
			callback({ mealType: mealType });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({ mealType: [], error: `Error occured: ${error.message}` });
		}
	}

	public async handleViewVotedItems(
		socket: Socket,
		callback: (response: {
			votedItems: {
				id: number;
				food_item_id: number;
				user_email: string;
				Date: Date;
			}[];
			error?: string;
		}) => void
	): Promise<any> {
		try {
			let currentDate = DateService.getCurrentDate();
			const votedItem = await FoodItemService.getVotedItem(currentDate);
			callback({ votedItems: votedItem });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({ votedItems: [], error: `Error occured: ${error.message}` });
		}
	}

	public async handleViewAvailableFoodItems(
		socket: Socket,
		callback: (response: { items: IFoodItem[]; error?: string }) => void
	): Promise<any> {
		try {
			const items = await FoodItemService.getAvailableItems();
			callback({ items: items });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({ items: [], error: `Error occured: ${error.message}` });
		}
	}

	public async selectFoodItemForNextDay(
		socket: Socket,
		foodItemIds: string,
		callback: (response: { message: string; error?: string }) => void
	): Promise<any> {
		try {
			const userEmail = User.getLoggedInUserEmail(socket.id);
			const currentDate = DateService.getCurrentDate();
			const foodItemIdArray = foodItemIds.split(",").map((id) => id.trim());

			const promises = foodItemIdArray.map(async (foodItemId) => {
				let votedItem = {
					food_item_id: foodItemId,
					user_email: userEmail,
					date: currentDate,
				};
				return await FoodItemService.addVotedItem(votedItem);
			});
			const results = await Promise.all(promises);
			const allAdded = results.every((result) => result);

			if (allAdded) {
				callback({
					message: `Items with ids ${foodItemIds} chosen successfully`,
				});
			} else {
				callback({
					message: `Failed to choose some items with ids ${foodItemIds}`,
				});
			}
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({ message: "", error: `Error occured: ${error.message}` });
		}
	}

	public addLog(email: string | undefined, action: string) {
		try {
			let logObject = {
				user_email: email,
				action: action,
				timestamp: DateService.getCurrentTimestamp(),
			};
			LogService.addLogs(logObject);
		} catch (error: any) {
			ConsoleService.displayMessage(`Error occured: ${error.message}`);
		}
	}
	public async handlePrepareFood(
		foodItemId: number,
		callback: (response: { message: string; error?: string }) => void
	) {
		try {
			await FoodItemService.prepareFood(foodItemId);
			callback({
				message: `Items with id ${foodItemId} is choosen for preparation`,
			});
		} catch (error: any) {
			ConsoleService.displayMessage(`Error occured: ${error.message}`);
			callback({ message: "", error: `Error occured: ${error.message}` });
		}
	}
}
export default new FoodItemHandler();
