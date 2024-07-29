export interface IRepository<T> {
	getAll(): Promise<T[]>;
	getByEmail(email: string): Promise<T | null>;
	getById(Id: string): Promise<any>;
	add(entity: T): Promise<void>;
	update(entity: T): Promise<void>;
	delete(id: number): Promise<void>;
}
