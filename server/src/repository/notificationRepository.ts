import pool from "../config/dbConnection";
import DateService from "../services/dateService";
import { GenericRepository } from "./genericRepository";

export class NotificationRepository extends GenericRepository<any> {
	async getCurrentNotification(notificationTypeId?: number): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			let currentDate = DateService.getCurrentDate();
			if (notificationTypeId) {
				const [rows]: any = await this.pool.query(
					`select * from Notification where Date = '${currentDate}' and notification_type_id = ${notificationTypeId}`
				);
				return rows;
			}
			const [rows]: any = await this.pool.query(
				`select * from Notification where Date = '${currentDate}'`
			);

			connection.release();
			return rows as any[];
		} catch (error) {
			throw error;
		}
	}
	async getTodaysMenuOnTheBasisOfPreference(
		notificationTypeId: number
	): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			let currentDate = DateService.getCurrentDate();
			if (notificationTypeId) {
				const [rows]: any = await this.pool.query(
					`SELECT 
						N.id,
						N.notification_type_id,
						JSON_OBJECT(
							'itemId', JSON_EXTRACT(CAST(N.message AS JSON), '$.itemId'),
							'itemName', JSON_EXTRACT(CAST(N.message AS JSON), '$.itemName'),
							'food_type', IFNULL(I.food_type, ''),
							'originality', IFNULL(I.originality, ''),
							'spice_level', IFNULL(I.spice_level, ''),
							'is_sweet', I.is_sweet
						) AS message,
						N.Date 
					FROM 
						Notification N 
					INNER JOIN 
						Item I ON JSON_EXTRACT(CAST(N.message AS JSON), '$.itemId') = I.id 
					WHERE 
						Date = CURDATE() 
						AND notification_type_id = 6;
					`
				);
				return rows;
			}
			const [rows]: any = await this.pool.query(
				`select * from Notification where Date = '${currentDate}'`
			);
			connection.release();
			return rows as any[];
		} catch (error) {
			throw error;
		}
	}
}
