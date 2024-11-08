import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryInterface } from "../interfaces/CategoryInterface";

export class Category implements CategoryInterface {
    public categoryId?: string;
    public name: string;
    public image: string;
    private categoryRepository: CategoryRepository;

    constructor(data: Partial<CategoryInterface>) {
        this.categoryId = data.categoryId;
        this.name = data.name || '';
        this.image = data.image;
        this.categoryRepository = new CategoryRepository();
    }

    public async save() {
        const savedCategory = await this.categoryRepository.save(this);
        this.categoryId = savedCategory.id;
        return this;
    }

    public async findByName() {
        const category = await this.categoryRepository.findOne({name: this.name});

        if (category) {
            this.categoryId = category.id;
            this.name = category.name;
            this.image = category.image;
            return this;
        } else {
            return null;
        }
    }


    static async getAll() {
        const categoryRepository = new CategoryRepository();
        const categoryInstances = await categoryRepository.findAll();

        if (categoryInstances) {
            const categories = categoryInstances.map((categoryInstance) => {
                return new Category({
                    categoryId: categoryInstance.id,
                    name: categoryInstance.name,
                    image: categoryInstance.image,
                });
            });

            return categories;
        }

        return [];
    }

    public async findById() {
        const category = await this.categoryRepository.findById(this.categoryId);

        if (category) {
            this.categoryId = category.id;
            this.name = category.name;
            this.image = category.image;
            return this;
        } else {
            return null;
        }
    }

    public async update(updateData: Partial<CategoryInterface>) {
        const updatedInstance = await this.categoryRepository.update(this.categoryId, updateData);

        if (updatedInstance) {
            this.categoryId = updatedInstance.id;
            this.name = updatedInstance.name;
            this.image = updatedInstance.image;
            return this;
        } else {
            return null;
        }
    }

    public async delete() {
        return await this.categoryRepository.delete(this.categoryId);
    }
}
