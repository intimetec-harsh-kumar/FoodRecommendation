import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";

class FoodItemService {
	async addItem(item: {
		item_name: string;
		price: number;
		availability_status: boolean;
		meal_type_id: number;
	}): Promise<unknown> {
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

	async updateItem(item: {
		id: number;
		item_name: string;
		price: number;
		availability_status: boolean;
		meal_type_id: number;
	}): Promise<unknown> {
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

	async getItems(): Promise<any[]> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.getAll();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getAvailableItems(): Promise<any[]> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const rows = await foodItemRepository.getAvailableItems();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getMealTypes(): Promise<any[]> {
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
