import pool from "../config/dbConnection";
import DateService from "../services/dateService";
import notificationService from "../services/notificationService";
import { GenericRepository } from "./genericRepository";

export class NotificationRepository extends GenericRepository<any> {
	async getCurrentNotification(): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			let currentDate = DateService.getCurrentDate();
			console.log(currentDate);

			const [rows]: any = await this.pool.query(
				`select * from Notifications where Date = '${currentDate}'`
			);
			console.log("in nr", rows);

			connection.release();
			return rows as any[];
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
