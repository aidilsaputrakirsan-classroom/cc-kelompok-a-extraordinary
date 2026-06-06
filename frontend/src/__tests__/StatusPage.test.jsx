import { act, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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

  afterEach(() => {
    vi.useRealTimers()
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

  it("shows degraded service status as non-success status", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        services: [
          { name: "engagement", status: "degraded", latency_ms: 42 },
        ],
      },
    })

    render(<StatusPage />)

    const degradedBadge = await screen.findByLabelText("Engagement Service degraded")
    expect(degradedBadge).toBeInTheDocument()
    expect(degradedBadge).toHaveTextContent("degraded")
    expect(degradedBadge).not.toHaveClass("text-success")
  })

  it("polls status endpoint every 30 seconds", async () => {
    vi.useFakeTimers()
    api.get
      .mockResolvedValueOnce({ data: { services: [] } })
      .mockResolvedValueOnce({ data: { services: [] } })

    render(<StatusPage />)

    expect(api.get).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(30000)
      await Promise.resolve()
    })

    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it("aborts active polling requests on unmount", async () => {
    vi.useFakeTimers()
    const signals = []
    api.get.mockImplementation((_url, config) => {
      signals.push(config.signal)
      return new Promise(() => {})
    })

    const { unmount } = render(<StatusPage />)

    expect(api.get).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(30000)
      await Promise.resolve()
    })

    expect(api.get).toHaveBeenCalledTimes(2)

    unmount()

    expect(signals).toHaveLength(2)
    expect(signals.every((signal) => signal.aborted)).toBe(true)
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
