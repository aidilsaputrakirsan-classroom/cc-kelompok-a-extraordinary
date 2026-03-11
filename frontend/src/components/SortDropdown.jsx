function SortDropdown({ sortBy, onChange }) {
  return (
    <div style={styles.wrapper}>
      <label htmlFor="sort" style={styles.label}>
        Urutkan berdasarkan:
      </label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        <option value="name">Nama</option>
        <option value="price">Harga</option>
        <option value="newest">Terbaru</option>
      </select>
    </div>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  label: {
    fontSize: "0.9rem",
    color: "#333",
  },
  select: {
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
  },
}

export default SortDropdown
