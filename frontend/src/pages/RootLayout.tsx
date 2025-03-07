import { Outlet, useLocation } from "react-router-dom"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/User.Context"

function RootLayout() {
    const location = useLocation()
    const { setUser } = useAuth()

    const { isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await fetch("/api/auth/user")
            const result = await res.json()

            if (!result.success) {
                // if user not signed in
                setUser(null)
                return null
            }

            setUser(result.data)
            return result
        },
        retry: false
    })

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return <Outlet key={location.pathname} />

}

export default RootLayout