
import { SignIn, SignUp, useUser } from '@clerk/clerk-react'

interface ClerkAuthProps {
  mode: 'signin' | 'signup'
  onClose?: () => void
}

const ClerkAuth = ({ mode, onClose }: ClerkAuthProps) => {
  const { user } = useUser()

  if (user) {
    return null
  }

  const commonProps = {
    forceRedirectUrl: '/',
    fallbackRedirectUrl: '/',
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {mode === 'signup' ? (
        <SignUp 
          {...commonProps}
          signInUrl="#"
          afterSignUpUrl="/"
        />
      ) : (
        <SignIn 
          {...commonProps}
          signUpUrl="#"
          afterSignInUrl="/"
        />
      )}
    </div>
  )
}

export default ClerkAuth
