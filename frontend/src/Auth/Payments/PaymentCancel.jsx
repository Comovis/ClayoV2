import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Helmet>
        <title>Payment Cancelled - SignalFlow</title>
        <meta name="description" content="Your payment was not completed. Try again or reach out to support for assistance." />
      </Helmet>
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-semibold">Payment Cancelled</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            It looks like your payment was not completed. You can try again or reach out to support if you have any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard">
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1128] text-white rounded-lg hover:bg-[#0a1128cc] transition-colors"
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

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

export default PaymentCancelled;
