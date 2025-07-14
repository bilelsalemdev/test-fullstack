import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import { Input, Button, LoadingSpinner } from './ui';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      dispatch(loginUser(formData));
    }
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-center bg-no-repeat relative overflow-hidden flex items-center justify-center flex-col bg-[#120036]">
      <div className="mb-16 mt-16">
        <img
          src="/assets/kolct-title.svg"
          alt="Kolct Logo"
          className="w-60 h-20 object-contain"
        />
      </div>

      <div className="relative z-20 w-full max-w-2xl mx-4 px-10 mb-20">
        <div className="bg-[linear-gradient(160.61deg,_rgba(255,255,255,0.10)_0%,_rgba(255,255,255,0.05)_101.7%)] border-t-[2.5px] border-b-[2.5px] border-solid border-[#ffffff66] backdrop-blur-[35.83px] rounded-[41.67px] p-10">
          <h1 className="text-5xl font-semibold text-white text-center mb-12 font-oxanium">
            Log In
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              type="email"
              id="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="h-15 bg-white/9 border-0 rounded-[10px] placeholder-white/60 focus:ring-purple-400/50"
              containerClassName="space-y-3"
            />

            <Input
              type="password"
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="h-15 bg-white/9 border-0 rounded-[10px] placeholder-white/60 focus:ring-purple-400/50"
              containerClassName="space-y-3"
            />
            <div className="flex justify-between items-center mt-8 text-sm">
              <Link
                to="/forgot-password"
                className="text-[#ffb656] hover:text-[#ffb656]/80 transition-colors font-poppins"
              >
                Forget Password?
              </Link>
              <Link
                to="/register"
                className="text-[#ffb656] hover:text-[#ffb656]/80 transition-colors font-poppins"
              >
                Don't Have An Account?
              </Link>
            </div>

            <div className="flex justify-center items-center">
              <div className=" flex justify-center items-center max-w-3xs w-full">
                <img
                  src="/assets/fragment-btn-right.svg"
                  alt="fragment left of button"
                  className="w-full h-11 rotate-180"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-full h-11 bg-[#F81DFB] text-white  font-medium text-lg font-oxanium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center  cursor-pointer border-none"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'LOG IN'
                  )}
                </button>
                <img
                  src="/assets/fragment-btn-right.svg"
                  alt="fragment right of button"
                  className="w-full h-11"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
