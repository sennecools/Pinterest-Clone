import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const seed = async () => {
    // Create 2 users (1 admin, 1 normal user)
    const password1 = await hashPassword('admin_password');
    const password2 = await hashPassword('user_password');

    const admin = await prisma.user.create({
        data: {
            username: 'admin_user',
            password: password1,
            role: 'ADMIN', // Admin role
        },
    });

    const normalUser = await prisma.user.create({
        data: {
            username: 'normal_user',
            password: password2,
            role: 'USER', // Normal user
        },
    });

    console.log('Users created:', admin, normalUser);

    // Create some categories
    const categories = await prisma.category.createMany({
        data: [
            { name: 'Art' },
            { name: 'Nature' },
            { name: 'Technology' },
            { name: 'Food' },
            { name: 'Music' },
            { name: 'Travel' },
            { name: 'DIY' },
            { name: 'Photography' },
        ],
    });

    // Create Boards for Admin and Normal Users
    const adminBoard1 = await prisma.board.create({
        data: {
            name: "Admin's Art Collection",
            userId: admin.id,
        },
    });

    const adminBoard2 = await prisma.board.create({
        data: {
            name: "Admin's Tech Ideas",
            userId: admin.id,
        },
    });

    const normalUserBoard1 = await prisma.board.create({
        data: {
            name: "User's Photography Portfolio",
            userId: normalUser.id,
        },
    });

    const normalUserBoard2 = await prisma.board.create({
        data: {
            name: "User's Travel Bucket List",
            userId: normalUser.id,
        },
    });

    console.log('Boards created:', adminBoard1, adminBoard2, normalUserBoard1, normalUserBoard2);

    // Create more pins with different categories
    const pin1 = await prisma.pin.create({
        data: {
            title: 'Amazing Forest',
            imageUrl: 'https://picsum.photos/600/400',
            description: 'A beautiful forest with tall trees.',
            categories: {
                connect: [{ id: 7 }],
            },
        },
    });

    const pin2 = await prisma.pin.create({
        data: {
            title: 'Creative Artwork',
            imageUrl: 'https://picsum.photos/600/400',
            description: 'A piece of creative artwork showcasing modern art.',
            categories: {
                connect: [{ id: 2 }],
            },
        },
    });

    const pin3 = await prisma.pin.create({
        data: {
            title: 'Futuristic Smart City Concept',
            imageUrl: 'https://picsum.photos/800/600',
            description:
                'An innovative concept for smart cities featuring autonomous vehicles and eco-friendly buildings.',
            boards: {
                connect: [{ id: adminBoard2.id }],
            },
            categories: {
                connect: [{ id: 3 }, { id: 1 }],
            },
        },
    });

    const pin4 = await prisma.pin.create({
        data: {
            title: 'Hiking in the Rocky Mountains',
            imageUrl: 'https://picsum.photos/700/500',
            description:
                'A challenging yet rewarding hike through the Rocky Mountains, with breathtaking views.',
            boards: {
                connect: [{ id: normalUserBoard1.id }],
            },
            categories: {
                connect: [{ id: 5 }, { id: 6 }, { id: 1 }, { id: 2 }],
            },
        },
    });

    // Additional pins with multiple categories and long descriptions/titles
    const pin5 = await prisma.pin.create({
        data: {
            title: 'Autumn Forest Walk: Colors of Fall',
            imageUrl: 'https://picsum.photos/800/600',
            description:
                'The vibrant colors of fall leaves create a stunning contrast against the green pine trees.',
            boards: {
                connect: [{ id: adminBoard1.id }],
            },
            categories: {
                connect: [{ id: 2 }, { id: 7 }],
            },
        },
    });

    const pin6 = await prisma.pin.create({
        data: {
            title: 'Exploring the Best Vegan Street Foods Around the World',
            imageUrl: 'https://picsum.photos/500/500',
            description:
                'A roundup of the best vegan street foods you must try while traveling, from tacos to dim sum.',
            boards: {
                connect: [{ id: normalUserBoard2.id }],
            },
            categories: {
                connect: [{ id: 5 }, { id: 6 }, { id: 1 }, { id: 2 }],
            },
        },
    });

    const pin7 = await prisma.pin.create({
        data: {
            title: 'Stunning Photography of Urban Landscapes at Night',
            imageUrl: 'https://picsum.photos/600/400',
            description:
                'Urban photography captures the beauty of city lights at night, highlighting architecture and street life.',
            boards: {
                connect: [{ id: normalUserBoard1.id }],
            },
            categories: {
                connect: [{ id: 8 }, { id: 1 }],
            },
        },
    });

    const pin8 = await prisma.pin.create({
        data: {
            title: 'Journey Through Japan: The Land of Contrasts',
            imageUrl: 'https://picsum.photos/750/500',
            description:
                'From the neon lights of Tokyo to the serene temples of Kyoto, Japan offers a unique blend of old and new.',
            boards: {
                connect: [{ id: normalUserBoard2.id }],
            },
            categories: {
                connect: [{ id: 2 }, { id: 7 }],
            },
        },
    });

    const pin9 = await prisma.pin.create({
        data: {
            title: 'DIY Home Decor: Upcycling Old Furniture',
            imageUrl: 'https://picsum.photos/700/500',
            description:
                'Transform your home with these creative DIY ideas for upcycling old furniture and decor items.',
            boards: {
                connect: [{ id: adminBoard1.id }],
            },
            categories: {
                connect: [{ id: 7 }],
            },
        },
    });

    const pin10 = await prisma.pin.create({
        data: {
            title: 'Music Festivals Around the World: A Visual Journey',
            imageUrl: 'https://picsum.photos/800/600',
            description:
                'Experience the energy and excitement of music festivals from Coachella to Glastonbury.',
            boards: {
                connect: [{ id: normalUserBoard2.id }],
            },
            categories: {
                connect: [{ id: 5 }, { id: 6 }, { id: 1 }, { id: 2 }],
            },
        },
    });

    const pin11 = await prisma.pin.create({
        data: {
            title: 'Capturing the Beauty of the Night Sky: Astrophotography Tips',
            imageUrl: 'https://picsum.photos/600/400',
            description:
                'Learn how to capture stunning images of the night sky, from star trails to the Milky Way.',
            boards: {
                connect: [{ id: normalUserBoard1.id }],
            },
            categories: {
                connect: [{ id: 8 }],
            },
        },
    });

    const pin12 = await prisma.pin.create({
        data: {
            title: 'The Art of Sushi Making: A Step-by-Step Guide',
            imageUrl: 'https://picsum.photos/500/500',
            description:
                'Master the art of sushi making with this detailed guide to preparing nigiri, sashimi, and maki rolls.',
            boards: {
                connect: [{ id: normalUserBoard2.id }],
            },
            categories: {
                connect: [{ id: 4 }],
            },
        },
    });

    const pin13 = await prisma.pin.create({
        data: {
            title: 'Innovative Tech Gadgets You Need to See to Believe',
            imageUrl: 'https://picsum.photos/700/500',
            description:
                'Discover the latest tech gadgets that push the boundaries of innovation and creativity.',
            boards: {
                connect: [{ id: adminBoard2.id }],
            },
            categories: {
                connect: [{ id: 3 }],
            },
        },
    });

    console.log('Pins created:', pin1, pin2);

    // Disconnect Prisma Client after seeding
    await prisma.$disconnect();
};

// Run the seed function
seed()
    .then(() => {
        console.log('Seeding complete.');
    })
    .catch((error) => {
        console.error('Error during seeding:', error);
    });
