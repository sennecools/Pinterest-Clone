import { User } from '@types';

const loginUser = async (user: User): Promise<Response> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Unable to connect to the server.');
    }
};

const signupUser = async (user: User): Promise<Response> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create user');
        }

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        throw new Error('Unable to connect to the server or invalid input.');
    }
};
const UserService = {
    loginUser,
    signupUser,
};

export default UserService;
