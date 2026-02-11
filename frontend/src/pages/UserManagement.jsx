import { useEffect, useState } from "react";
import { getEmployees } from "../api/employeeApi";
import "../styles/userManagement.css";

export default function Users() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // ✅ Fetch EMPLOYEES (not users)
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();

      console.log("EMPLOYEES API RESPONSE:", res.data);

      setEmployees(res.data.employees || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
    }
  };


  // 🔍 SEARCH (name, email, employeeCode)
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="um-container">
      {/* Header */}
      <div className="um-header">
        <h2>Employees</h2>
        <input
          className="um-search"
          placeholder="Search name, email, or employee ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Employee Cards */}
      {currentEmployees.length === 0 ? (
        <p style={{ padding: "1rem" }}>No employees found.</p>
      ) : (
        currentEmployees.map(emp => (
          <div className="um-card" key={emp._id}>
            <div>
              <div className="um-name">
                {emp.name}
                <span style={{ fontSize: "0.85rem", color: "#666", marginLeft: 8 }}>
                  ({emp.employeeCode})
                </span>
              </div>
              <div className="um-email">{emp.email}</div>
              <div style={{ fontSize: "0.85rem", color: "#555" }}>
                {emp.department} · {emp.designation}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="um-pagination">
          <button
            className="um-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`um-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="um-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
