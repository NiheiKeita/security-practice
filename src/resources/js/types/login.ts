
export type User = {
    id: number;
    name: string;
    email: string;
};
export type PageProps = {
    auth?: {
        user: User | null;
    };
};
