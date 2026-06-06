import { Component } from "react"
import { RotateCcw } from "lucide-react"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("Unhandled frontend error:", error, info)
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4">
          <Alert variant="destructive">
            <AlertTitle>Halaman gagal dimuat</AlertTitle>
            <AlertDescription>
              Terjadi kesalahan pada tampilan. Muat ulang halaman untuk mencoba lagi.
            </AlertDescription>
            <AlertAction>
              <Button variant="outline" size="sm" onClick={this.handleRefresh}>
                <RotateCcw data-icon="inline-start" />
                Refresh
              </Button>
            </AlertAction>
          </Alert>
        </main>
      )
    }

    return this.props.children
  }
}
