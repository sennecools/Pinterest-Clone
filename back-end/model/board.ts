import { Board as BoardPrisma, Pin as PinPrisma, User as UserPrisma } from '@prisma/client';
import { Pin } from './pin';
import { User } from './user';

export class Board {
    private id?: number;
    private name: string;
    private user: User | undefined;
    private pins: Pin[];
    private createdAt: Date;

    constructor(board: { id?: number; name: string; user?: User; pins?: Pin[]; createdAt?: Date }) {
        this.validate(board);

        this.id = board.id;
        this.name = board.name;
        this.user = board.user;
        this.pins = board.pins || [];
        this.createdAt = board.createdAt || new Date();
    }

    validate(board: { name: string; user?: User }) {
        if (!board.name) {
            throw new Error('Board name is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getUser(): User | undefined {
        return this.user;
    }

    getPins(): Pin[] {
        return this.pins;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static from(board: BoardPrisma & { user?: UserPrisma; pins?: PinPrisma[] }): Board {
        return new Board({
            id: board.id,
            name: board.name,
            user: board.user ? User.from(board.user) : undefined,
            pins: board.pins ? board.pins.map(Pin.from) : [],
            createdAt: board.createdAt,
        });
    }
}
