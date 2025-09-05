import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, LogIn, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const { login, adminLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isAdmin) {
        await adminLogin(formData.username, formData.password)
        toast.success('Welcome back, Admin!')
      } else {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                {isAdmin ? (
                  <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ) : (
                  <LogIn className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                )}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? 'Admin Login' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {isAdmin ? 'Sign in to admin dashboard' : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isAdmin
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isAdmin
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isAdmin ? (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter admin username"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isAdmin ? <Shield className="h-5 w-5 mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
                  Sign In
                </>
              )}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login