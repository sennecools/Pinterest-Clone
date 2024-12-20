type Role = 'USER' | 'ADMIN' | 'GUEST';

type UserInput = {
    id?: number;
    username: string;
    password: string;
    role?: Role;
};

type AuthenticationResponse = {
    token: string;
    user: {
        id: number;
        username: string;
        role: Role;
    };
};

type JwtPayload = {
    id: number;
    username: string;
    role: Role;
};

export { Role, UserInput, AuthenticationResponse, JwtPayload };
