function Header({ totalItems, isConnected }) {
  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>☁️ Cloud App</h1>
        <p style={styles.subtitle}>Komputasi Awan — SI ITK</p>
      </div>
      <div style={styles.stats}>
        <span style={styles.badge}>
          {totalItems} items
        </span>
        <span style={{
          ...styles.status,
          backgroundColor: isConnected ? "#E2EFDA" : "#FBE5D6",
          color: isConnected ? "#548235" : "#C00000",
        }}>
          {isConnected ? "🟢 API Connected" : "🔴 API Disconnected"}
        </span>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    backgroundColor: "#1F4E79",
    color: "white",
    borderRadius: "12px",
    marginBottom: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
  },
  subtitle: {
    margin: "0.25rem 0 0 0",
    fontSize: "0.9rem",
    opacity: 0.8,
  },
  stats: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
  },
  status: {
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
}

export default Header