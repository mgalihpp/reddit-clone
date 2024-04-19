type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    username: string | null;
    image: string | null;
    password: string | null;
}

type newUser = Omit<User, "id" | "username" | "image" | "emailVerified">