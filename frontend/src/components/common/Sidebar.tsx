import { Link } from "react-router-dom";
import Twitter from "./Twitter";
import { BellRing, House, LogOut, UserRound } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../context/User.Context";

const Sidebar = () => {

    const { user } = useAuth()

    const queryClient = useQueryClient()

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/auth/signout", {
                method: "POST",
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message);
            }
            return result
        },



        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Logout Successfull")
            queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    })



    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
                <Link to='/' className='flex justify-center md:justify-start'>
                    <Twitter className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
                </Link>
                <ul className='flex flex-col gap-3 mt-4'>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <House className='w-8 h-8' />
                            <span className='text-lg hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/notifications'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <BellRing className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Notifications</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to={`/profile/${user?.username}`}
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <UserRound className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Profile</span>
                        </Link>
                    </li>
                </ul>
                {user && (
                    <Link
                        to={`/profile/${user?.username}`}
                        className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
                            <div className='w-8 rounded-full'>
                                <img src={user?.profileImg || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                        <div className='flex justify-between flex-1'>
                            <div className='hidden md:block'>
                                <p className='text-white font-bold text-sm w-24 truncate'>{user?.fullname}</p>
                                <p className='text-slate-500 text-sm'>@{user?.username}</p>
                            </div>
                            <LogOut
                                onClick={(e) => {
                                    e.preventDefault()
                                    logout()
                                }}
                                className='w-5 h-5 cursor-pointer'
                            />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};
export default Sidebar;