import { Navigate, Outlet } from 'react-router-dom'

import RightPanel from '../../components/common/RightPanel';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/User.Context';

export default function MainLayout() {

    const { user } = useAuth()

    if (!user) return <Navigate to="/sign-in" />

    return (
        <div className='flex'>
            <Sidebar />
            <Outlet key={location.pathname} />
            <RightPanel />
        </div>
    )
}
