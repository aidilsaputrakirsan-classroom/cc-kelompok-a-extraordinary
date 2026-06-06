import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ServiceErrorBanner from "@/components/ServiceErrorBanner"
import { SERVICE_ERROR_EVENT } from "@/config/api"

describe("ServiceErrorBanner", () => {
  it("renders retry banner with correlation id from service error event", async () => {
    render(<ServiceErrorBanner />)

    window.dispatchEvent(new CustomEvent(SERVICE_ERROR_EVENT, {
      detail: {
        message: "Layanan sementara terganggu. Coba muat ulang halaman ini.",
        correlationId: "trace-123",
      },
    }))

    expect(await screen.findByText("Layanan sementara terganggu")).toBeInTheDocument()
    expect(screen.getByText("Trace: trace-123")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
  })

  it("dismisses the service error banner without reloading", async () => {
    render(<ServiceErrorBanner />)

    window.dispatchEvent(new CustomEvent(SERVICE_ERROR_EVENT, {
      detail: {
        message: "Layanan sementara terganggu. Coba muat ulang halaman ini.",
      },
    }))

    expect(await screen.findByText("Layanan sementara terganggu")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Tutup banner gangguan layanan" }))

    await waitFor(() => {
      expect(screen.queryByText("Layanan sementara terganggu")).not.toBeInTheDocument()
    })
  })
})
