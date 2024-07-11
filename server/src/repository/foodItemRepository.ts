import { GenericRepository } from "./genericRepository";
import { IFoodItem } from "../models/IFoodItem";
import { IMealType } from "../models/IMealType";

export class FoodItemRepository extends GenericRepository<any> {
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

	async getItemsForRecommendation(mealType: number): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				` SELECT 
					f.food_item_id,
					i.item_name as itemName,
					m.id as meal_type_id,
					f.rating,
					f.vote,
					f.sentiment,
					f.no_of_times_prepared,
					(f.no_of_times_prepared / f.rating) AS preparationToRatingRatio
				FROM 
					Food_Item_Audit f inner join Item i on i.id=f.food_item_id inner join meal_type m on i.meal_type_id =m.id where meal_type_id = ?;`,
				[mealType]
			);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getDiscardMenuItemList(): Promise<any[]> {
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
						(f.no_of_times_prepared / NULLIF(f.rating, 0)) AS preparationToRatingRatio
					FROM 
						Food_Item_Audit f inner join Item i on i.id=f.food_item_id where f.rating <= 2 order by f.rating desc;`
			);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
	async prepareFood(foodItemId: number): Promise<any[]> {
		try {
			const connection = await this.pool.getConnection();
			const [rows]: any = await connection.query(
				`Update Food_Item_Audit Set no_of_times_prepared = no_of_times_prepared + 1 Where food_item_id = ${foodItemId}`
			);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
}
