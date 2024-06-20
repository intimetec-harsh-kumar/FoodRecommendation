import pool from "../config/dbConnection";
import { GenericRepository } from "../repository/genericRepository";
import { NotificationRepository } from "../repository/notificationRepository";

class NotificationService {
	async pushNotification(notification: any): Promise<void> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Notifications");
			const rows: any = await genericRepository.add(notification);
			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
	async getNotification(): Promise<void> {
		try {
			const connection = await pool.getConnection();
			const notificationRepository = new NotificationRepository(
				pool,
				"Notifications"
			);
			const rows: any = await notificationRepository.getCurrentNotification();
			console.log("in ns", rows);

			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
}
export default new NotificationService();
