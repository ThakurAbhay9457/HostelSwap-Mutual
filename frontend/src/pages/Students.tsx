import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Search, Users, Building, Hash, Bed, Mail, RefreshCw, Filter } from 'lucide-react'
import { Student } from '../types'
import toast from 'react-hot-toast'

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    hostel: '',
    bedType: ''
  })

  const hostelOptions = [
    'block1', 'block2', 'block3', 'block4',
    'block5', 'block6', 'block7', 'block8'
  ]

  const bedTypeOptions = [
    '4 bedded', '3 bedded', '2 bedded', '1 bedded'
  ]

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, filters])

  const fetchStudents = async () => {
    try {
      // This would be an API call to get all students
      // For now, we'll simulate the data
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Abhay',
          email: 'abhay@example.com',
          hostel: 'block1',
          bedType: '4 bedded',
          roomNumber: 101,
          isVerified: true
        },
        {
          id: '2',
          name: 'Soumik',
          email: 'soumik@example.com',
          hostel: 'block2',
          bedType: '3 bedded',
          roomNumber: 205,
          isVerified: true
        },
        {
          id: '3',
          name: 'Prateek',
          email: 'prateek@example.com',
          hostel: 'block1',
          bedType: '2 bedded',
          roomNumber: 150,
          isVerified: true
        },
        {
          id: '4',
          name: 'Aryan',
          email: 'aryan@example.com',
          hostel: 'block3',
          bedType: '4 bedded',
          roomNumber: 301,
          isVerified: true
        },
        {
          id: '5',
          name: 'Yash',
          email: 'yash@example.com',
          hostel: 'block2',
          bedType: '1 bedded',
          roomNumber: 220,
          isVerified: true
        },
        {
          id: '6',
          name: 'Sagar',
          email: 'sagar@example.com',
          hostel: 'block4',
          bedType: '3 bedded',
          roomNumber: 401,
          isVerified: true
        }
      ]
      setStudents(mockStudents)
    } catch (error) {
      toast.error('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Hostel filter
    if (filters.hostel) {
      filtered = filtered.filter(student => student.hostel === filters.hostel)
    }

    // Bed type filter
    if (filters.bedType) {
      filtered = filtered.filter(student => student.bedType === filters.bedType)
    }

    setFilteredStudents(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({ hostel: '', bedType: '' })
    setSearchTerm('')
  }

  const sendSwapRequest = async (targetStudentId: string) => {
    try {
      await api.post('/api/swap/request', { targetStudentId })
      toast.success('Swap request sent successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send swap request')
    }
  }

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
          Find Students
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse and connect with other students for room swapping.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">Filter by:</span>
            </div>

            <div className="flex gap-4">
              <select
                value={filters.hostel}
                onChange={(e) => handleFilterChange('hostel', e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Hostels</option>
                {hostelOptions.map((hostel) => (
                  <option key={hostel} value={hostel}>
                    {hostel.charAt(0).toUpperCase() + hostel.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filters.bedType}
                onChange={(e) => handleFilterChange('bedType', e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Bed Types</option>
                {bedTypeOptions.map((bedType) => (
                  <option key={bedType} value={bedType}>
                    {bedType}
                  </option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No students found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-3">
                    <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.email}
                    </p>
                  </div>
                </div>
                {student.isVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="font-medium">Hostel:</span>
                  <span className="ml-1">
                    {student.hostel.charAt(0).toUpperCase() + student.hostel.slice(1)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Hash className="h-4 w-4 mr-2" />
                  <span className="font-medium">Room:</span>
                  <span className="ml-1">{student.roomNumber}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Bed className="h-4 w-4 mr-2" />
                  <span className="font-medium">Bed Type:</span>
                  <span className="ml-1">{student.bedType}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => sendSwapRequest(student.id)}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Request Swap
                </button>
                <a
                  href={`mailto:${student.email}`}
                  className="btn-secondary flex items-center justify-center"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Students