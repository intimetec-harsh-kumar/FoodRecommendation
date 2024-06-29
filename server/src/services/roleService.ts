import pool from "../config/dbConnection";
import { Users } from "../models/Users";
import { GenericRepository } from "../repository/genericRepository";

class RoleService {
	async getRoleUser(email: string): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository<Users>(pool, "User");
			const rows: any = await genericRepository.getByEmail(email);
			connection.release();
			return rows as any[];
		} catch (error) {
			throw error;
		}
	}
}

export default new RoleService();
