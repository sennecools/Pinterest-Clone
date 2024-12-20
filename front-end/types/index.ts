export type User = {
    username?: string;
    password?: string;
};

export type StatusMessage = {
    message: string;
    type: 'error' | 'success';
};
