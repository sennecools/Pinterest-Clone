import { getToken, getUserId } from './LocalStorageService';

const createBoard = async (name: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
        throw new Error('No authentication token found.');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, userId }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to create board');
        }

        return response.json();
    } catch (error) {
        console.error('Error creating board:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const getAllBoards = async (): Promise<any> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch boards');
        }

        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            const filteredBoards = data.filter((board: any) => board.pins.length > 2);

            return filteredBoards;
        } else {
            throw new Error('Expected JSON, but received: ' + contentType);
        }
    } catch (error) {
        console.error('Error fetching boards:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const getBoardByUserId = async (): Promise<any> => {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
        throw new Error('No authentication token found.');
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch boards');
        }

        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Expected JSON, but received: ' + contentType);
        }
    } catch (error) {
        console.error('Error fetching boards:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const removeBoardFromUser = async (boardId: number) => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found.');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to delete board');
        }

        return response.json();
    } catch (error) {
        console.error('Error deleting board:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const getBoardById = async (id: string): Promise<any> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch board details');
        }

        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Expected JSON, but received: ' + contentType);
        }
    } catch (error) {
        console.error('Error fetching board details:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const updatePinBoards = async (pinId: number, boardIds: number[]) => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found.');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pins/${pinId}/boards`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ boardIds }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update pin boards');
        }

        return response.json();
    } catch (error) {
        console.error('Error updating pin boards:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};

const BoardService = {
    createBoard,
    getAllBoards,
    getBoardById,
    getBoardByUserId,
    removeBoardFromUser,
    updatePinBoards,
};

export default BoardService;
