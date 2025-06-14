import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';


export default function ProtectedLayout() {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
