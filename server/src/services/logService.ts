import pool from "../config/dbConnection";
import { ILog } from "../models/ILog";
import { GenericRepository } from "../repository/genericRepository";

class logService {
	async addLogs(log: Partial<ILog>): Promise<any> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Log");
			const rows: any = await genericRepository.add(log);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
	async getLogs(): Promise<ILog[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Log");
			const rows: any = await genericRepository.getAll();
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
}

export default new logService();
