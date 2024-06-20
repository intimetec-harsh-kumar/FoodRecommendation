import pool from "../config/dbConnection";
import { GenericRepository } from "../repository/genericRepository";

class logService {
	async addLogs(log: any): Promise<void> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Log");
			const rows: any = await genericRepository.add(log);
			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
	async getLogs(): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Log");
			const rows: any = await genericRepository.getAll();
			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
}

export default new logService();
