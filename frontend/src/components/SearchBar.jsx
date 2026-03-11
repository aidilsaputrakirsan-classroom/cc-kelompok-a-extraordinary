import { useState } from "react"

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Cari item berdasarkan nama atau deskripsi..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.btnSearch}>
        🔍 Cari
      </button>
      {query && (
        <button type="button" onClick={handleClear} style={styles.btnClear}>
          ✕ Clear
        </button>
      )}
    </form>
  )
}

const styles = {
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  },
  btnSearch: {
    padding: "0.75rem 1.25rem",
    backgroundColor: "#2E75B6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  btnClear: {
    padding: "0.75rem 1rem",
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
}

export default SearchBar