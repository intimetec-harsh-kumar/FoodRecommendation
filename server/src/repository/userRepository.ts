import { GenericRepository } from "./genericRepository";
import pool from "../config/dbConnection";

export class UserRepository extends GenericRepository<any> {
	async getUserByEmail(email: string): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const rows: any = await this.getByEmail(email);
			console.log("in userrepo", rows);
			connection.release();
			return rows as any[];
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
}
