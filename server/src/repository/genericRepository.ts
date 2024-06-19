import { Pool } from "mysql2/promise";
import { IRepository } from "../models/IRepository";

export class GenericRepository<T> implements IRepository<T> {
	constructor(public pool: Pool, private tableName: string) {}

	async getAll(): Promise<T[]> {
		const [rows] = await this.pool.query(`SELECT * FROM ${this.tableName}`);
		return rows as T[];
	}

	async getByEmail(email: string): Promise<T> {
		const [rows]: any = await this.pool.query(
			`SELECT r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ?`,
			[email]
		);
		return rows.length > 0 ? rows : [];
	}

	async getById(Id: number): Promise<T> {
		const [rows]: any = await this.pool.query(
			`SELECT r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ?`,
			[Id]
		);
		return rows.length > 0 ? rows : null;
	}

	async add(entity: T): Promise<void> {
		const row: any = await this.pool.query(
			`INSERT INTO ${this.tableName} SET ?`,
			entity
		);
		return row.length > 0 ? row : null;
	}

	async update(entity: T): Promise<void> {
		try {
			const row: any = await this.pool.query(
				`UPDATE ${this.tableName} SET ? WHERE id = ?`,
				[entity, (entity as any).id]
			);
			console.log(row);
			return row.length > 0 ? row : null;
		} catch (err) {
			throw new Error("Internal serveer error");
		}
	}

	async delete(id: number): Promise<void> {
		const row: any = await this.pool.query(
			`DELETE FROM ${this.tableName} WHERE id = ?`,
			[id]
		);
		return row.length > 0 ? row : null;
	}
}
