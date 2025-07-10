import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { User, Building, Hash, Bed, Mail, Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    hostel: user?.hostelName || '',
    bedType: user?.bedType || '',
    roomNumber: user?.roomNumber || ''
  })

  const hostelOptions = [
    'block1', 'block2', 'block3', 'block4',
    'block5', 'block6', 'block7', 'block8'
  ]

  const bedTypeOptions = [
    '4 bedded', '3 bedded', '2 bedded', '1 bedded'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // This would be an API call to update user profile
      await api.put('/api/user/profile', {
        ...formData,
        roomNumber: Number(formData.roomNumber)
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      
      // Update local storage with new user data
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        hostelName: formData.hostel,
        bedType: formData.bedType,
        roomNumber: formData.roomNumber
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      hostel: user?.hostelName || '',
      bedType: user?.bedType || '',
      roomNumber: user?.roomNumber || ''
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account information and room details.
        </p>
      </div>

      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-4">
              <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user.email}
              </p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{user.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Room Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hostel Block
                </label>
                {isEditing ? (
                  <select
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {hostelOptions.map((hostel) => (
                      <option key={hostel} value={hostel}>
                        {hostel.charAt(0).toUpperCase() + hostel.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Building className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">
                      {user.hostelName?.charAt(0).toUpperCase() + user.hostelName?.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Number
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Hash className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{user.roomNumber}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bed Type
                </label>
                {isEditing ? (
                  <select
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bedTypeOptions.map((bedType) => (
                      <option key={bedType} value={bedType}>
                        {bedType}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Bed className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{user.bedType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Actions
            </h3>
            <div className="flex gap-4">
              <button
                onClick={logout}
                className="btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile