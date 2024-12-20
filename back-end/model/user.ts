import { User as UserPrisma, Board as BoardPrisma, Pin as PinPrisma } from '@prisma/client';
import { Board } from './board';
import { Pin } from './pin';
import { Role } from '../types';

export class User {
    private id?: number;
    private username: string;
    private password: string;
    private role: Role;
    private boards: Board[];
    private savedPins: Pin[];

    constructor(user: {
        id?: number;
        username: string;
        password: string;
        role?: Role;
        boards?: Board[];
        savedPins?: Pin[];
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role || 'USER';
        this.boards = user.boards || [];
        this.savedPins = user.savedPins || [];
    }

    validate(user: { username: string; password: string }) {
        if (!user.username) {
            throw new Error('Username is required');
        }
        if (user.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): string {
        return this.role;
    }

    getBoards(): Board[] {
        return this.boards;
    }

    getSavedPins(): Pin[] {
        return this.savedPins;
    }

    static from(user: UserPrisma & { boards?: BoardPrisma[]; savedPins?: PinPrisma[] }): User {
        return new User({
            id: user.id,
            username: user.username,
            password: user.password,
            role: user.role as Role,
            boards: user.boards ? user.boards.map(Board.from) : [],
            savedPins: user.savedPins ? user.savedPins.map(Pin.from) : [],
        });
    }
}
