import { useState, useEffect } from "react"

function App() {
  const [data, setData] = useState(null)
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch API root
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error:", err)
        setLoading(false)
      })

    // Fetch team info
    fetch("http://localhost:8000/team")
      .then(res => res.json())
      .then(json => setTeam(json))
      .catch(err => console.error("Error:", err))
  }, [])

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>☁️ Cloud App</h1>
      <h2>Mata Kuliah Komputasi Awan - SI ITK</h2>

      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div>
          <h3>API Response:</h3>
          <p>Message: {data.message}</p>
          <p>Status: {data.status}</p>
          <p>Version: {data.version}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>Error connecting to backend</p>
      )}

      {team && (
        <div>
          <h3>Tim: {team.team}</h3>
          <ul>
            {team.members.map((m, i) => (
              <li key={i}>{m.name} ({m.nim}) - {m.role}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App