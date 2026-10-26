import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

const AccountVerification = () => {
  const [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  const navigate = useNavigate()
  const hasRequested = useRef(false)

  useEffect(() => {
    if (!email || !token) return
    if (hasRequested.current) return
    hasRequested.current = true

    // verifyUserAPI đã tự động hiển thị 1 toast.success duy nhất với toastId cố định
    // authorizedAxiosInstance đã tự động hiển thị 1 toast.error duy nhất nếu thất bại
    verifyUserAPI({ email, token })
      .then(() => {
        navigate(`/login?verifiedEmail=${encodeURIComponent(email)}`, { replace: true })
      })
      .catch((error) => {
        const errorMsg = error?.response?.data?.message || ''
        if (errorMsg.toLowerCase().includes('already active')) {
          navigate(`/login?verifiedEmail=${encodeURIComponent(email)}`, { replace: true })
        } else {
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
