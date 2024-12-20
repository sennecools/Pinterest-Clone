const ApiService = {
    post: async (url: string, data: any) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to connect to the API');
        }

        return response.json();
    },
};

export default ApiService;
