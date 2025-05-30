import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";

import AuthImagePattern from '../components/AuthImagePattern';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async(e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-2 group">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center group-hover:bg-primary transition-colors">
            <MessageSquare className="size-6 text-primary text-white transition-colors" />
          </div>
          <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
          <p className="text-base-content/60">Sign in to your account</p>
        </div>
      </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="w-5 h-5 text-base-content" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-base-content" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
              >
                  {showPassword ? (
                      <EyeOff className='size-5 text-base-content' />
                  ): (
                      <Eye className='size-5 text-base-content' />
                  )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
              <Loader2 className='size-5 animate-spin' />
              Loading
              </>
            ): (
              "Sign In"
            )}
          </button>
        </form>

        <div className='text-center'>
          <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
              Create Account
              </Link>
          </p>
        </div>
      </div>
    </div>

    <AuthImagePattern 
      title="Join our Community"
      subtitle="Connect with friends, share moments, and discover new experiences"
    />
  </div>
  )
}

export default Login