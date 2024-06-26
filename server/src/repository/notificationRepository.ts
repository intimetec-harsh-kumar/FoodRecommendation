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
					`select * from Notifications where Date = '${currentDate}' and NotificationTypeId = ${notificationTypeId}`
				);
				return rows;
			}
			const [rows]: any = await this.pool.query(
				`select * from Notifications where Date = '${currentDate}'`
			);

			connection.release();
			return rows as any[];
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
