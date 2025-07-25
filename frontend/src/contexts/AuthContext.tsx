import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>
  adminLogin: (username: string, password: string) => Promise<void>
  adminRegister: (username: string, password: string, adminKey: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  hostel: string
  bedType: string
  roomNumber: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/student/signin', { email, password })
      
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const adminLogin = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/admin/signin', { username, password })
      
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Admin login failed')
    }
  }

  const adminRegister = async (username: string, password: string, adminKey: string) => {
    try {
      const response = await api.post('/api/auth/admin/signup', { 
        username, 
        password, 
        adminKey 
      })
      
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Admin registration failed')
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/api/auth/student/signup', userData)
      
      // Registration successful, but user needs to login
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    adminLogin,
    adminRegister,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}