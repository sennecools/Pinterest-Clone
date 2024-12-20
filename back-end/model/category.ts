import { Category as CategoryPrisma, Pin as PinPrisma } from '@prisma/client';
import { Pin } from './pin';

export class Category {
    private id?: number;
    private name: string;
    private pins: Pin[];

    constructor(category: { id?: number; name: string; pins?: Pin[] }) {
        this.validate(category);

        this.id = category.id;
        this.name = category.name;
        this.pins = category.pins || [];
    }

    validate(category: { name: string }) {
        if (!category.name) {
            throw new Error('Category name is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getPins(): Pin[] {
        return this.pins;
    }

    static from(category: CategoryPrisma & { pins?: PinPrisma[] }): Category {
        return new Category({
            id: category.id,
            name: category.name,
            pins: category.pins ? category.pins.map(Pin.from) : [],
        });
    }
}
