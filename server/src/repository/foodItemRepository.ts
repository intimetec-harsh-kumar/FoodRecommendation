import { GenericRepository } from "./genericRepository";
import { FoodItems } from "../models/FoodItems";

export class FoodItemRepository extends GenericRepository<FoodItems> {
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

	async getItemsForRecommendation(): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				` SELECT 
						f.id AS foodItemId,
						i.item_name as itemName,
						f.rating,
						f.vote,
						f.sentiment,
						f.noOfTimesPrepared,
						(f.noOfTimesPrepared / f.rating) AS preparationToRatingRatio
					FROM 
						FoodItemAudit f inner join items i on i.id=f.foodItemId;`
			);
			connection.release();
			return rows;
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
