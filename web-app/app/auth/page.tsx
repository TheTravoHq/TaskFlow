'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../lib/axios';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-8 py-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-indigo-600">
            {!showOtpScreen ? 'Sign in to your account' : 'Enter OTP'}
          </h2>
        </div>

        <div className="mt-8 space-y-8">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            {!showOtpScreen ? (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-1/2">
                  <label htmlFor="otp" className="sr-only">
                    Enter OTP
                  </label>
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
                    className="text-center appearance-none relative block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={!showOtpScreen ? handleLogin : handleSubmit}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {!showOtpScreen ? 'Sign in' : 'Verify OTP'}
          </button>
        </div>

        {showOtpScreen && (
          <div>
            <div className="text-center mt-4">
              <span className="text-gray-500">{"Didn't receive OTP?   "}</span>
              {showResend ? (
                <button
                  onClick={handleResend}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-sm text-indigo-600 hover:text-indigo-500">
                  {timer} sec
                </span>
              )}
            </div>

            <div className="text-center mt-1">
              <span className="text-gray-500">{'Have other email?   '}</span>
              <button
                onClick={resetState}
                className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
