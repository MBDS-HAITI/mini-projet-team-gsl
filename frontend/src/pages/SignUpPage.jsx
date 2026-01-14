import React from 'react';
import { SignUp } from '@clerk/clerk-react';

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inscrivez-vous pour accéder à l'application
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
