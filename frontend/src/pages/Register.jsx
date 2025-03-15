import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import RadioButton from '../components/RadioButton';
import { Link, useNavigate,Navigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { RegisterMutation } from '../graphql/mutations/userMutations';
import toast from 'react-hot-toast';
import { Authenticate } from '../graphql/query/userQuery';

const Register = () => {
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState({
    name: '',
    phone: '',
    password: '',
	password1: ''
  });

  const [register, { data,loading }] = useMutation(RegisterMutation, { refetchQueries: [{ query: Authenticate }],
	});

	useEffect(() => {
		const token = localStorage.getItem('token');
  		!token ? "" : <Navigate to='/' />;
		
	}, [data, navigate,Navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setSignUpData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignUpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const sanitizePhoneNumber = (phone) => {
	if (phone.startsWith('0')) {
		return parseInt(phone.slice(1), 10);
	} else if (phone.startsWith('+254')) {
		return parseInt(phone.slice(4), 10);
	} else if (phone.startsWith('254')) {
		return parseInt(phone.slice(3), 10); 
	}
	return parseInt(phone, 10);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
	if(signUpData.password !== signUpData.password1) toast.error("Password does not match")

    try {
      const sanitizedPhone = sanitizePhoneNumber(signUpData.phone);

      const { data } = await register({
        variables: {
          input: { name: signUpData.name, phone: parseInt(sanitizedPhone, 10), password: signUpData.password },
        },
      });
	  console.log(data)

      if (data?.register?.token) {
        toast.success('Successfully registered!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className='h-screen relative flex justify-center items-center'>
      <div className='flex rounded-lg overflow-hidden z-50 bg-gray-300'>
        <div className='w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center'>
          <div className='max-w-md w-full p-6'>
            <h1 className='text-3xl font-semibold mb-6 text-black text-center'>
              Sign Up
            </h1>
            <h1 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
              Reserve a safe spot at st. Peters.
            </h1>

            <form className='space-y-4' onSubmit={handleSubmit}>
   
              <InputField
                label='Name'
                id='name'
                name='name'
                onChange={handleChange}
                value={signUpData.name}
                required
              />
              <InputField
                label='Phone'
                id='phone'
                name='phone'
                type='number'
                onChange={handleChange}
                value={signUpData.phone}
                required
              />

              <InputField
                label='Password'
                id='password'
                name='password'
                type='password'
                onChange={handleChange}
                value={signUpData.password}
                required
              />

				<InputField
					label='Confirm password'
					id='password1'
					name='password1'
					type='password'
					onChange={handleChange}
					value={signUpData.password1}
					required
              	/>

              <button
                type='submit'
                className='w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={loading}
              >
                {loading ? 'Signing up ...' : 'Sign Up'}
              </button>
            </form>

            <div className='mt-4 text-sm text-gray-600 text-center'>
              <p>
                Already have an account?{' '}
                <Link to='/login' className='text-black hover:underline'>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
