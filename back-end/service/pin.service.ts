import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Creates a new pin with the given title, image URL, description, and optional category IDs
const createPin = async (data: {
    title: string;
    imageUrl: string;
    description?: string;
    categories?: number[];
}) => {
    return prisma.pin.create({
        data: {
            title: data.title,
            imageUrl: data.imageUrl,
            description: data.description,
            categories: {
                connect: data.categories?.map((id) => ({ id })),
            },
        },
        include: {
            categories: true,
        },
    });
};

// Links an existing pin to multiple boards of the user
const addPinToBoards = async (pinId: number, boardIds: number[]) => {
    return prisma.pin.update({
        where: { id: pinId },
        data: {
            boards: {
                connect: boardIds.map((boardId) => ({ id: boardId })),
            },
        },
        include: {
            boards: true,
        },
    });
};

// Unlinks a pin from multiple boards of the user
const removePinFromBoards = async (pinId: number, boardIds: number[]) => {
    return prisma.pin.update({
        where: { id: pinId },
        data: {
            boards: {
                disconnect: boardIds.map((boardId) => ({ id: boardId })),
            },
        },
        include: {
            boards: true,
        },
    });
};

// Gets paginated pins sorted by newest first
const getAllPins = async (page: number = 1, pageSize: number = 12) => {
    const skip = (page - 1) * pageSize;

    return prisma.pin.findMany({
        take: pageSize,
        skip: skip,
        include: {
            boards: true,
            categories: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

// Gets all pins for a specific category
const getPinsByCategory = async (categoryId: number) => {
    return prisma.pin.findMany({
        where: {
            categories: {
                some: { id: categoryId },
            },
        },
        include: {
            boards: true,
            categories: true,
        },
    });
};

// Gets all pins for a specific user
const getPinsByUser = async (userId: number) => {
    return prisma.pin.findMany({
        where: {
            boards: {
                some: { userId: userId },
            },
        },
        include: {
            boards: true,
            categories: true,
        },
    });
};

// Gets all pins for a specific board
const getPinsByBoard = async (boardId: number) => {
    return prisma.pin.findMany({
        where: {
            boards: {
                some: { id: boardId },
            },
        },
        include: {
            boards: true,
            categories: true,
        },
    });
};

// Gets a pin by ID
const getPinById = async (id: number) => {
    return prisma.pin.findUnique({
        where: { id },
        include: {
            boards: true,
            categories: true,
        },
    });
};

// Updates a pin by ID
const updatePin = async (
    id: number,
    data: {
        title?: string;
        imageUrl?: string;
        description?: string;
        boardIds?: number[];
        categories?: number[];
    }
) => {
    return prisma.pin.update({
        where: { id },
        data: {
            title: data.title,
            imageUrl: data.imageUrl,
            description: data.description,
            boards: data.boardIds ? { set: data.boardIds.map((id) => ({ id })) } : undefined,
            categories: data.categories
                ? { set: data.categories.map((id) => ({ id })) }
                : undefined,
        },
        include: {
            boards: true,
            categories: true,
        },
    });
};

// Deletes a pin by ID
const deletePin = async (id: number) => {
    return prisma.pin.delete({
        where: { id },
    });
};

export default {
    createPin,
    addPinToBoards,
    removePinFromBoards,
    getAllPins,
    getPinsByCategory,
    getPinsByUser,
    getPinsByBoard,
    getPinById,
    updatePin,
    deletePin,
};
