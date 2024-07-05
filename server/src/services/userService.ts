import pool from "../config/dbConnection";
import UserDetail from "../User/userDetail";
import { IUsers } from "../models/IUsers";
import { GenericRepository } from "../repository/genericRepository";

class UserService {
	async getUserByEmail(email: string): Promise<IUsers[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository<IUsers>(pool, "User");
			const rows: any = await genericRepository.getByEmail(email);
			connection.release();
			return rows as any[];
		} catch (error) {
			throw error;
		}
	}

	async getUserEmail(): Promise<string | undefined> {
		try {
			let email: string | undefined = UserDetail.getUserDetail();
			return email;
		} catch (error) {
			throw error;
		}
	}
}
export default new UserService();
