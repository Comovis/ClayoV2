import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail } from "lucide-react"

export default function ExpiredShareView({ shareInfo }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle>This Document Share Has Expired</CardTitle>
          <CardDescription>The secure link to these documents is no longer active.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Vessel:</p>
                  <p className="text-sm text-gray-500">{shareInfo.vessel.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Port:</p>
                  <p className="text-sm text-gray-500">{shareInfo.port.name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Shared by:</p>
              <p className="text-sm text-gray-500">
                {shareInfo.sender.name} ({shareInfo.sender.company})
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Expired on:</p>
              <p className="text-sm text-gray-500">{new Date(shareInfo.expiresAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center">
          <Button className="w-full mb-2">
            <Mail className="mr-2 h-4 w-4" />
            Contact Sender
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            If you need access to these documents, please contact the sender at {shareInfo.sender.email}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
