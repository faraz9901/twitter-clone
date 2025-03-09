import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {

    const queryClient = useQueryClient()

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

        onSuccess: (result) => {
            toast.success(result.message)
            queryClient.invalidateQueries({ queryKey: ['suggested'] })
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })


    return { follow, isPending }

}


export default useFollow