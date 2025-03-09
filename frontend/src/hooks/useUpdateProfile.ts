import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateUser {
    [key: string]: string | Blob | null | undefined;
    fullname?: string;
    username?: string;
    email?: string;
    bio?: string;
    link?: string;
    currentPassword?: string;
    newPassword?: string;
    coverImg?: Blob | null;
    profileImg?: Blob | null
}

interface UpdateProfileParams {
    onUpdateSuccess?: () => void
}


const useUpdateProfile = ({ onUpdateSuccess }: UpdateProfileParams) => {
    const queryClient = useQueryClient()

    const { mutate: update, isPending } = useMutation({
        mutationFn: async (data: UpdateUser) => {

            const formData = new FormData()

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key]) {
                        formData.append(key, data[key] as string | Blob);
                    }
                }
            }

            const res = await fetch('/api/users/update-profile', {
                method: 'PUT',
                body: formData
            })

            const result = await res.json()

            if (!result.success) {
                throw new Error(result.message)
            }

            return result
        },
        onSuccess: () => {
            onUpdateSuccess?.()
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Profile updated successfully')

        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return { update, isPending }
}


export default useUpdateProfile