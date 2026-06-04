import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { SERVICE_ERROR_EVENT } from "@/config/api"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function ServiceErrorBanner() {
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleServiceError = (event) => setError(event.detail)
    window.addEventListener(SERVICE_ERROR_EVENT, handleServiceError)

    return () => window.removeEventListener(SERVICE_ERROR_EVENT, handleServiceError)
  }, [])

  if (!error) return null

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="border-b bg-background px-4 py-3">
      <div className="mx-auto max-w-5xl">
        <Alert variant="destructive">
          <AlertTitle>Layanan sementara terganggu</AlertTitle>
          <AlertDescription>
            {error.message}
            {error.correlationId && (
              <span className="mt-1 block font-mono text-xs">
                Trace: {error.correlationId}
              </span>
            )}
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RotateCcw data-icon="inline-start" />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      </div>
    </div>
  )
}
