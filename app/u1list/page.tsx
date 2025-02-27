'use client';
import { useState, useEffect, useMemo } from "react"
import { Search, Download, RefreshCw, Filter, Plus, X } from "lucide-react"
import axios from "axios"
import * as XLSX from "xlsx"


const ADMIN_PASSWORD = "therilaiye"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const ITEMS_PER_PAGE = 10

type Registration = {
  email: string
  phone: string
  username: string
  college: string
  pass: string[][]
  amount: number
  count: number
  paid: boolean
}

type FilterOptions = {
  college: string
  workshop: string
  day: string
  minAmount: string
  maxAmount: string
}

type NewUser = {
  username: string
  phone: string
  email: string
  college: string
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingAmount, setEditingAmount] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<FilterOptions>({
    college: "all",
    workshop: "all",
    day: "all",
    minAmount: "",
    maxAmount: "",
  })
  const [sortConfig, setSortConfig] = useState({
    key: "amount",
    direction: "desc",
  })
  const [editingPass, setEditingPass] = useState<Record<string, string>>({})
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    phone: "",
    email: "",
    college: ""
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
      const { data } = await axios.get(`${API_URL}/u1`)
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

  // Generate unique values for filters
  const uniqueDays = useMemo(() => {
    const days = registrations.flatMap((reg) => (reg.pass ? reg.pass[0] : []))
    return Array.from(new Set(days.filter((day) => day && day.trim() !== "")))
  }, [registrations])

  const uniqueWorkshops = useMemo(() => {
    return Array.from(
      new Set(
        registrations
          .map((reg) => (reg.pass && reg.pass[1] ? reg.pass[1][0] : ""))
          .filter((workshop) => workshop && workshop.trim() !== "")
      )
    )
  }, [registrations])

  const uniqueColleges = useMemo(() => {
    return Array.from(new Set(registrations.map((reg) => reg.college)))
  }, [registrations])

  const filteredAndSortedData = useMemo(() => {
    return registrations
      .filter((reg) => {
        const lowerSearch = searchTerm.toLowerCase()
        const matchesSearch =
          reg.email.toLowerCase().includes(lowerSearch) ||
          reg.username.toLowerCase().includes(lowerSearch) ||
          reg.college.toLowerCase().includes(lowerSearch) ||
          reg.phone.toLowerCase().includes(lowerSearch)

        const matchesCollege =
          filters.college === "all" ||
          (filters.college &&
            new RegExp(filters.college, "i").test(reg.college))

        // Workshop is stored in reg.pass[1][0]
        const workshopName = reg.pass && reg.pass[1] ? reg.pass[1][0] : ""
        const matchesWorkshop =
          filters.workshop === "all" ||
          (filters.workshop &&
            workshopName.toLowerCase().includes(filters.workshop.toLowerCase()))

        // Day filter: check if the first row of pass contains the selected day
        const dayList = reg.pass ? reg.pass[0] : []
        const matchesDay =
          filters.day === "all" ||
          dayList.some((day) =>
            day.toLowerCase().includes(filters.day.toLowerCase())
          )

        const matchesAmount =
          (!filters.minAmount || reg.amount >= parseInt(filters.minAmount)) &&
          (!filters.maxAmount || reg.amount <= parseInt(filters.maxAmount))

        return (
          matchesSearch &&
          matchesCollege &&
          matchesWorkshop &&
          matchesDay &&
          matchesAmount
        )
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

  // Pagination display logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If we have few pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle range
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed before middle range
      if (startPage > 2) {
        pages.push(-1); // Use -1 to represent ellipsis
      }
      
      // Add middle range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after middle range
      if (endPage < totalPages - 1) {
        pages.push(-2); // Use -2 to represent ellipsis
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startEditAmount = (email: string, currentAmount: number) => {
    setEditingAmount((prev) => ({ ...prev, [email]: currentAmount.toString() }));
  };
  
  const cancelEditAmount = (email: string) => {
    setEditingAmount((prev) => {
      const newEditing = { ...prev };
      delete newEditing[email];
      return newEditing;
    });
  };
  
  const saveEditAmount = async (email: string) => {
    const reg = registrations.find((r) => r.email === email);
    if (!reg) return;
  
    const newAmount = parseFloat(editingAmount[email]);
    if (isNaN(newAmount)) {
      setError("Invalid amount format.");
      return;
    }
  
    try {
      await axios.put(`${API_URL}/update-amount`, {
        phone: reg.phone,
        amount: newAmount,
      });
  
      // Update local state with new amount
      setRegistrations((prev) =>
        prev.map((r) => (r.email === email ? { ...r, amount: newAmount } : r))
      );
  
      cancelEditAmount(email);
      setError(null);
    } catch (err) {
      console.error("Error updating amount:", err);
      setError("Error updating amount.");
    }
  };
  
  const exportToCSV = () => {
    try {
      const exportData = filteredAndSortedData.map((reg) => ({
        Email: reg.email,
        Phone: reg.phone,
        Username: reg.username,
        College: reg.college,
        Pass: JSON.stringify(reg.pass),
        Amount: reg.amount,
        Paid: reg.paid ? "Yes" : "No"
      }))
      
      // Use browser-based approach instead of native filesystem
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Registrations")
      
      // Generate file in browser
      XLSX.writeFile(wb, "registrations.csv")
    } catch (err) {
      console.error("Error exporting to CSV:", err);
    }
  }

  const handleTogglePaid = async (email: string) => {
    const reg = registrations.find((r) => r.email === email)
    if (!reg) return
    const newPaidStatus = !reg.paid
    try {
      await axios.put(`${API_URL}/u1/update-paid-status`, {
        phone: reg.phone,
        paid: newPaidStatus
      })
      setRegistrations((prev) =>
        prev.map((r) =>
          r.email === email ? { ...r, paid: newPaidStatus } : r
        )
      )
      setError(null)
    } catch (err) {
      console.error("Error updating paid status:", err)
      setError("Error updating paid status.")
    }
  }

  const startEditPass = (email: string, currentPass: string[][]) => {
    setEditingPass((prev) => ({ ...prev, [email]: JSON.stringify(currentPass) }))
  }

  const cancelEditPass = (email: string) => {
    setEditingPass((prev) => {
      const newEditing = { ...prev }
      delete newEditing[email]
      return newEditing
    })
  }

  const saveEditPass = async (email: string) => {
    const reg = registrations.find((r) => r.email === email)
    if (!reg) return
    let parsedPass: string[][]
    try {
      parsedPass = JSON.parse(editingPass[email])
    } catch (error) {
      setError("Invalid JSON format for pass.")
      return
    }
    try {
      // Call the endpoint /update-pass to update the pass
      await axios.put(`${API_URL}/update-pass`, {
        phone: reg.phone,
        pass: parsedPass
      })
      // Update local state with new pass
      setRegistrations((prev) =>
        prev.map((r) =>
          r.email === email ? { ...r, pass: parsedPass } : r
        )
      )
      cancelEditPass(email)
      setError(null)
    } catch (err) {
      console.error("Error updating pass:", err)
      setError("Error updating pass.")
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!newUser.username || !newUser.phone || !newUser.email) {
      setError("Username, phone and email are required fields");
      return;
    }
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(newUser.phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
    
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setError("Invalid email format");
      return;
    }
    
    try {
      setLoading(true);
      // Call the API to add the user
      const response = await axios.post(`${API_URL}/u1`, newUser);
      
      // After successful creation, add the new user to the local state
      const newRegistration: Registration = {
        ...newUser,
        pass: [],
        amount: 0,
        count: 0,
        paid: false
      };
      
      setRegistrations(prev => [...prev, newRegistration]);
      
      // Reset the form
      setNewUser({
        username: "",
        phone: "",
        email: "",
        college: ""
      });
      
      // Close the form
      setShowAddUserForm(false);
      
      setError(null);
    } catch (err: any) {
      console.error("Error adding user:", err);
      setError(err.response?.data?.error || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* Add User Form Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New User</h3>
              <button 
                onClick={() => setShowAddUserForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username*</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone*</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                  pattern="^\d{10}$"
                  title="Phone number must be exactly 10 digits"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">College</label>
                <input
                  type="text"
                  value={newUser.college}
                  onChange={(e) => setNewUser({...newUser, college: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-2xl font-bold">Registered Users</h2>
            <p className="text-sm text-gray-500">
              Total Records: {filteredAndSortedData.length} of{" "}
              {registrations.length}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setShowAddUserForm(true)}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
                placeholder="Search by email, phone no, username, or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border p-2 pl-8 rounded"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.college}
                onChange={(e) =>
                  setFilters({ ...filters, college: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
                className="border p-2 rounded w-32"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
                className="border p-2 rounded w-32"
              />
            </div>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p>Loading...</p>
            </div>
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
                        "Paid",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 border cursor-pointer hover:bg-gray-50"
                          onClick={() =>
                            header !== "Paid" && header !== "Pass" &&
                            handleSort(
                              header.toLowerCase() as keyof Registration
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            {header}
                            {sortConfig.key === header.toLowerCase() &&
                              header !== "Paid" && header !== "Pass" && (
                                <Filter
                                  className={`h-4 w-4 ${
                                    sortConfig.direction === "asc"
                                      ? "transform rotate-180"
                                      : ""
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
                        <td className="px-4 py-2 border">{reg.phone}</td>
                        <td className="px-4 py-2 border">{reg.username}</td>
                        <td className="px-4 py-2 border">{reg.college}</td>
                        {/* <td className="px-4 py-2 border">
                          {editingPass[reg.email] ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={editingPass[reg.email]}
                                onChange={(e) =>
                                  setEditingPass({
                                    ...editingPass,
                                    [reg.email]: e.target.value,
                                  })
                                }
                                className="w-full border p-2 rounded text-xs font-mono"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEditPass(reg.email)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => cancelEditPass(reg.email)}
                                  className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="truncate max-w-[120px]">
                                {reg.pass && reg.pass.length > 0
                                  ? JSON.stringify(reg.pass).substring(0, 30) +
                                    (JSON.stringify(reg.pass).length > 30 ? "..." : "")
                                  : "N/A"}
                              </div>
                              <button
                                onClick={() => startEditPass(reg.email, reg.pass || [])}
                                className="text-blue-600 hover:text-blue-800 ml-2"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td> */}
                        {/* <td className="px-4 py-2 border">
                          {editingAmount[reg.email] !== undefined ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingAmount[reg.email]}
                                onChange={(e) =>
                                  setEditingAmount({
                                    ...editingAmount,
                                    [reg.email]: e.target.value,
                                  })
                                }
                                className="w-full border p-1 rounded"
                              />
                              <button
                                onClick={() => saveEditAmount(reg.email)}
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => cancelEditAmount(reg.email)}
                                className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span>₹{reg.amount}</span>
                              <button
                                onClick={() => startEditAmount(reg.email, reg.amount)}
                                className="text-blue-600 hover:text-blue-800 ml-2"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>  */}
                        <td className="px-4 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={reg.paid}
                            onChange={() => handleTogglePaid(reg.email)}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <p className="text-sm text-gray-500 mb-4 md:mb-0">
                  Showing {filteredAndSortedData.length > 0 ? 
                    (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to{" "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAndSortedData.length
                  )}{" "}
                  of {filteredAndSortedData.length} entries
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    First
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {getPageNumbers().map((page, index) => 
                    page < 0 ? (
                      // Ellipsis
                      <span key={`ellipsis-${index}`} className="px-3 py-1">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`border px-3 py-1 rounded hover:bg-gray-50 ${
                          currentPage === page ? "bg-blue-600 text-white" : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Last
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}