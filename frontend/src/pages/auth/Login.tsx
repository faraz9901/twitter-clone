import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Twitter from "../../components/common/Twitter";
import { Mail, RectangleEllipsis } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/User.Context";



const LoginPage = () => {
    const { user } = useAuth()

    if (user) return <Navigate to="/" />

    return <Login />
}

const Login = () => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const { isPending, mutate } = useMutation({
        mutationFn: async (data: { username: string; password: string; }) => {
            const res = await fetch('/api/auth/signin', {
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
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Login Successfull")
            queryClient.invalidateQueries({ queryKey: ["user"] })
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
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <Twitter className='lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 lg:w-2/3 flex-col' onSubmit={handleSubmit}>
                    <Twitter className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
                    <label className='input w-full input-bordered rounded flex items-center gap-2'>
                        <Mail />
                        <input
                            type='text'
                            className='grow'
                            placeholder='username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>

                    <label className='input w-full input-bordered rounded flex items-center gap-2'>
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
                    <button disabled={isPending} className='btn rounded-full btn-primary text-white'>{isPending ? <>Logging in <LoadingSpinner size="xs" /> </> : "Login"}</button>
                    <div className='flex flex-col gap-2 mt-4'>
                        <p className='text-white text-lg'>{"Don't"} have an account?</p>
                        <Link to='/sign-up'>
                            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;