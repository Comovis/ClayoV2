import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, AlertCircle, Clock, Share2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotificationsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <div className="space-y-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Ship Security Plan Missing</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Humble Warrior is missing a required Ship Security Plan document. This is a common deficiency
                      found during PSC inspections.
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Today, 09:15 AM</div>
                  <div>
                    <Link href="/document-upload">
                      <Button size="sm">Upload Document</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Safety Management Certificate Expiring Soon</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Humble Warrior's Safety Management Certificate expires in 28 days (Nov 20, 2023), during the
                      scheduled port stay in Singapore.
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Today, 08:30 AM</div>
                  <div>
                    <Link href="/document-hub">
                      <Button size="sm" variant="outline">
                        Start Renewal Process
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Singapore PSC Inspection Preparation Required</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Humble Warrior has a medium risk of PSC inspection in Singapore. Current focus areas include fire
                      safety systems and MARPOL Annex I compliance.
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Yesterday, 4:45 PM</div>
                  <div>
                    <Link href="/deficiency-prevention">
                      <Button size="sm" variant="outline">
                        Prepare for Inspection
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Safety Equipment Certificate Uploaded</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Safety Equipment Certificate for Pacific Explorer has been successfully uploaded and verified.
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Info</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Yesterday, 10:23 AM</div>
                  <div>
                    <Link href="/document-hub">
                      <Button size="sm" variant="outline">
                        View Document
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Share2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Documents Shared with Singapore MPA</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      4 documents for Humble Warrior have been shared with Singapore Maritime and Port Authority.
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Info</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Oct 19, 2023, 3:45 PM</div>
                  <div>
                    <Link href="/document-sharing">
                      <Button size="sm" variant="outline">
                        View Sharing History
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
