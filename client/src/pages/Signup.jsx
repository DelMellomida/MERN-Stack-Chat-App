import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import toast from "react-hot-toast"

import AuthImagePattern from '../components/AuthImagePattern';


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { signup, isSigningup } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error('Full Name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Email is invalid');
    if (!formData.password.trim()) return toast.error('Password is required');
    if (formData.password.length < 8) return toast.error('Password must be at least 8 characters long');

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Example usage
    const success = validateForm();
    if (success) {
      signup(formData);
    }
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
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/70" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
              disabled={isSigningup}
            >
              {isSigningup ? (
                <>
                <Loader2 className='size-5 animate-spin' />
                Loading
                </>
              ): (
                "Create Account"
              )}
            </button>
          </form>

          <div className='text-center'>
            <p className="text-base-content/60">
                Already have an account?
                <Link to="/login" className="link link-primary">
                Sign In
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
};

export default Signup;
