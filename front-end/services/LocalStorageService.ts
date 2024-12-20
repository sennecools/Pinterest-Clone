export const isUserLoggedIn = (): boolean => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('loggedInUser');
    }
    return false;
};

export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            const { token } = JSON.parse(loggedInUser);
            return token || null;
        } catch (error) {
            console.error('Error parsing token from localStorage:', error);
            return null;
        }
    }
    return null;
};

export const getUserId = (): number | null => {
    if (typeof window === 'undefined') return null;

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            const { id } = JSON.parse(loggedInUser);
            return id || null;
        } catch (error) {
            console.error('Error parsing user ID from localStorage:', error);
            return null;
        }
    }
    return null;
};

export const getUserRole = (): string => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            const { role } = JSON.parse(loggedInUser);
            return role;
        } catch (error) {
            console.error('Error parsing user role:', error);
            return '';
        }
    }
    return '';
};
