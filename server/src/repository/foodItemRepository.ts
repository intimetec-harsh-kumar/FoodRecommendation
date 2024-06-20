import { Pool } from "mysql2";
import { GenericRepository } from "./genericRepository";
import { FoodItems } from "../models/FoodItems";

export class FoodItemRepository extends GenericRepository<FoodItems> {
	// async addItem(item: {
	// 	item_name: string;
	// 	price: number;
	// 	availability_status: boolean;
	// 	meal_type_id: number;
	// }): Promise<unknown> {
	// 	try {
	// 		const connection = await this.pool.getConnection();
	// 		const genericRepository = new GenericRepository<{
	// 			item_name: string;
	// 			price: number;
	// 			availability_status: boolean;
	// 			meal_type_id: number;
	// 		}>(this.pool, "Items");
	// 		const row: any = await this.add(item);
	// 		connection.release();
	// 		console.log("in dbService", row[0].affectedRows);
	// 		return row[0].affectedRows > 0 ? row[0].affectedRows : null;
	// 	} catch (err) {
	// 		console.log("Database error:", err);
	// 		throw err;
	// 	}
	// }

	// async updateItem(item: {
	// 	id: number;
	// 	item_name: string;
	// 	price: number;
	// 	availability_status: boolean;
	// 	meal_type_id: number;
	// }): Promise<unknown> {
	// 	try {
	// 		const connection = await this.pool.getConnection();
	// 		const row: any = this.update(item);
	// 		connection.release();
	// 		return row[0].affectedRows > 0 ? row[0].affectedRows : null;
	// 	} catch (err) {
	// 		console.log("Database error:", err);
	// 		throw err;
	// 	}
	// }

	// async deleteItem(itemId: number): Promise<unknown> {
	// 	try {
	// 		const connection = await this.pool.getConnection();
	// 		const row: any = await this.delete(itemId);
	// 		connection.release();
	// 		console.log("row[0]", row[0]);

	// 		return row[0].affectedRows > 0 ? row[0].affectedRows : null;
	// 	} catch (err) {
	// 		console.log("Database error:", err);
	// 		throw err;
	// 	}
	// }

	// async getItems(): Promise<any[]> {
	// 	try {
	// 		const connection = await this.pool.getConnection();
	// 		const rows: any = await this.getAll();
	// 		console.log("in dbService", rows);

	// 		connection.release();
	// 		return rows;
	// 	} catch (err) {
	// 		console.error("Database error:", err);
	// 		throw err;
	// 	}
	// }

	async getMealTypes(): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query("SELECT * FROM Meal_Type");
			connection.release();
			return rows;
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}

	async getAvailableItems(): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				"SELECT * FROM Items where availability_status = 1"
			);
			console.log("in dbService", rows);

			connection.release();
			return rows;
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
