import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Notification as NotificationType } from "../../types";

const Notification = () => {
    const queryClient = useQueryClient()
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/notifications");
            const result = await res.json();
            if (!result.success) throw new Error(result.message);
            return result.data;
        },
    })

    const { mutate: deleteNotifications } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/notifications", {
                method: 'DELETE'
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);
            return result.data;
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            toast.success('Notifications Deleted')
        }
    })

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Notifications</p>
                    <div className='dropdown '>
                        <div tabIndex={0} role='button' className='m-1'>
                            <Settings className='w-4' />
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            <li>
                                <a onClick={() => deleteNotifications()}>Delete all notifications</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}
                {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
                {notifications?.map((notification: NotificationType) => {
                    // checking if from is an user object
                    const from = typeof notification.from === 'object' ? notification.from : null
                    return (
                        <div className='border-b border-gray-700' key={notification._id}>
                            <div className='flex gap-2 p-4'>
                                <Link className="flex  gap-2" to={`/profile/${from?.username}`}>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={from?.profileImg || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className='flex items-end gap-1'>
                                        <span className='font-bold'>@{from?.username}</span>{" "}
                                        {notification.type === "follow" ? "followed you" : "liked your post"}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};
export default Notification;