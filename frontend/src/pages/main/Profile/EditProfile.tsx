import { useState } from "react";
import { User } from "../../../types";
import useUpdateProfile from "../../../hooks/useUpdateProfile";

const EditProfileModal = ({ user }: { user: User }) => {
    const { update, isPending } = useUpdateProfile({
        onUpdateSuccess: () => {
            (document.getElementById('edit_profile_modal') as HTMLDialogElement).close()
            setFormData({ ...formData, newPassword: "", currentPassword: "" })
        }
    })

    const [formData, setFormData] = useState({
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio,
        link: user.link,
        newPassword: "",
        currentPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <button className='btn btn-outline rounded-full btn-sm' onClick={() => (document.getElementById("edit_profile_modal") as HTMLDialogElement).showModal()}>
                Edit profile
            </button >
            <dialog id='edit_profile_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Update Profile</h3>
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            update(formData)
                        }}
                    >
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullname}
                                name='fullname'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Username'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.username}
                                disabled
                                name='username'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <textarea
                                placeholder='Bio'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.bio}
                                name='bio'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='Current Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.newPassword}
                                name='newPassword'
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type='url'
                            placeholder='Link'
                            className='flex-1 w-full input border border-gray-700 rounded p-2 input-md'
                            value={formData.link}
                            name='link'
                            onChange={handleInputChange}
                        />
                        <button disabled={isPending} className='btn btn-primary rounded-full btn-sm text-white'>
                            {isPending ? '...Updating' : 'Update'}
                        </button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>
        </>
    );
};
export default EditProfileModal;