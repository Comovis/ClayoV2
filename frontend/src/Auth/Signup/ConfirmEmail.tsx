import { useState, useEffect } from "react"
import { Mail, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { supabase } from "../../Auth/SupabaseAuth"

// Simple image import for logo
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"


// API Base URL Configuration
const apiBaseUrl = import.meta.env.MODE === "development"
  ? import.meta.env.VITE_DEVELOPMENT_URL
  : import.meta.env.VITE_API_URL;

export default function EmailVerificationPage() {
  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get email from session or localStorage
    const getEmail = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user.email) {
        setEmail(data.session.user.email)
        // If we already have a session, the user is verified
        navigate("/onboarding")
      } else {
        // Fallback to localStorage if you stored it there during signup
        const storedEmail = localStorage.getItem("userEmail")
        if (storedEmail) setEmail(storedEmail)
      }
    }

    getEmail()
  }, [navigate])

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendSuccess(false);
    setResendError(null);

    try {
      // Call our API to resend the confirmation email
      const response = await fetch(`${apiBaseUrl}/resend-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resend confirmation email');
      }

      setResendSuccess(true);
    } catch (error: any) {
      console.error("Error resending email:", error);
      setResendError(error.message || "Failed to resend email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-8 mx-auto mb-4" />
          <p className="text-gray-600">Streamline your maritime compliance and prevent vessel detentions</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-gray-600 mt-2">
              We've sent a verification link to:
            </p>
            <p className="font-medium text-lg mt-1">{email || "your email address"}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>
                  Please check your inbox and click the verification link to activate your account. 
                  After verification, you'll be automatically redirected to set up your account.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex justify-center items-center"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </button>
              {resendSuccess && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verification email resent successfully
                </p>
              )}
              {resendError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {resendError}
                </p>
              )}
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Need help?{" "}
                <a href="mailto:support@comovis.com" className="text-blue-600 hover:underline">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}