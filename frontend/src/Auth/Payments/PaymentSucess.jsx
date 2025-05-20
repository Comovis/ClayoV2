import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const handleDashboardRedirect = () => {
    window.location.href = '/dashboard'; // This will trigger a full page refresh
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Helmet>
        <title>Payment Successful - SignalFlow</title>
        <meta name="description" content="Your payment was processed successfully. Enjoy your new subscription and features." />
      </Helmet>
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-semibold">Payment Successful</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your payment was processed successfully. You now have access to your subscription and its features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleDashboardRedirect}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1128] text-white rounded-lg hover:bg-[#0a1128cc] transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link to="/">
              <button 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Return Home
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
