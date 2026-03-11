const API_URL = "http://localhost:8000"

// ==================== GET ====================

export async function fetchItems(search = "", skip = 0, limit = 20) {
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  params.append("skip", skip)
  params.append("limit", limit)

  const response = await fetch(`${API_URL}/items?${params}`)
  if (!response.ok) throw new Error("Gagal mengambil data items")
  return response.json()
}

export async function fetchItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`)
  if (!response.ok) throw new Error(`Item ${id} tidak ditemukan`)
  return response.json()
}

// ==================== POST ====================

export async function createItem(itemData) {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Gagal membuat item")
  }
  return response.json()
}

// ==================== PUT ====================

export async function updateItem(id, itemData) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Gagal mengupdate item")
  }
  return response.json()
}

// ==================== DELETE ====================

export async function deleteItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",   
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Gagal menghapus item ${id}`)
  }

  return true
}

// ==================== HEALTH ====================

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    return data.status === "healthy"
  } catch {
    return false
  }
}