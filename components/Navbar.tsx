
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useQueue } from '../store.tsx';
import { Volume2, VolumeX, ClipboardList, Monitor, UserCheck, Layout } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isMuted, toggleMute } = useQueue();

  const navItems = [
    { to: '/', label: 'จองคิว (ขนส่ง)', icon: <UserCheck className="w-5 h-5" /> },
    { to: '/staff', label: 'พนักงานคลัง', icon: <Layout className="w-5 h-5" /> },
    { to: '/display', label: 'หน้าจอแสดงผล', icon: <Monitor className="w-5 h-5" /> },
    { to: '/report', label: 'รายงาน / บันทึก', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-1 rounded">WH</span>
              Queue Management
            </h1>
            <div className="hidden md:flex space-x-2">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'
            }`}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
