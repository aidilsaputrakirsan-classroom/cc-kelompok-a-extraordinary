function ItemCard({ item, onEdit, onDelete }) {
  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.name}>{item.name}</h3>
        <span style={styles.price}>{formatRupiah(item.price)}</span>
      </div>

      {item.description && (
        <p style={styles.description}>{item.description}</p>
      )}

      <div style={styles.meta}>
        <span style={styles.quantity}>📦 Stok: {item.quantity}</span>
        <span style={styles.date}>🕐 {formatDate(item.created_at)}</span>
      </div>

      <div style={styles.actions}>
        <button onClick={() => onEdit(item)} style={styles.btnEdit}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(item.id)} style={styles.btnDelete}>
          🗑️ Hapus
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: "white",
    padding: "1.25rem",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem",
  },
  name: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#1F4E79",
  },
  price: {
    fontWeight: "bold",
    color: "#548235",
    fontSize: "1rem",
    whiteSpace: "nowrap",
  },
  description: {
    color: "#666",
    fontSize: "0.9rem",
    margin: "0.25rem 0 0.75rem 0",
  },
  meta: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.8rem",
    color: "#888",
    marginBottom: "0.75rem",
  },
  quantity: {},
  date: {},
  actions: {
    display: "flex",
    gap: "0.5rem",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "0.75rem",
  },
  btnEdit: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "#DEEBF7",
    color: "#1F4E79",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  btnDelete: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "#FBE5D6",
    color: "#C00000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
}

export default ItemCard