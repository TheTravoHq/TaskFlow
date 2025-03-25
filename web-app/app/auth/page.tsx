'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../lib/axios';

export default function AuthPage() {
  const router = useRouter();
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any = null;
    if (!showResend) {
      if (timer === 0) {
        setShowResend(true);
        return;
      }
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, showResend]);

  const handleResend = async () => {
    await handleLogin();
    setShowResend(false);
    setTimer(30);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/verify-otp', {
        email,
        otp,
      });

      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${access_token}`;
        router.push('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Authentication failed',
      );
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      await axios.post('/auth/login', {
        email,
      });
      setShowOtpScreen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const resetState = () => {
    setOtp('');
    setError('');
    setShowOtpScreen(false);
    setShowResend(false);
    setTimer(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-indigo-700">
            {!showOtpScreen ? 'Welcome Back' : 'Verify OTP'}
          </h2>
          <p className="text-gray-700 text-center">
            {!showOtpScreen
              ? 'Sign in to access your account'
              : 'Enter the code sent to your email'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!showOtpScreen ? (
              <div className="relative">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 mb-1 block"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <input
                    id="otp"
                    name="OTP"
                    type="text"
                    required
                    value={otp}
                    maxLength={6}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      setOtp(onlyNumbers);
                    }}
                    className="text-center w-48 appearance-none px-4 py-3 text-2xl tracking-widest border-0 border-b-2 border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                    placeholder="______"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={!showOtpScreen ? handleLogin : handleSubmit}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            {!showOtpScreen ? 'Continue with Email' : 'Verify OTP'}
          </button>
        </div>

        {showOtpScreen && (
          <div className="space-y-3">
            <div className="text-center mt-6">
              <span className="text-gray-700"> Didn't receive the code?</span>
              {showResend ? (
                <button
                  onClick={handleResend}
                  className="text-sm font-medium text-indigo-700 hover:text-indigo-900 transition-colors duration-300"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-sm font-medium text-indigo-700">
                  {timer} seconds
                </span>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={resetState}
                className="text-sm font-medium text-gray-700 hover:text-indigo-700 transition-colors duration-300"
              >
                Use a different email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
