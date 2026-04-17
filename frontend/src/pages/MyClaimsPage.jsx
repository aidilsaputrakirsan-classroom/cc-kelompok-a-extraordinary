import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMyClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/claims/me')
      const claimsData = response.data?.data || response.data || []
      if (Array.isArray(claimsData)) {
        setClaims(claimsData)
      } else {
        setClaims([])
      }
    } catch (err) {
      console.error("Error fetching user claims:", err)
      setError(err.response?.data?.detail || "Gagal memuat klaim Anda.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyClaims()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Klaim Saya</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pantau status semua klaim barang yang telah Anda ajukan
        </p>
      </div>

      {loading && <PageState state="loading" loadingText="Memuat daftar klaim Anda..." />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchMyClaims} />}

      {!loading && !error && claims.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">Anda belum mengajukan klaim apapun.</p>
            <Button asChild>
              <Link to="/items">Jelajahi Barang Temuan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        !loading && !error && (
          <div className="space-y-4">
            {claims.map((claim) => (
              <Card key={claim.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{claim.item_title || `Barang #${claim.item_id?.slice(0, 8)}`}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Klaim ID: {claim.id}
                      </CardDescription>
                    </div>
                    <StatusBadge type="claim" status={claim.status} />
                  </div>
                </CardHeader>
                <CardContent className="pb-3 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Jawaban Kepemilikan:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{claim.ownership_answer}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Diajukan: {new Date(claim.created_at).toLocaleDateString("id-ID")}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/items/${claim.item_id}`}>Lihat Barang</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
