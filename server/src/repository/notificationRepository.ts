import pool from "../config/dbConnection";
import { GenericRepository } from "./genericRepository";

export class NotificationRepository extends GenericRepository<any> {
	// async getNotification(): Promise<any[]> {
	// 	try {
	// 		const connection = await pool.getConnection();
	// 		const rows: any = await this.getAll();
	// 		console.log("in notification", rows);
	// 		connection.release();
	// 		return rows as any[];
	// 	} catch (err) {
	// 		console.error("Database error:", err);
	// 		throw err;
	// 	}
	// }
	// async pushNotification(notification: any): Promise<any[]> {
	// 	try {
	// 		const connection = await pool.getConnection();
	// 		const rows: any = await this.add(notification);
	// 		connection.release();
	// 		return rows;
	// 	} catch (error) {
	// 		console.error("Database error:", error);
	// 		throw error;
	// 	}
	// }
}
