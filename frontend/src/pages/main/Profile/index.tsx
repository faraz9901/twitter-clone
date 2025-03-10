import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProfileSkeleton from "../../../components/common/skeletons/ProfileSkeleton";
import { POSTS } from "../../../data";
import Posts from "../../../components/posts/Posts";
import { CalendarDays, Link as Link2, MoveLeft, Pencil } from "lucide-react";
import { useAuth } from "../../../context/User.Context";
import { useQuery } from "@tanstack/react-query";
import { getJoinedDate } from "../../../utils";
import toast from "react-hot-toast";
import { imageCompressor } from "../../../utils/imageCompressor";
import useUpdateProfile from "../../../hooks/useUpdateProfile";
import useFollow from "../../../hooks/useFollow";
import EditProfileModal from "./EditProfile";

const ProfilePage = () => {
    const { user: CurrentUser } = useAuth()
    const { username } = useParams()
    const [feedType, setFeedType] = useState<"userPosts" | "likes">("userPosts")

    const { follow, isPending: isFollowing } = useFollow()

    const { update, isPending } = useUpdateProfile({
        onUpdateSuccess: () => {
            setCoverImg(null)
            setProfileImg(null)
        }
    })


    const { data: user, isLoading } = useQuery({
        queryKey: ['user', username],
        queryFn: async () => {
            const res = await fetch(`/api/users/profile/${username}`)
            const result = await res.json()
            if (!result.success) return null
            return result.data
        }
    })


    const [coverImg, setCoverImg] = useState<Blob | null>(null);
    const [profileImg, setProfileImg] = useState<Blob | null>(null);
    const coverImgRef = useRef<HTMLInputElement | null>(null);
    const profileImgRef = useRef<HTMLInputElement | null>(null);

    const isMyProfile = CurrentUser?._id === user?._id;
    const coverImageLink = coverImg ? URL.createObjectURL(coverImg) : ""
    const profileImageLink = profileImg ? URL.createObjectURL(profileImg) : ""

    const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>, state: "coverImg" | "profileImg") => {
        if (e.target.files === null) return;
        const file = e.target.files[0];
        try {
            const toastId = toast.loading('Processing image...')
            const compressedImage = await imageCompressor(file)
            if (!compressedImage) return toast.error('Invalid Image Format')
            const setImage = state === "coverImg" ? setCoverImg : setProfileImg
            setImage(compressedImage)
            toast.dismiss(toastId)
        } catch (error) {
            toast.error('Failed to process image')
        }
    };

    return (
        <>
            <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
                {isLoading && <ProfileSkeleton />}
                {!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='flex flex-col'>
                    {!isLoading && user && (
                        <>
                            <div className='flex gap-10 px-4 py-2 items-center'>
                                <Link to='/'>
                                    <MoveLeft className='w-4 h-4' />
                                </Link>
                                <div className='flex flex-col'>
                                    <p className='font-bold text-lg'>{user?.fullname}</p>
                                    <span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
                                </div>
                            </div>
                            {/* COVER IMG */}
                            <div className='relative group/cover'>
                                <img
                                    src={coverImageLink || user?.coverImg || "/cover.png"}
                                    className='h-52 w-full object-cover'
                                    alt='cover image'
                                />
                                {isMyProfile && (
                                    <div
                                        className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                                        onClick={() => coverImgRef?.current?.click()}
                                    >
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                )}

                                <input
                                    type='file'
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                <input
                                    type='file'
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />
                                {/* USER AVATAR */}
                                <div className='avatar absolute -bottom-16 left-4'>
                                    <div className='w-32 rounded-full relative group/avatar'>
                                        <img src={profileImageLink || user?.profileImg || "/avatar-placeholder.png"} />
                                        <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                            {isMyProfile && (
                                                <Pencil
                                                    className='w-4 h-4 text-white'
                                                    onClick={() => profileImgRef?.current?.click()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal user={user} />}
                                {!isMyProfile && (
                                    <button
                                        disabled={isFollowing}
                                        className='btn btn-outline rounded-full btn-sm'
                                        onClick={() => follow(user.username)}
                                    >
                                        {CurrentUser?.following.includes(user._id) ? 'Unfollow' : 'Follow'}
                                    </button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                                        onClick={() => update({ coverImg, profileImg })}
                                    >
                                        {isPending ? "Updating..." : 'Update'}
                                    </button>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 mt-14 px-4'>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-lg'>{user?.fullname}</span>
                                    <span className='text-sm text-slate-500'>@{user?.username}</span>
                                    <span className='text-sm my-1'>{user?.bio}</span>
                                </div>

                                <div className='flex gap-2 flex-wrap'>
                                    {user?.link && (
                                        <div className='flex gap-1 items-center '>
                                            <>
                                                <Link2 className='w-3 h-3 text-slate-500' />
                                                <a
                                                    href={user?.link}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-sm text-blue-500 hover:underline'
                                                >
                                                    {user?.link}
                                                </a>
                                            </>
                                        </div>
                                    )}
                                    <div className='flex gap-2 items-center'>
                                        <CalendarDays className='w-4 h-4 text-slate-500' />
                                        <span className='text-sm text-slate-500'>Joined {getJoinedDate(user?.createdAt || "")}</span>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.following.length}</span>
                                        <span className='text-slate-500 text-xs'>Following</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.followers.length}</span>
                                        <span className='text-slate-500 text-xs'>Followers</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full border-b border-gray-700 mt-4'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("userPosts")}
                                >
                                    Posts
                                    {feedType === "userPosts" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("likes")}
                                >
                                    Likes
                                    {feedType === "likes" && (
                                        <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                            <Posts feedType={feedType} user={user} />
                        </>
                    )}

                </div>
            </div>
        </>
    );
};
export default ProfilePage;