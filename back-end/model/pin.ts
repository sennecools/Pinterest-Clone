import {
    Pin as PinPrisma,
    Board as BoardPrisma,
    Category as CategoryPrisma,
    User as UserPrisma,
} from '@prisma/client';
import { Board } from './board';
import { Category } from './category';
import { User } from './user';

export class Pin {
    private id?: number;
    private title: string;
    private imageUrl: string;
    private description?: string | null;
    private board?: Board;
    private categories: Category[];
    private usersSaved: User[];
    private createdAt: Date;

    constructor(pin: {
        id?: number;
        title: string;
        imageUrl: string;
        description?: string | null;
        board?: Board;
        categories?: Category[];
        usersSaved?: User[];
        createdAt?: Date;
    }) {
        this.validate(pin);

        this.id = pin.id;
        this.title = pin.title;
        this.imageUrl = pin.imageUrl;
        this.description = pin.description ?? null;
        this.board = pin.board;
        this.categories = pin.categories || [];
        this.usersSaved = pin.usersSaved || [];
        this.createdAt = pin.createdAt || new Date();
    }

    validate(pin: { title: string; imageUrl: string }) {
        if (!pin.title) {
            throw new Error('Title is required');
        }
        if (!pin.imageUrl) {
            throw new Error('Image URL is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    getDescription(): string | null | undefined {
        return this.description;
    }

    getBoard(): Board | undefined {
        return this.board;
    }

    getCategories(): Category[] {
        return this.categories;
    }

    getUsersSaved(): User[] {
        return this.usersSaved;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static from(
        pin: PinPrisma & {
            board?: BoardPrisma;
            categories?: CategoryPrisma[];
            usersSaved?: UserPrisma[];
        }
    ): Pin {
        return new Pin({
            id: pin.id,
            title: pin.title,
            imageUrl: pin.imageUrl,
            description: pin.description,
            board: pin.board ? Board.from(pin.board) : undefined,
            categories: pin.categories ? pin.categories.map(Category.from) : [],
            usersSaved: pin.usersSaved ? pin.usersSaved.map(User.from) : [],
            createdAt: pin.createdAt,
        });
    }
}
