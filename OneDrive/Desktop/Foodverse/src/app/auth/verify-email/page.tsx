'use client';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-4 text-gray-600">
            We&apos;ve sent a confirmation link to your email. Please click it
            to verify your account.
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Check your inbox and follow the verification link. You may need to
            check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
