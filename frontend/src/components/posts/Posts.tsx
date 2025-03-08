import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../common/skeletons/PostSkeleton";
import Post from "./Post";

const getPostsEndpoints = (feedType: 'forYou' | 'following') => {
    if (feedType === "forYou") return '/api/posts'

    if (feedType === 'following') return '/api/posts/following'

    return '/api/posts'
}

const Posts = ({ feedType }: { feedType: "forYou" | "following" }) => {

    const postEndPoint = getPostsEndpoints(feedType)

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