import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { User, Building, Hash, RefreshCw, Send, Users, Bed, Clock, Check, X } from 'lucide-react'
import { SwapRequest } from '../types'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [swapRequest, setSwapRequest] = useState({
    targetStudentId: '',
    message: ''
  })
  const [recentRequests, setRecentRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [requestsLoading, setRequestsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentRequests()
    }
  }, [user])

  const fetchRecentRequests = async () => {
    try {
      const response = await api.get('/api/swap/list')
      setRecentRequests(response.data.swaps || [])
    } catch (error: any) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setRequestsLoading(false)
    }
  }

  const handleSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/swap/request', swapRequest)
      toast.success('Swap request sent successfully!')
      setSwapRequest({ targetStudentId: '', message: '' })
      fetchRecentRequests()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send swap request')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSwapRequest({
      ...swapRequest,
      [e.target.name]: e.target.value
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'accepted':
        return <Check className="h-3 w-3" />
      case 'rejected':
        return <X className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your hostel room and swap requests from your dashboard.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Room Info */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
                <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Current Room
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Building className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hostel</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.hostelName?.charAt(0).toUpperCase() + user.hostelName?.slice(1)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Hash className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Room Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.roomNumber}</p>
                </div>
              </div>

              {user.bedType && (
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bed className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bed Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.bedType}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a
                href="/swap-requests"
                className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 group-hover:rotate-180 transition-transform duration-300" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">View All Requests</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Manage pending requests</p>
                </div>
              </a>
              
              <a
                href="/students"
                className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">Find Students</h4>
                  <p className="text-xs text-green-700 dark:text-green-300">Browse available rooms</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Request Swap & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Swap */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Request a Swap
              </h2>
            </div>
            
            <form onSubmit={handleSwapRequest} className="space-y-4">
              <div>
                <label htmlFor="targetStudentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Student ID
                </label>
                <input
                  type="text"
                  id="targetStudentId"
                  name="targetStudentId"
                  value={swapRequest.targetStudentId}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter the student ID you want to swap with"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={swapRequest.message}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Add a personal message to your swap request..."
                />
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
                    <Send className="h-5 w-5 mr-2" />
                    Send Swap Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Swap Requests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <a
                href="/swap-requests"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
              >
                View All
              </a>
            </div>

            {requestsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No swap requests yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Start by sending a swap request above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.slice(0, 3).map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg mr-3">
                        <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Swap with Student {request.targetStudentId || request.requesterId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard