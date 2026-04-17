import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PageState({ state, loadingText = "Memuat data...", emptyText = "Data kosong.", errorText = "Terjadi kesalahan.", onRetry }) {
  if (state === "loading") {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted-foreground animate-pulse">{loadingText}</span>
      </div>
    )
  }

  if (state === "error") {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-destructive font-medium">{errorText}</p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Coba Lagi
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (state === "empty") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">{emptyText}</p>
        </CardContent>
      </Card>
    )
  }

  return null
}
