import pool from "../config/dbConnection";
import { Constants } from "../constants/constant";
import { IFoodItem } from "../models/IFoodItem";
import { IMealType } from "../models/IMealType";
import { FoodItemRepository } from "../repository/foodItemRepository";
import { GenericRepository } from "../repository/genericRepository";
import DateService from "./dateService";
import NotificationService from "./notificationService";

class FoodItemService {
	async addItem(item: IFoodItem): Promise<unknown> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.add(item);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async addVotedItem(votedItem: any): Promise<unknown> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Voted_Item");
			const rows = await foodItemRepository.add(votedItem);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async updateItem(item: IFoodItem): Promise<unknown> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.update(item);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async deleteItem(itemId: number): Promise<unknown> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.delete(itemId);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getItems(): Promise<IFoodItem[]> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.getAll();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getAvailableItems(): Promise<IFoodItem[]> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.getAvailableItems();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getMealTypes(): Promise<IMealType[]> {
		try {
			const connection = await pool.getConnection();
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.getMealTypes();
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getVotedItem(currentDate: string): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const foodItemRepository = new FoodItemRepository(pool, "Voted_Item");
			const rows = await foodItemRepository.getVotedItem(currentDate);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
	async prepareFood(foodItemId: number): Promise<any> {
		try {
			const foodItemRepository = new FoodItemRepository(
				pool,
				"Food_Item_Audit"
			);
			const rows = await foodItemRepository.prepareFood(foodItemId);
			const genericRepository = new GenericRepository(pool, "Item");
			let item: any = await genericRepository.getById(foodItemId.toString());
			await this.sendPreparationNotification(item);
			return rows;
		} catch (error) {
			throw error;
		}
	}
	private async sendPreparationNotification(item: any): Promise<void> {
		const notification = {
			notification_type_id: Constants.NotificationIdForPreparedFood,
			message: JSON.stringify({
				itemId: item[0].id,
				itemName: item[0].item_name,
			}),
			Date: DateService.getCurrentDate(),
		};
		await NotificationService.pushNotification(notification);
	}
}
export default new FoodItemService();
