import pool from "../config/dbConnection";
import UserDetail from "../User/userDetail";
import { Users } from "../models/Users";
import { GenericRepository } from "../repository/genericRepository";
import { UserRepository } from "../repository/userRepository";

class UserService {
	async getUsers() {
		try {
			const users = new UserRepository(pool, "User");
			const rows = await users.getAll();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	async getUserByEmail(email: string): Promise<any[]> {
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

	async getUserEmail(): Promise<string | null> {
		try {
			let email: string | null = await UserDetail.getUserDetail();
			return email;
		} catch (error) {
			throw error;
		}
	}
}
export default new UserService();
