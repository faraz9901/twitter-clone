import { Outlet, useLocation, useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { useQuery } from "@tanstack/react-query"

function RootLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    const { isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await fetch("/api/auth/user")
            const result = await res.json()

            if (!result.success) {
                // if user not signed in
                navigate("/sign-in")
                return null
            }

            if (location.pathname === "/sign-in" || location.pathname === "/sign-up") navigate("/")

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