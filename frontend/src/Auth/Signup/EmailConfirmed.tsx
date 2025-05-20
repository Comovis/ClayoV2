import { useEffect, useState } from "react"
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { supabase } from "../../Auth/SupabaseAuth"

// Simple image import for logo
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

export default function EmailConfirmationPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3) // Countdown for auto-redirect
  const navigate = useNavigate()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const type = hashParams.get("type")

        if (type === "signup" && accessToken) {
          // Set the session with the tokens
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          })
          
          setIsProcessing(false)
          
          // Start countdown for auto-redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer)
                navigate("/onboarding")
                return 0
              }
              return prev - 1
            })
          }, 1000)
          
          return () => clearInterval(timer)
        } else {
          setError("Invalid verification link")
          setIsProcessing(false)
        }
      } catch (err) {
        console.error("Error confirming email:", err)
        setError("There was a problem verifying your email")
        setIsProcessing(false)
      }
    }

    confirmEmail()
  }, [navigate])

  const handleContinue = () => {
    navigate("/onboarding")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-8 mx-auto mb-4" />
          <p className="text-gray-600">Streamline your maritime compliance and prevent vessel detentions</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          {isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
              <p className="text-gray-500 mt-2">This will only take a moment</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-2 bg-red-100 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Verification Failed</h2>
              <p className="text-gray-500 mt-2">{error}</p>
              <button
                onClick={() => navigate("/signup")}
                className="mt-6 py-2 px-4 bg-black text-white rounded-md hover:bg-black/90"
              >
                Back to Sign Up
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Email Verified Successfully!</h2>
              <p className="text-gray-500 mt-2">
                Your email has been verified. You'll be redirected to set up your account in {countdown} seconds.
              </p>
              
              <button
                onClick={handleContinue}
                className="mt-6 py-2 px-4 bg-black text-white rounded-md hover:bg-black/90"
              >
                Continue Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}