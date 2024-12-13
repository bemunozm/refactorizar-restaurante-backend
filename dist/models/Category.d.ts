import { CategoryInterface } from "../interfaces/CategoryInterface";
export declare class Category implements CategoryInterface {
    categoryId?: string;
    name: string;
    image?: string;
    private categoryRepository;
    constructor(data: Partial<CategoryInterface>);
    toDatabaseObject(): {
        categoryId: string;
        name: string;
        image: string;
    };
    save(): Promise<this>;
    findByName(): Promise<this>;
    static getAll(): Promise<Category[]>;
    findById(): Promise<this>;
    update(updateData: Partial<CategoryInterface>): Promise<this>;
    delete(): Promise<boolean>;
}
