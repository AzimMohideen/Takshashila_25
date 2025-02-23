'use client';
import { useState, useEffect, useMemo } from "react"
import { Search, Download, RefreshCw, Filter } from "lucide-react"
import axios from "axios"

const ADMIN_PASSWORD = "therilaiye"
const API_URL = process.env.NEXT_PUBLIC_API_URL
const ITEMS_PER_PAGE = 10

type Registration = {
  email: string
  phone_no: string
  username: string
  college_name: string
  pass: (string[])[]
  amount: number
  count: number
}

type FilterOptions = {
  college: string
  minAmount: string
  maxAmount: string
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterOptions>({
    college: "all",
    minAmount: "",
    maxAmount: "",
  })
  const [sortConfig, setSortConfig] = useState({
    key: "amount",
    direction: "desc",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError(null)
    } else {
      setError("Incorrect password.")
    }
  }

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_URL}/select`)
      setRegistrations(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching registrations:", err)
      setError("Error fetching registrations.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchRegistrations()
    }
  }, [authenticated])

  const handleSort = (key: keyof Registration) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const filteredAndSortedData = useMemo(() => {
    return registrations
      .filter((reg) => {
        const matchesSearch =
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.college_name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCollege =
          filters.college === "all" ||
          (filters.college &&
            new RegExp(filters.college, 'i').test(reg.college_name))

        const matchesAmount =
          (!filters.minAmount || reg.amount >= parseInt(filters.minAmount)) &&
          (!filters.maxAmount || reg.amount <= parseInt(filters.maxAmount))

        return matchesSearch && matchesCollege && matchesAmount
      })
      .sort((a, b) => {
        const key = sortConfig.key as keyof Registration
        if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
  }, [registrations, searchTerm, filters, sortConfig])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)

  const uniqueColleges = useMemo(() => {
    return Array.from(new Set(registrations.map((reg) => reg.college_name)))
  }, [registrations])

  const exportToCSV = () => {
    const headers = [
      "Email",
      "Phone",
      "Username",
      "College",
      "Pass",
      "Amount",
      "Count",
    ]
    const csvData = filteredAndSortedData.map((reg) => [
      reg.email,
      reg.phone_no,
      reg.username,
      reg.college_name,
      JSON.stringify(reg.pass),
      reg.amount,
      reg.count,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = "registrations.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-96 bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow rounded">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-2xl font-bold">Registered Users</h2>
            <p className="text-sm text-gray-500">
              Total Records: {filteredAndSortedData.length} of {registrations.length}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              disabled={loading}
              className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                placeholder="Search by email, username, or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border p-2 pl-8 rounded"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.college}
                onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                className="border p-2 rounded w-48"
              >
                <option value="all">All Colleges</option>
                {uniqueColleges
                  .filter((college) => college && college.trim() !== "")
                  .map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                className="border p-2 rounded w-32"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                className="border p-2 rounded w-32"
              />
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="text-center py-8">No registrations found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      {[
                        "Email",
                        "Phone",
                        "Username",
                        "College",
                        "Pass",
                        "Amount",
                        "Count",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 border cursor-pointer hover:bg-gray-50"
                          onClick={() =>
                            handleSort(header.toLowerCase() as keyof Registration)
                          }
                        >
                          <div className="flex items-center justify-between">
                            {header}
                            {sortConfig.key === header.toLowerCase() && (
                              <Filter
                                className={`h-4 w-4 ${
                                  sortConfig.direction === "asc" ? "transform rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((reg, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{reg.email}</td>
                        <td className="px-4 py-2 border">{reg.phone_no}</td>
                        <td className="px-4 py-2 border">{reg.username}</td>
                        <td className="px-4 py-2 border">{reg.college_name}</td>
                        <td className="px-4 py-2 border">{JSON.stringify(reg.pass)}</td>
                        <td className="px-4 py-2 border">{reg.amount}</td>
                        <td className="px-4 py-2 border">{reg.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of{" "}
                  {filteredAndSortedData.length} entries
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`border px-3 py-1 rounded hover:bg-gray-50 ${
                        currentPage === page ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}