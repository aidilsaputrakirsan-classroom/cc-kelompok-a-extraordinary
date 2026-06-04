import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import StatusPage from "@/pages/StatusPage"
import { api } from "@/config/api"

vi.mock("@/config/api", () => ({
  api: {
    get: vi.fn(),
  },
}))

describe("StatusPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches service status from the public status endpoint", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        services: [
          { name: "auth", status: "up", latency_ms: 12 },
          { name: "item", status: "down", latency_ms: null },
        ],
      },
    })

    render(<StatusPage />)

    expect(await screen.findByText("Auth Service")).toBeInTheDocument()
    expect(screen.getByText("Item Service")).toBeInTheDocument()
    expect(screen.getByLabelText("Auth Service up")).toBeInTheDocument()
    expect(screen.getByLabelText("Item Service down")).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith("/api/status", expect.objectContaining({
      signal: expect.any(AbortSignal),
    }))
  })

  it("shows an error banner when status endpoint fails", async () => {
    api.get.mockRejectedValueOnce(new Error("service unavailable"))

    render(<StatusPage />)

    await waitFor(() => {
      expect(screen.getByText("Status belum tersedia")).toBeInTheDocument()
    })
    expect(screen.getByText("Gagal memuat status layanan.")).toBeInTheDocument()
  })
})
