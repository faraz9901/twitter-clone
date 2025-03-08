interface Document {
    createdAt?: string;
    updatedAt?: string;
    _id: string
}

interface User extends Document {
    username: string;
    fullname: string;
    password: string;
    email: string;
    followers: string[] | User[];
    following: string[] | User[];
    profileImg: string;
    coverImg: string;
    bio: string;
    link: string;
    likedPosts: string[] | User[];
}

interface Notification extends Document {
    from: string | User;
    to: string | User;
    type: "like" | "follow"
    isRead: boolean
}

interface Post extends Document {
    user: string | User;
    text: string;
    image: string;
    likes: string[] | User[];
    comments: Array<{
        text: string;
        user: string | User;
        createdAt?: Date
    }>
}


export type { User, Notification, Post }