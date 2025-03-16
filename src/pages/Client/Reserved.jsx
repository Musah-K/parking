import React, { useEffect, useState } from 'react';
import { UserSlots } from '../../graphql/query/parkingSlotsQuery';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { IoMdAdd } from "react-icons/io";
import Reserve from './Reserve';
import { FaRegCircleXmark } from "react-icons/fa6";

const Reserved = () => {
  const { data: userSlots, loading: loadingUserSlots, error: slotsError, refetch } = useQuery(UserSlots);
  const [userSlotsArr, setUserSlotsArr] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userSlots?.userSlots) return;

    const transformedSlots = userSlots.userSlots.map((x) => ({
      ...x,
      validFrom: new Date(Number(x.validFrom)).toISOString().split('T')[0],
      validTill: new Date(Number(x.validTill)).toISOString().split('T')[0],
    }));

    setUserSlotsArr(transformedSlots);
  }, [userSlots]);

  if (loadingUserSlots) return <div className="text-center mt-10">🚗 Fetching reserved slots...</div>;
  if (slotsError) return <div className="text-center mt-10 text-red-500">❌ An error occurred fetching slots.</div>;

  // If no reserved slots, show the Reserve form inline (without modal overlay)
  if (userSlotsArr.length === 0) {
    return (
      <div className="min-h-screen p-8 bg-white">
        <Reserve refetch={refetch} />
      </div>
    );
  }

  // Otherwise, show reserved slots along with a floating add button that opens the modal
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 p-8 bg-white min-h-screen relative">
      {/* Floating Add Button */}
      <div className="fixed bottom-10 right-10 cursor-pointer">
        <IoMdAdd 
          onClick={() => setIsModalOpen(true)} 
          size={60} 
          className="text-white bg-indigo-600 p-2 rounded-full shadow-xl hover:scale-110 transition-transform"
        />
      </div>

      {/* Modal Popup for Reserve Form */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => { if(e.target.id === 'modal-overlay') setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-red-500"
            >
              <FaRegCircleXmark />
            </button>
            <Reserve refetch={refetch} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Reserved Slots List */}
      {userSlotsArr.map((x) => (
        <motion.div
          key={x._id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-sm p-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">🚗 Parking Slot #{x.slotNumber}</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">From:</span> {x.validFrom}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Till:</span> {x.validTill}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Reserved;
