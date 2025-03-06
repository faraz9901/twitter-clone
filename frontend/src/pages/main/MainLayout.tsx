import { Outlet } from 'react-router-dom'

import RightPanel from '../../components/common/RightPanel';
import Sidebar from '../../components/common/Sidebar';

export default function MainLayout() {
    return (
        <div className='flex'>
            <Sidebar />
            <Outlet key={location.pathname} />
            <RightPanel />
        </div>
    )
}
