import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/common/SIdebar'
import RightPanel from '../../components/common/RightPanel';

export default function MainLayout() {
    const location = useLocation();
    return (
        <div className='flex'>
            <Sidebar />
            <Outlet key={location.pathname} />
            <RightPanel />
        </div>
    )
}
