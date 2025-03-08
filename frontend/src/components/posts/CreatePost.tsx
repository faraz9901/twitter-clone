import { Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../../context/User.Context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { imageCompressor } from "../../utils/imageCompressor";
import LoadingSpinner from "../common/LoadingSpinner";

const CreatePost = () => {
    const { user } = useAuth()
    const [text, setText] = useState("");
    const [image, setImage] = useState<Blob | null>(null);
    const imageRef = useRef<HTMLInputElement | null>(null);
    const queryClient = useQueryClient()
    const [isProcessing, setIsProcessing] = useState(false)

    const { mutate: createPost, isPending } = useMutation({
        mutationFn: async (data: { text: string, image: Blob | null }) => {

            const formData = new FormData()
            formData.append('text', data.text)
            if (data.image) formData.append('image', data.image)

            const res = await fetch('/api/posts/create', {
                method: 'POST',
                body: formData,
            })

            const result = await res.json()

            if (!result.success) throw new Error(result.message)

            return result
        },
        onSuccess: () => {
            setText('')
            setImage(null)
            toast.success('Post Created')
            // as following posts will not include the user posts
            queryClient.invalidateQueries({ queryKey: ['posts', 'forYou'] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createPost({ text, image })
    };

    const handleimageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const file = e.target.files[0];
        setIsProcessing(true)
        try {
            const compressedImage = await imageCompressor(file)
            if (!compressedImage) return toast.error('Invalid Image Format')
            setImage(compressedImage)
        } catch (error) {
            toast.error('Failed to process image')
        } finally {
            setIsProcessing(false)
        }
    };

    return (
        <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
            <div className='avatar'>
                <div className='w-8 rounded-full'>
                    <img src={user?.profileImg || "/avatar-placeholder.png"} />
                </div>
            </div>
            <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
                <textarea
                    className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
                    placeholder='What is happening?!'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {image && (
                    <div className='relative w-72 mx-auto'>
                        <X
                            className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                            onClick={() => {
                                setImage(null);
                                if (imageRef.current) imageRef.current.value = "";
                            }}
                        />
                        <img src={URL.createObjectURL(image)} className='w-full mx-auto h-72 object-contain rounded' />
                    </div>
                )}

                <div className='flex justify-between py-2 border-t-gray-700'>
                    <div className='flex gap-1 items-center'>
                        <Paperclip
                            className='w-6 h-6 cursor-pointer'
                            onClick={() => imageRef.current?.click()}
                        />
                    </div>
                    <input type='file' hidden ref={imageRef} onChange={handleimageChange} />
                    <button disabled={isPending || isProcessing} className='btn btn-primary rounded-full btn-sm text-white px-4'>
                        {isProcessing && <LoadingSpinner size="sm" />}
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default CreatePost;