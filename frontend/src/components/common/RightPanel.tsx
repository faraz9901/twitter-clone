import { Link } from "react-router-dom";
import Skeleton from "./skeletons/RightPanelSkeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User } from "../../types";

const RightPanel = () => {
    const queryClient = useQueryClient()
    const { data: users, isLoading } = useQuery({
        queryKey: ['suggested'],
        queryFn: async () => {
            const res = await fetch('/api/users/suggested-users')

            const result = await res.json()

            if (!result.success) throw new Error(result.message)

            return result.data
        }
    })


    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (username: string) => {
            const res = await fetch(`/api/users/follow/${username}`, {
                method: "POST",
            })
            const result = await res.json()
            if (!result.success) throw new Error(result.message)
            return result
        },

        onError: (error) => {
            toast.error(error.message)
        },

        onSuccess: () => {
            toast.success('Followed successfully')
            queryClient.invalidateQueries({ queryKey: ['suggested'] })
        },
    })

    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className=' p-4 rounded-md sticky top-2'>
                <p className='font-bold'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {/* item */}
                    {isLoading && (
                        <>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </>
                    )}
                    {!isLoading &&
                        users?.map((user: User) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={user.profileImg || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28'>
                                            {user.fullname}
                                        </span>
                                        <span className='text-sm text-slate-500'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        disabled={isPending}
                                        className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                        onClick={(e) => {
                                            e.preventDefault()
                                            follow(user.username)
                                        }}
                                    >
                                        {isPending ? "Following" : "Follow"}
                                    </button>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default RightPanel;