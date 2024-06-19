export interface IRepository<T> {
	getAll(): Promise<T[]>;
	getByEmail(email: string): Promise<T | null>;
	add(entity: T): Promise<void>;
	update(entity: T): Promise<void>;
	delete(id: number): Promise<void>;
}
