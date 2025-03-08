import { BookImage, Smile, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../../context/User.Context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const CreatePost = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState<string | null>(null);
    const { user } = useAuth()
    const imgRef = useRef<HTMLInputElement | null>(null);
    const queryClient = useQueryClient()

    const { mutate: createPost, isPending } = useMutation({
        mutationFn: async (data: { text: string, img: any }) => {

            const res = await fetch('/api/posts/create', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const result = await res.json()

            if (!result.success) throw new Error(result.message)

            return result
        },
        onSuccess: () => {
            setText('')
            setImg(null)
            toast.success('Post Created')
            queryClient.invalidateQueries({ queryKey: ['posts', 'forYou'] })
        },
        onError: (error) => {
            toast.error(error.message)
        }

    })


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createPost({ text, img })
    };

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files === null) return;

        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
            <div className='avatar'>
                <div className='w-8 rounded-full'>
                    <img src={user.profileImg || "/avatar-placeholder.png"} />
                </div>
            </div>
            <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
                <textarea
                    className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
                    placeholder='What is happening?!'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {img && (
                    <div className='relative w-72 mx-auto'>
                        <X
                            className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                            onClick={() => {
                                setImg(null);
                                if (imgRef?.current) imgRef.current.value = "";
                            }}
                        />
                        <img src={img} className='w-full mx-auto h-72 object-contain rounded' />
                    </div>
                )}

                <div className='flex justify-between border-t py-2 border-t-gray-700'>
                    <div className='flex gap-1 items-center'>
                        <BookImage
                            className='fill-primary w-6 h-6 cursor-pointer'
                            onClick={() => imgRef.current?.click()}
                        />
                        <Smile className='fill-primary w-5 h-5 cursor-pointer' />
                    </div>
                    <input type='file' hidden ref={imgRef} onChange={handleImgChange} />
                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default CreatePost;