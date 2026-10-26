import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
import { toast } from 'react-toastify'

const AccountVerification = () => {
  const [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  const navigate = useNavigate()
  const hasRequested = useRef(false)

  useEffect(() => {
    if (!email || !token) return
    if (hasRequested.current) return
    hasRequested.current = true

    verifyUserAPI({ email, token })
      .then(() => {
        toast.success('Your email has been verified! Welcome to Trello.')
        navigate(`/login?verifiedEmail=${encodeURIComponent(email)}`, { replace: true })
      })
      .catch((error) => {
        const errorMsg = error?.response?.data?.message || ''
        if (errorMsg.toLowerCase().includes('already active')) {
          toast.info('Your account is already active. Please log in.')
          navigate(`/login?verifiedEmail=${encodeURIComponent(email)}`, { replace: true })
        } else {
          toast.error(errorMsg || 'Verification failed or invalid token. Please log in or try again.')
          navigate('/login', { replace: true })
        }
      })
  }, [email, token, navigate])

  if (!email || !token) {
    return <Navigate to='/404' replace />
  }

  return <PageLoadingSpinner caption='Verifying your account...' />
}

export default AccountVerification
