import { useEffect } from "react"

/**
 * Toast Notification Component
 * @param {{ message: string, type: 'success' | 'error' | 'info', onClose: () => void }} props
 */
function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
  }[type]

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }[type]

  return (
    <div style={{ ...styles.toast, backgroundColor: bgColor }}>
      <span style={styles.icon}>{icon}</span>
      <span style={styles.message}>{message}</span>
      <button onClick={onClose} style={styles.closeBtn}>
        ×
      </button>
    </div>
  )
}

const styles = {
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    minWidth: "280px",
    animation: "slideIn 0.3s ease-out",
  },
  icon: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  message: {
    flex: 1,
    fontSize: "14px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0",
    lineHeight: 1,
  },
}

export default Toast
