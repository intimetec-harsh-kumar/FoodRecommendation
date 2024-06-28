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
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
