import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth'

export const EmailVerificationHandler = () => {
  const auth = useAuth()
  const { query } = useRouter()
  const queryId = query !== '' && query.id

  useEffect(() => {
    if (queryId) {
      auth.emailVerification({
        token: queryId,
        status: 'verify'
      })
    }
  }, [queryId])

  return null
}
