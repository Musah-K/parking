import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { LoginMutation } from '../graphql/mutations/userMutations';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Authenticate } from '../graphql/query/userQuery';

const Login = () => {
	const navigate = useNavigate();

	const [login, { data, loading, error }] = useMutation(LoginMutation, {
		refetchQueries: [{ query: Authenticate }],
	});

	const [signUpData, setSignUpData] = useState({
		phone: '',
		password: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		const sanitizedPhone = sanitizePhoneNumber(signUpData.phone);

		try {
			const {data} =await login({
				variables: { input:{ ...signUpData, phone: sanitizedPhone }},
			});

			if (data?.authUser?.token) {
				localStorage.setItem('token', data.authUser.token); 
				navigate('/dashboard');
			  }
			console.log(data)
			navigate('/')
			toast.success("User logged in successifully.")
		} catch (err) {
			console.error('Login Error:', err);
			toast.error(err.message || 'Login failed. Please try again.');
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
	

	const handleChange = (e) => {
		const { name, value } = e.target;

		setSignUpData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	return (
		<div className='h-screen relative flex justify-center items-center'>
			<div className='flex rounded-lg overflow-hidden z-50 bg-gray-300'>
				<div className='w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center'>
					<div className='max-w-md w-full p-6'>
						<h1 className='text-3xl font-semibold mb-6 text-black text-center'>
							Sign In
						</h1>
						<h1 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
							St. Peter Claver Parking.
						</h1>

						<form className='space-y-4' onSubmit={handleSubmit}>
							<InputField
								label='Phone'
								id='phone'
								name='phone'
								type='number'
								onChange={handleChange}
								value={signUpData.email}
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
							<button
								type='submit'
								className='w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
								disabled={loading}
							>
								{loading ? 'Signing in ...' : 'Sign In'}
							</button>
						</form>

						<div className='mt-4 text-sm text-gray-600 text-center'>
							<p>
								Don't have an account?{' '}
								<Link to='/register' className='text-black hover:underline'>
									Register here
								</Link>
							</p>
						</div>

						{error && (
							<p className='text-red-500 text-sm mt-4'>{error.message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
