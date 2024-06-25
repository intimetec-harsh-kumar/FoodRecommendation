import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";

class FoodItemService {
	async addItem(item: {
		item_name: string;
		price: number;
		availability_status: boolean;
		meal_type_id: number;
	}): Promise<unknown> {
		const foodItemRepository = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepository.add(item);
		return rows;
	}

	async addVotedItem(votedItem: any): Promise<unknown> {
		const foodItemRepository = new FoodItemRepository(pool, "VotedItem");
		const rows = await foodItemRepository.add(votedItem);
		return rows;
	}

	async updateItem(item: {
		id: number;
		item_name: string;
		price: number;
		availability_status: boolean;
		meal_type_id: number;
	}): Promise<unknown> {
		const foodItemRepository = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepository.update(item);
		return rows;
	}

	async deleteItem(itemId: number): Promise<unknown> {
		const foodItemRepository = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepository.delete(itemId);
		return rows;
	}

	async getItems(): Promise<any[]> {
		const foodItemRepository = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepository.getAll();
		return rows;
	}

	async getAvailableItems(): Promise<any[]> {
		const foodItemRepository = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepository.getAvailableItems();
		return rows;
	}

	async getMealTypes(): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const foodItemRepository = new FoodItemRepository(pool, "Items");
			const rows = await foodItemRepository.getMealTypes();
			connection.release();
			return rows;
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
export default new FoodItemService();
