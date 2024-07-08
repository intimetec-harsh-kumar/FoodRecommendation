import pool from "../config/dbConnection";
import { IFoodItem } from "../models/IFoodItem";
import { IMealType } from "../models/IMealType";
import { FoodItemRepository } from "../repository/foodItemRepository";

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
}
export default new FoodItemService();
