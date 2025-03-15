import React, { useEffect, useState } from 'react';
import { ReserveSpace } from '../../graphql/mutations/paymentMutation';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaCoins } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';

const Reserve = ({ refetch, onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const [createPayment, { loading, error }] = useMutation(ReserveSpace);
  const [reserve, setReserve] = useState({
    validFrom: today,
    validTill: today,
  });
  const [days, setDays] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserve((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDays = (from, till) => {
    const fromDate = new Date(from);
    const tillDate = new Date(till);
    const difference = (tillDate - fromDate) / (1000 * 60 * 60 * 24);
    setDays(difference + 1);
  };

  useEffect(() => {
    calculateDays(reserve.validFrom, reserve.validTill);
  }, [reserve.validFrom, reserve.validTill]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(reserve.validTill) < new Date(reserve.validFrom)) {
      toast.error('End date cannot be before start date.');
      return;
    }

    try {
      console.log('Sending input:', { days, ...reserve });
      const { data } = await createPayment({
        variables: { input: { days, ...reserve } },
      });

      if (data?.createPayment?.status === 'Completed') {
        toast.success('🚗 Parking reserved successfully!');
        await refetch(); // First refetch on success
        if (onClose) onClose(); // Close popup on success
      } else {
        throw new Error('Payment failed or not confirmed.');
      }
    } catch (error) {
      console.error('Error reserving parking:', error);
      // First refetch attempt (silently)
      try {
        await refetch();
        if (onClose) onClose();
      } catch (firstRefetchError) {
        // If first refetch fails, attempt second refetch
        try {
          await refetch();
          if (onClose) onClose();
        } catch (secondRefetchError) {
          toast.error('❌ ' + (secondRefetchError.message || 'Something went wrong.'));
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-6 max-w-md w-full">
        {/* Header */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-indigo-600" /> Reserve a Space
        </h2>
        {/* Reservation Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Date Input: From */}
          <label htmlFor="validFrom" className="flex flex-col gap-1">
            <span className="text-md font-medium text-gray-700 flex items-center gap-2">
              <MdDateRange className="text-indigo-600" /> From
            </span>
            <input
              type="date"
              name="validFrom"
              min={today}
              value={reserve.validFrom}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </label>

          {/* Date Input: Till */}
          <label htmlFor="validTill" className="flex flex-col gap-1">
            <span className="text-md font-medium text-gray-700 flex items-center gap-2">
              <MdDateRange className="text-indigo-600" /> Until
            </span>
            <input
              type="date"
              name="validTill"
              min={reserve.validFrom}
              value={reserve.validTill}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </label>

          {/* Summary: Days and Amount */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-center text-gray-700">
              <span className="text-lg font-semibold">📅 Days:</span>
              <span className="text-xl font-bold">{days}</span>
            </div>
            <div className="flex flex-col items-center text-gray-700">
              <span className="text-lg font-semibold">
                <FaCoins /> Total:
              </span>
              <span className="text-xl font-bold">{days * 1} KES</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-center rounded-lg py-2 text-lg font-semibold text-white transition-transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : '🚗 Reserve Now'}
          </button>

          {/* Error Message (if any) */}
          {error && (
            <p className="text-red-500 mt-4 text-center">
              ❌ {error.message || 'Something went wrong'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Reserve;
