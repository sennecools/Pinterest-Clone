import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch total statistics like total users, boards, and pins
export const getAdminStats = async () => {
    try {
        const totalUsers = await prisma.user.count();
        const totalBoards = await prisma.board.count();
        const totalPins = await prisma.pin.count();

        return {
            totalUsers,
            totalBoards,
            totalPins,
        };
    } catch (error) {
        throw new Error('Error fetching admin statistics');
    }
};

// Get all users for admin management
export const getAllUsers = async () => {
    try {
        return await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
            },
        });
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

// Delete a user by ID
export const deleteUser = async (userId: number) => {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });
        return deletedUser;
    } catch (error) {
        throw new Error('Error deleting user');
    }
};
