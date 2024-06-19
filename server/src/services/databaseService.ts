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

			/*const [rows] = await connection.query(
				`
				SELECT r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ?
      `,
				[email]
			);*/

			console.log(rows);
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
		// try {
		// 	const connection = await pool.getConnection();
		// 	const genericRepository = new GenericRepository<{
		// 		item_name: string;
		// 		price: number;
		// 		availability_status: boolean;
		// 		meal_type_id: number;
		// 	}>(pool, "Items");
		// 	const row: any = await genericRepository.add(item);
		// 	console.log(row);

		// 	// const row: any = await connection.query(
		// 	// 	"INSERT INTO Items (item_name, price, availability_status, meal_type_id) VALUES (?, ?, ?, ?)",
		// 	// 	[
		// 	// 		item.item_name,
		// 	// 		item.price,
		// 	// 		item.availability_status,
		// 	// 		item.meal_type_id,
		// 	// 	]
		// 	// );
		// 	connection.release();
		// 	console.log("in dbService", row[0].affectedRows);
		// 	return row[0].affectedRows > 0 ? row[0].affectedRows : null;
		// } catch (err) {
		// 	console.log("Database error:", err);
		// 	throw err;
		// }
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
		// try {
		// 	const connection = await pool.getConnection();
		// 	const row: any = await connection.query(
		// 		"UPDATE Items SET item_name = ?, price = ?, availability_status = ?, meal_type_id = ? WHERE id = ?",
		// 		[
		// 			item.item_name,
		// 			item.price,
		// 			item.availability_status,
		// 			item.meal_type_id,
		// 			item.id,
		// 		]
		// 	);
		// 	connection.release();
		// 	return row[0].affectedRows > 0 ? row[0].affectedRows : null;
		// } catch (err) {
		// 	console.log("Database error:", err);
		// 	throw err;
		// }
	}

	async deleteItem(itemId: number): Promise<unknown> {
		const foodItemRepo = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepo.delete(itemId);
		return rows;
		// try {
		// 	const connection = await pool.getConnection();
		// 	const row: any = await connection.query(
		// 		"DELETE FROM Items WHERE id = ?",
		// 		[itemId]
		// 	);
		// 	connection.release();
		// 	console.log("row[0]", row[0]);

		// 	return row[0].affectedRows > 0 ? row[0].affectedRows : null;
		// } catch (err) {
		// 	console.log("Database error:", err);
		// 	throw err;
		// }
	}

	async getItems(): Promise<any[]> {
		const foodItemRepo = new FoodItemRepository(pool, "Items");
		const rows = await foodItemRepo.getAll();
		return rows;
		// try {
		// 	const connection = await pool.getConnection();
		// 	// const [rows]: any = await connection.query("SELECT * FROM Items");
		// 	const genericRepository = new GenericRepository<any>(pool, "Items");
		// 	const rows: any = await genericRepository.getAll();
		// 	console.log("in dbService", rows);

		// 	connection.release();
		// } catch (err) {
		// 	console.error("Database error:", err);
		// 	throw err;
		// }
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
