import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import { FiLogOut } from 'react-icons/fi';
import { useMutation } from '@apollo/client';
import { LOGOUT } from '../graphql/mutations/userMutations';
import toast from 'react-hot-toast';

const Home = ({ user: newUser }) => {
  const [user, setUser] = useState(newUser);

  useEffect(() => {
    setUser(newUser);
  }, [newUser]);

  // UseMutation for handling logout
  const [logout, { loading }] = useMutation(LOGOUT, {
    onCompleted: () => {
      toast.success('✅ Logged out successfully!');
      setUser(null); // Clear user data after logout
    },
    onError: (error) => {
      toast.error(`❌ Logout failed: ${error.message}`);
    },
  });

  if (!user) return null; // Prevents rendering if user is not present

  const handleLogout = async () => {
    if (loading) return; // Prevent multiple logout requests
    await logout();
  };

  return (
    <div>
      <Nav />
      <div className='mt-8 flex flex-col items-center gap-3 z-50'>
        {/* User Info & Logout */}
        <div className='underline text-lg flex gap-8 items-center'>
          <span>{user.name}</span>
          <div
            onClick={handleLogout}
            className='p-3 bg-purple-500 hover:text-lg cursor-pointer rounded-full'
          >
            <FiLogOut />
          </div>
        </div>

        {/* Phone and Vehicle Info */}
        <div className='flex justify-between px-2 w-screen max-w-sm'>
          <div>{'0' + user.phone}</div>
          <div>{user.vehicle || 'No vehicle registered'}</div>
        </div>
      </div>

      {/* Renders the child route */}
      <Outlet />
    </div>
  );
};

export default Home;
