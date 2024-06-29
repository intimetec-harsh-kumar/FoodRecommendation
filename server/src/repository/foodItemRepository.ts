import { GenericRepository } from "./genericRepository";
import { FoodItems } from "../models/FoodItems";

export class FoodItemRepository extends GenericRepository<FoodItems> {
	async getMealTypes(): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query("SELECT * FROM Meal_Type");
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getAvailableItems(): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				"SELECT * FROM Item where availability_status = 1"
			);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getVotedItem(currentDate: string): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				`SELECT * FROM Voted_Item where Date = DATE_SUB('${currentDate}', INTERVAL 1 DAY)`
			);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getItemsForRecommendation(): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				` SELECT 
						f.food_item_id,
						i.item_name as itemName,
						f.rating,
						f.vote,
						f.sentiment,
						f.no_of_times_prepared,
						(f.no_of_times_prepared / f.rating) AS preparationToRatingRatio
					FROM 
						Food_Item_Audit f inner join Item i on i.id=f.food_item_id;`
			);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
}
