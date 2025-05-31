import { Ship, Anchor } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
      <div className="mb-6 flex items-center">
        <Ship className="h-16 w-16 text-slate-700 mr-3" />
        <Anchor className="h-12 w-12 text-slate-600" />
      </div>
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Comovis
      </h1>
      <p className="text-2xl text-gray-600 mb-6 max-w-2xl">
        Preventing vessel detentions and delays through intelligent maritime compliance
      </p>
      <Badge className="text-lg py-1 px-3 bg-slate-100 text-slate-800 border border-slate-200">
        Pre-Seed Investment Opportunity • 2025
      </Badge>
    </div>
  )
}
