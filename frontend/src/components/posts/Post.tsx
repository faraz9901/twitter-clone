
import { Bookmark, Heart, MessageSquare, Repeat2, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/User.Context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";
import { Post, User } from "../../types";
import { timeAgo } from "../../utils";


interface PostProps {
    post: Post;
}

const SinglePost = ({ post }: PostProps) => {
    const [comment, setComment] = useState<string>("");
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { mutate: deletePost, isPending } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            })
            const result = await res.json()
            if (!result.success) throw new Error(result.message)
            return result
        },

        onSuccess: () => {
            toast.success("Post Deleted")
            // as following posts will no include the user posts
            queryClient.invalidateQueries({ queryKey: ['posts', "forYou"] })
        },

        onError: (error) => {
            toast.error(error.message)
        }
    })



    const { mutate: likePost } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/like/${post._id}`, {
                method: "PUT",
            })
            const result = await res.json()
            if (!result.success) throw new Error(result.message)
            return result
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { mutate: postComment, isPending: isCommentPending, isError, error } = useMutation({
        mutationFn: async ({ comment }: { comment: string }) => {
            const res = await fetch(`/api/posts/comment/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: comment })
            })

            const result = await res.json()
            if (!result.success) throw new Error(result.message)
            return result
        },

        onSuccess: () => {
            setComment('')
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const postOwner = post.user as User;
    const isLiked = (post.likes as string[]).includes(user?._id as string);
    const isMyPost = user?._id === postOwner._id;

    const formattedDate = timeAgo(post?.createdAt || "");

    const handleDeletePost = () => deletePost();

    const handlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        postComment({ comment })
    };

    const handleLikePost = () => likePost();

    return (

        <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
            <div className=''>
                <Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
                    <img className="w-8 rounded-full h-8" src={postOwner.profileImg || "/avatar-placeholder.png"} />
                </Link>
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex gap-2 items-center'>
                    <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                        {postOwner.fullname}
                    </Link>
                    <span className='text-gray-700 flex gap-1 text-sm'>
                        <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                        <span>·</span>
                        <span>{formattedDate}</span>
                    </span>
                    {isMyPost && (
                        <span className='flex justify-end flex-1'>
                            {isPending ?
                                <LoadingSpinner size="sm" /> :
                                <Trash className='cursor-pointer  hover:fill-red-500' onClick={handleDeletePost} />}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-3 overflow-hidden'>
                    <span>{post.text}</span>
                    {post.image && (
                        <img
                            src={post.image}
                            className='h-80 object-contain rounded-lg border border-gray-700'
                            alt=''
                        />
                    )}
                </div>
                <div className='flex justify-between mt-3'>
                    <div className='flex gap-4 items-center w-2/3 justify-between'>
                        <div
                            className='flex gap-1 items-center cursor-pointer group'
                            onClick={() => (document.getElementById("comments_modal" + post._id) as HTMLDialogElement).showModal()}
                        >
                            <MessageSquare className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                            <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                                {post.comments.length}
                            </span>
                        </div>
                        {/* We're using Modal Component from DaisyUI */}
                        <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                            <div className='modal-box rounded border border-gray-600'>
                                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                    {post.comments.length === 0 && (
                                        <p className='text-sm text-slate-500'>
                                            No comments yet ! Be the first one
                                        </p>
                                    )}
                                    {post.comments.map((comment: any) => (
                                        <div key={comment._id} className='flex gap-2 items-start'>
                                            <div className='avatar'>
                                                <div className='w-8 rounded-full'>
                                                    <img
                                                        src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-1'>
                                                    <span className='font-bold'>{comment.user.fullname}</span>
                                                    <span className='text-gray-700 text-sm'>
                                                        @{comment.user.username}
                                                    </span>
                                                </div>
                                                <div className='text-sm'>{comment.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form
                                    className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                                    onSubmit={handlePostComment}
                                >

                                    <textarea
                                        className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                                        placeholder='Add a comment...'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                        {isCommentPending ? (
                                            <span className='loading loading-spinner loading-md'></span>
                                        ) : (
                                            "Post"
                                        )}
                                    </button>
                                </form>
                                {isError && <p className="text-red-500 text-sm font-semibold">{error.message}</p>}
                            </div>
                            <form method='dialog' className='modal-backdrop'>
                                <button className='outline-none'>close</button>
                            </form>
                        </dialog>
                        <div className='flex gap-1 items-center group cursor-pointer'>
                            <Repeat2 className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
                            <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                        </div>
                        <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                            {!isLiked && <Heart className='w-4 h-4 cursor-pointer text-red-500 group-hover:fill-red-500' />}
                            {isLiked && <Heart className='w-4 h-4 cursor-pointer fill-red-500 text-red-500 ' />}
                            <span className={`text-sm text-slate-500`} >
                                {post.likes.length}
                            </span>
                        </div>
                    </div>
                    <div className='flex w-1/3 justify-end gap-2 items-center'>
                        <Bookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
                    </div>
                </div>
            </div>
        </div >

    );
};
export default SinglePost;