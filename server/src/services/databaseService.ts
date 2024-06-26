import pool from "../config/dbConnection";
import { Users } from "../models/Users";
import { FoodItemRepository } from "../repository/foodItemRepository";
import { GenericRepository } from "../repository/genericRepository";

class DatabaseService {
	async getUserByEmail(email: string): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository<Users>(pool, "Users");
			const rows: any = await genericRepository.getByEmail(email);
			connection.release();
			return rows as any[];
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}

	async addItem(item: {
		item_name: string;
		price: number;
		availability_status: boolean;
		meal_type_id: number;
	}): Promise<unknown> {
		const foodItemRepo = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepo.add(item);
		return rows;
	}

	async updateItem(item: {
		id: number;
		item_name: string;
		price: number;
		availability_status: boolean;
		meal_type_id: number;
	}): Promise<unknown> {
		const foodItemRepo = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepo.update(item);
		return rows;
	}

	async deleteItem(itemId: number): Promise<unknown> {
		const foodItemRepo = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepo.delete(itemId);
		return rows;
	}

	async getItems(): Promise<any[]> {
		const foodItemRepo = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepo.getAll();
		return rows;
	}

	async getMealTypes(): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const [rows]: any = await connection.query("SELECT * FROM Meal_Type");
			connection.release();
			return rows;
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}

export default new DatabaseService();
