import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { RefreshCw, Check, X, Clock, User, Building, Hash, MessageSquare, Bed, Filter } from 'lucide-react'
import { SwapRequest } from '../types'
import toast from 'react-hot-toast'

const SwapRequests: React.FC = () => {
  const [requests, setRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/swap/list')
      // Transform the response to match our interface
      const transformedRequests = (response.data.swaps || []).map((swap: any) => ({
        id: swap.requesterId + swap.targetStudentId, // Create a unique ID
        requesterId: swap.requesterId,
        requesterName: 'Student', // This would come from the backend
        requesterEmail: 'student@example.com', // This would come from the backend
        requesterHostel: 'Block 1', // This would come from the backend
        requesterRoom: '101', // This would come from the backend
        requesterBedType: '4 bedded', // This would come from the backend
        targetStudentId: swap.targetStudentId,
        targetName: 'Target Student', // This would come from the backend
        targetEmail: 'target@example.com', // This would come from the backend
        targetHostel: 'Block 2', // This would come from the backend
        targetRoom: '201', // This would come from the backend
        targetBedType: '3 bedded', // This would come from the backend
        message: 'Swap request message', // This would come from the backend
        status: swap.status,
        createdAt: new Date().toISOString(), // This would come from the backend
        type: 'sent' // This would be determined based on current user
      }))
      setRequests(transformedRequests)
    } catch (error: any) {
      toast.error('Failed to fetch swap requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const request = requests.find(r => r.id === requestId)
      if (request) {
        await api.post('/api/swap/accept', { requesterId: request.requesterId })
        toast.success('Swap request accepted!')
        fetchRequests()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      // This would be an API call to reject the request
      toast.success('Swap request rejected!')
      fetchRequests()
    } catch (error: any) {
      toast.error('Failed to reject request')
    } finally {
      setActionLoading(null)
    }
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
        return <Clock className="h-4 w-4" />
      case 'accepted':
        return <Check className="h-4 w-4" />
      case 'rejected':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredRequests = requests.filter(request => {
    const typeMatch = filter === 'all' || request.type === filter
    const statusMatch = statusFilter === 'all' || request.status === statusFilter
    return typeMatch && statusMatch
  })

  const sentRequests = filteredRequests.filter(req => req.type === 'sent')
  const receivedRequests = filteredRequests.filter(req => req.type === 'received')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Swap Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your sent and received room swap requests.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 card p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">Filter by:</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'sent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'received'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Received
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('accepted')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'accepted'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {filter === 'all' ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Received Requests */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Received Requests ({receivedRequests.length})
              </h2>
            </div>

            {receivedRequests.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No received requests yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {receivedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Sent Requests ({sentRequests.length})
              </h2>
            </div>

            {sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No sent requests yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sentRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    isSent={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
              <RefreshCw className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {filter === 'sent' ? 'Sent' : 'Received'} Requests ({filteredRequests.length})
            </h2>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No {filter} requests {statusFilter !== 'all' ? `with ${statusFilter} status` : ''} found
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  actionLoading={actionLoading}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  isSent={request.type === 'sent'}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface RequestCardProps {
  request: SwapRequest
  onAccept: (id: string) => void
  onReject: (id: string) => void
  actionLoading: string | null
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
  isSent?: boolean
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  onReject,
  actionLoading,
  getStatusColor,
  getStatusIcon,
  isSent = false
}) => {
  const displayName = isSent ? request.targetName : request.requesterName
  const displayEmail = isSent ? request.targetEmail : request.requesterEmail
  const displayHostel = isSent ? request.targetHostel : request.requesterHostel
  const displayRoom = isSent ? request.targetRoom : request.requesterRoom
  const displayBedType = isSent ? request.targetBedType : request.requesterBedType

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {displayEmail}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="ml-1 capitalize">{request.status}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Building className="h-4 w-4 mr-1" />
          {displayHostel}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Hash className="h-4 w-4 mr-1" />
          Room {displayRoom}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
        <Bed className="h-4 w-4 mr-1" />
        {displayBedType}
      </div>

      {request.message && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start">
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{request.message}</p>
          </div>
        </div>
      )}

      {!isSent && request.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onAccept(request.id)}
            disabled={actionLoading === request.id}
            className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {actionLoading === request.id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Accept
              </>
            )}
          </button>
          <button
            onClick={() => onReject(request.id)}
            disabled={actionLoading === request.id}
            className="flex-1 btn-secondary flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </button>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
      </div>
    </div>
  )
}

export default SwapRequests