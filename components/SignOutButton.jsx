import React from 'react'
import { Button } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'

// Small sign-out button used on the root page (app/(root)/index.jsx)
// Follows project pattern of default exports in components folder.
export default function SignOutButton() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed', err)
    }
  }

  return <Button title="Sign out" onPress={handleSignOut} />
}
