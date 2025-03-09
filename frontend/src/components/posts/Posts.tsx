import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../common/skeletons/PostSkeleton";
import Post from "./Post";
import { User } from "../../types";

const getPostsEndpoints = (feedType: 'forYou' | 'following' | 'userPosts' | 'likes', user: User) => {
    if (feedType === "forYou") return '/api/posts'

    if (feedType === 'following') return '/api/posts/following'

    if (feedType === 'userPosts') return `/api/posts/${user.username}`

    if (feedType === 'likes') return `/api/posts/likes/${user._id}`

    return '/api/posts'
}

const Posts = ({ feedType, user }: { feedType: "forYou" | "following" | "userPosts" | "likes", user: User }) => {

    const postEndPoint = getPostsEndpoints(feedType, user)

    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts', feedType],
        queryFn: async () => {
            const res = await fetch(postEndPoint)

            const result = await res.json()

            if (!result.success) {
                return null
            }

            return result.data
        }
    })


    console.log(posts)

    return (
        <>
            {isLoading && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && posts && (
                <div>
                    {posts.map((post: any) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;