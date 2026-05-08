export type BaseRepository<T> = {
	getAll(ownerId?: string): Promise<T[]>;
	getById(id: string, ownerId?: string): Promise<T | null>;
	create(item: T): Promise<T>;
	update(id: string, item: T, ownerId?: string): Promise<T>;
	delete(id: string, ownerId?: string): Promise<void>;
	clear(ownerId?: string): Promise<void>;
};
