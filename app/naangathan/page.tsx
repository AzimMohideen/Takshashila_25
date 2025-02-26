'use client';
import { useState, useEffect, useMemo } from "react"
import { Search, Download, RefreshCw, Filter } from "lucide-react"
import axios from "axios"
import * as XLSX from "xlsx"

const ADMIN_PASSWORD = "therilaiye"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const ITEMS_PER_PAGE = 10

type Registration = {
  email: string
  phone_no: string
  username: string
  college_name: string
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
  // State for editing the pass (maps user email to JSON string)
  const [editingPass, setEditingPass] = useState<Record<string, string>>({})

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

  // Generate unique values for the new "day" filter from pass[0]
  const uniqueDays = useMemo(() => {
    const days = registrations.flatMap((reg) => (reg.pass ? reg.pass[0] : []))
    return Array.from(new Set(days.filter((day) => day && day.trim() !== "")))
  }, [registrations])

  // Generate unique workshop options as before (from pass[1][0])
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
    return Array.from(new Set(registrations.map((reg) => reg.college_name)))
  }, [registrations])

  const filteredAndSortedData = useMemo(() => {
    return registrations
      .filter((reg) => {
        const lowerSearch = searchTerm.toLowerCase()
        const matchesSearch =
          reg.email.toLowerCase().includes(lowerSearch) ||
          reg.username.toLowerCase().includes(lowerSearch) ||
          reg.college_name.toLowerCase().includes(lowerSearch) ||
          reg.phone_no.toLowerCase().includes(lowerSearch)

        const matchesCollege =
          filters.college === "all" ||
          (filters.college &&
            new RegExp(filters.college, "i").test(reg.college_name))

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
        phone_no: reg.phone_no,
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
    const exportData = filteredAndSortedData.map((reg) => ({
      Email: reg.email,
      Phone: reg.phone_no,
      Username: reg.username,
      College: reg.college_name,
      Pass: JSON.stringify(reg.pass),
      Amount: reg.amount,
      Paid: reg.paid ? "Yes" : "No"
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Registrations")
    XLSX.writeFile(wb, "registrations.csv", { bookType: "csv", type: "string" })
  }

  const handleTogglePaid = async (email: string) => {
    const reg = registrations.find((r) => r.email === email)
    if (!reg) return
    const newPaidStatus = !reg.paid
    try {
      await axios.put(`${API_URL}/update-paid-status`, {
        phone_no: reg.phone_no,
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

  // Functions to handle inline editing of the pass field
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
      // Call the endpoint /update-apss to update the pass
      await axios.put(`${API_URL}/update-apss`, {
        phone_no: reg.phone_no,
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
              <select
                value={filters.workshop}
                onChange={(e) =>
                  setFilters({ ...filters, workshop: e.target.value })
                }
                className="border p-2 rounded w-48"
              >
                <option value="all">All Workshops</option>
                {uniqueWorkshops.map((workshop) => (
                  <option key={workshop} value={workshop}>
                    {workshop}
                  </option>
                ))}
              </select>
              <select
                value={filters.day}
                onChange={(e) =>
                  setFilters({ ...filters, day: e.target.value })
                }
                className="border p-2 rounded w-48"
              >
                <option value="all">All Days</option>
                {uniqueDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
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
                        "Paid",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 border cursor-pointer hover:bg-gray-50"
                          onClick={() =>
                            header !== "Paid" &&
                            handleSort(
                              header.toLowerCase() as keyof Registration
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            {header}
                            {sortConfig.key === header.toLowerCase() &&
                              header !== "Paid" && (
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
                        <td className="px-4 py-2 border">{reg.phone_no}</td>
                        <td className="px-4 py-2 border">{reg.username}</td>
                        <td className="px-4 py-2 border">{reg.college_name}</td>
                        <td className="px-4 py-2 border">
                          {editingPass[reg.email] !== undefined ? (
                            <>
                              <input
                                type="text"
                                value={editingPass[reg.email]}
                                onChange={(e) =>
                                  setEditingPass((prev) => ({
                                    ...prev,
                                    [reg.email]: e.target.value,
                                  }))
                                }
                                className="w-full border p-1 rounded"
                              />
                              <div className="mt-1 flex gap-1">
                                <button
                                  onClick={() => saveEditPass(reg.email)}
                                  className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => cancelEditPass(reg.email)}
                                  className="px-2 py-1 text-sm bg-gray-500 text-white rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span>{JSON.stringify(reg.pass)}</span>
                              <button
                                onClick={() =>
                                  startEditPass(reg.email, reg.pass)
                                }
                                className="ml-2 text-sm text-blue-600 underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {editingAmount[reg.email] !== undefined ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingAmount[reg.email]}
                                onChange={(e) =>
                                  setEditingAmount((prev) => ({
                                    ...prev,
                                    [reg.email]: e.target.value,
                                  }))
                                }
                                className="border px-2 py-1 rounded w-20"
                              />
                              <button
                                onClick={() => saveEditAmount(reg.email)}
                                className="text-green-600"
                              >
                                ✅
                              </button>
                              <button
                                onClick={() => cancelEditAmount(reg.email)}
                                className="text-red-600"
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <span
                              onDoubleClick={() =>
                                startEditAmount(reg.email, reg.amount)
                              }
                              className="cursor-pointer"
                            >
                              ₹{reg.amount}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={reg.paid}
                            onChange={() => handleTogglePaid(reg.email)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAndSortedData.length
                  )}{" "}
                  of {filteredAndSortedData.length} entries
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
  );
}