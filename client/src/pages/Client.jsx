import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { ReserveSpace } from '../graphql/mutations/paymentMutation';
import toast from 'react-hot-toast';
import Reserved from './Client/Reserved';
import Reserve from './Client/Reserve';
import { Outlet } from 'react-router-dom';

const Client = () => {
 
  return (
    <div>
      <Outlet />
    </div>
  )
};

export default Client;
