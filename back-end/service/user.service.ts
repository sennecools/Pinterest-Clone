import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';
import { UserInput, Role, AuthenticationResponse } from '../types';

const prisma = new PrismaClient();

// Creates a new user with the given username, password, and role
const createUser = async (data: UserInput): Promise<UserInput> => {
    const { username, password, role = 'USER' } = data;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) throw new Error('Username already exists');
    if (password.length < 8) throw new Error('Password must be at least 8 characters long');

    const validRoles: Role[] = ['USER', 'ADMIN'];
    if (!validRoles.includes(role)) throw new Error('Invalid role');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { username, password: hashedPassword, role },
    });

    return {
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role as Role,
    };
};

// Logs in a user with the given username and password
const loginUser = async (username: string, password: string): Promise<AuthenticationResponse> => {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) throw new Error('Invalid username or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid username or password');

    const token = generateJwtToken({
        id: user.id,
        username: user.username,
        role: user.role as 'USER' | 'ADMIN',
    });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role as 'USER' | 'ADMIN',
        },
    };
};

// Gets all users
const getAllUsers = async (): Promise<UserInput[]> => {
    const users = await prisma.user.findMany();
    return users.map((user) => ({
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role as Role,
    }));
};

// Gets a user by ID
const getUserById = async (id: number): Promise<UserInput | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return {
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role as Role,
    };
};

// Updates a user by ID
const updateUser = async (id: number, data: Partial<Omit<UserInput, 'id'>>): Promise<UserInput> => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
    });

    return {
        id: updatedUser.id,
        username: updatedUser.username,
        password: updatedUser.password,
        role: updatedUser.role as Role,
    };
};

// Deletes a user by ID
const deleteUser = async (id: number): Promise<UserInput> => {
    const deletedUser = await prisma.user.delete({
        where: { id },
    });

    return {
        id: deletedUser.id,
        username: deletedUser.username,
        password: deletedUser.password,
        role: deletedUser.role as Role,
    };
};

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
};
