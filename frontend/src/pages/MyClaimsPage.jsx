import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyClaims = async () => {
      try {
        const response = await api.get('/claims/my')
        // Handle both response.data.data and response.data directly
        const claimsData = response.data?.data || response.data || []
        if (Array.isArray(claimsData)) {
          setClaims(claimsData)
        }
      } catch (err) {
        console.error("Error fetching user claims:", err)
        // Mock fallback data for development
        setClaims([
          {
            id: 1,
            item_id: 2,
            item_title: "Kunci Lemari Eiger",
            status: "pending",
            verification_answer: "Kunci warna perak dengan logo Eiger",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            item_id: 3,
            item_title: "Botol Tupperware Hitam",
            status: "approved",
            verification_answer: "Botol hitam berisi minuman",
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }
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

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground animate-pulse">Memuat daftar klaim Anda...</p>
        </div>
      ) : claims.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">Anda belum mengajukan klaim apapun.</p>
            <Button asChild>
              <Link to="/items">Jelajahi Barang Temuan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{claim.item_title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Klaim ID: {claim.id}
                    </CardDescription>
                  </div>
                  <StatusBadge type="claim" status={claim.status} />
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Jawaban Verifikasi:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{claim.verification_answer}</p>
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
      )}
    </div>
  )
}
