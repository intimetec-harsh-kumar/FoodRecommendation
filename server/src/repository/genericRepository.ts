import { Pool } from "mysql2/promise";
import { IRepository } from "../models/IRepository";

export class GenericRepository<T> implements IRepository<T> {
	constructor(public pool: Pool, private tableName: string) {}

	async getAll(): Promise<T[]> {
		try {
			const [rows] = await this.pool.query(`SELECT * FROM ${this.tableName}`);
			return rows as T[];
		} catch (error) {
			throw error;
		}
	}

	async getByEmail(email: string): Promise<T> {
		try {
			const [rows]: any = await this.pool.query(
				`SELECT r.role_name 
        FROM User u 
        JOIN role r ON u.role_id = r.id 
        WHERE u.email = ?`,
				[email]
			);
			return rows.length > 0 ? rows : [];
		} catch (error) {
			throw error;
		}
	}

	async getById(Id: string): Promise<T> {
		try {
			const [rows]: any = await this.pool.query(
				`SELECT * from ${this.tableName}
        WHERE id = ?`,
				[Id]
			);
			return rows.length > 0 ? rows : null;
		} catch (error) {
			throw error;
		}
	}

	async add(entity: T): Promise<any> {
		try {
			const row: any = await this.pool.query(
				`INSERT INTO ${this.tableName} SET ?`,
				entity
			);
			return row.length > 0 ? row : null;
		} catch (error) {
			throw error;
		}
	}

	async update(entity: T): Promise<any> {
		try {
			const row: any = await this.pool.query(
				`UPDATE ${this.tableName} SET ? WHERE id = ?`,
				[entity, (entity as any).id]
			);
			return row.length > 0 ? row : null;
		} catch (error) {
			throw error;
		}
	}

	async delete(id: number): Promise<any> {
		try {
			const row: any = await this.pool.query(
				`DELETE FROM ${this.tableName} WHERE id = ?`,
				[id]
			);
			return row.length > 0 ? row : null;
		} catch (error) {
			throw error;
		}
	}
}
