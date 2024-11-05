export interface BaseRepository<T> {
    findAll(): Promise<T[]>;
    findOne(query: Partial<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
  