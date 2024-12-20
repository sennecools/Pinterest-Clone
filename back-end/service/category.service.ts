import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Creates a new category with the given name
const createCategory = async (data: { name: string }) => {
    return prisma.category.create({
        data: { name: data.name },
    });
};

// Gets all categories
const getAllCategories = async () => {
    return prisma.category.findMany({
        include: {
            pins: true,
        },
    });
};

// Gets a category by ID
const getCategoryById = async (id: number) => {
    return prisma.category.findUnique({
        where: { id },
        include: {
            pins: true,
        },
    });
};

// Updates a category by ID
const updateCategory = async (id: number, data: { name?: string }) => {
    return prisma.category.update({
        where: { id },
        data: {
            name: data.name,
        },
    });
};

// Deletes a category by ID
const deleteCategory = async (id: number) => {
    return prisma.category.delete({
        where: { id },
    });
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
