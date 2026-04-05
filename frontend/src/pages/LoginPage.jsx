import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>Gunakan email kampus untuk masuk.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Sign in with Google</Button>
        </CardContent>
      </Card>
    </div>
  )
}
