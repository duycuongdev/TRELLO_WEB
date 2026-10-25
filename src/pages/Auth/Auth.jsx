import { useLocation, Navigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import TrelloIcon from '~/components/Icons/TrelloIcon'
import ModeSelect from '~/components/ModeSelect/ModeSelect'

function Auth() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to="/" replace={true} />
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0b1120' : '#f8fafc',
      color: (theme) => theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Decorative gradient background glows */}
      <Box sx={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '500px',
        borderRadius: '50%',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(11, 17, 32, 0) 70%)'
          : 'radial-gradient(circle, rgba(12, 102, 228, 0.12) 0%, rgba(248, 250, 252, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Decorative abstract shape left */}
      <Box sx={{
        position: 'absolute',
        bottom: '5%',
        left: '-5%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Decorative abstract shape right */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        right: '-5%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 1. Minimal Top Navigation */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        py: 2,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <TrelloIcon fontSize="small" sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}>
            Trello
          </Typography>
        </Link>

        <ModeSelect />
      </Box>

      {/* 2. Main Form Container */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
          zIndex: 1
        }}
      >
        {isLogin && <LoginForm />}
        {isRegister && <RegisterForm />}
      </Container>

      {/* 3. Footer */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        py: 2.5,
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '13px'
      }}>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 0.5 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>•</span>
          <Link to="/boards" style={{ color: 'inherit', textDecoration: 'none' }}>Boards</Link>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          © 2026 Trello || All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default Auth
