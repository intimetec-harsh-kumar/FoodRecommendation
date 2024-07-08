import pool from "../config/dbConnection";
import { IUsers } from "../models/IUsers";
import { GenericRepository } from "../repository/genericRepository";

class RoleService {
	async getRoleUser(email: string): Promise<any> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository<IUsers>(pool, "User");
			const rows = await genericRepository.getByEmail(email);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
}

export default new RoleService();
