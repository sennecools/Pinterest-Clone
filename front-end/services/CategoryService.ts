import { getToken } from './LocalStorageService';

const getCategories = async (): Promise<any> => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token found.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch categories');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const CategoryService = {
    getCategories,
};

export default CategoryService;
