/**
 * Loading Spinner Component
 * @param {{ size?: 'small' | 'medium' | 'large', text?: string }} props
 */
function LoadingSpinner({ size = "medium", text }) {
  const dimensions = {
    small: "20px",
    medium: "40px",
    large: "60px",
  }[size]

  const borderWidth = {
    small: "2px",
    medium: "3px",
    large: "4px",
  }[size]

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.spinner,
          width: dimensions,
          height: dimensions,
          borderWidth: borderWidth,
        }}
      />
      {text && <p style={styles.text}>{text}</p>}
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  spinner: {
    borderStyle: "solid",
    borderColor: "#e5e7eb #e5e7eb #3b82f6 #e5e7eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
}

export default LoadingSpinner
