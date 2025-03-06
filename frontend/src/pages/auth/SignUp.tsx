import { Link } from "react-router-dom";
import React, { useState } from "react";

import { Mail, PencilLine, RectangleEllipsis, UserRound } from 'lucide-react'

import Twitter from "../../components/common/Twitter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SignUpPage = () => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullname: "",
        password: "",
    });


    const { isPending, mutate } = useMutation({
        mutationFn: async (data: { email: string; username: string; fullname: string; password: string; }) => {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (!result.success) {
                throw new Error(result.message)
            }
            return result
        },
        onSuccess: () => {
            toast.success("Account created successfully")
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formData)
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <Twitter width={200} height={200} viewBox="0 0 240 240" />
            </div>

            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <Twitter className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    <label className='input input-bordered rounded w-full flex items-center gap-2'>
                        <Mail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <UserRound />
                            <input
                                type='text'
                                className='grow '
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <PencilLine />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Full Name'
                                name='fullname'
                                onChange={handleInputChange}
                                value={formData.fullname}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered w-full rounded flex items-center gap-2'>
                        <RectangleEllipsis />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button disabled={isPending} className='btn rounded-full btn-primary text-white'>{isPending ? <>Signing in <LoadingSpinner size="xs" /> </> : "Sign up"}</button>
                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/sign-in'>
                        <button className='btn rounded-full btn-primary btn-outline w-full'>Sign in</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;