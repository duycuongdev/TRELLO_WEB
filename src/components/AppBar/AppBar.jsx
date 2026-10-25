import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import TrelloIcon from '~/components/Icons/TrelloIcon'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Profile from './Menus/Profile'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function AppBar() {
  const activeBoard = useSelector(selectCurrentActiveBoard)

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      paddingX: 2,
      bgcolor: activeBoard?.background
        ? 'rgba(0, 0, 0, 0.35)'
        : (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
      backdropFilter: activeBoard?.background ? 'blur(6px)' : 'none',
      borderBottom: activeBoard?.background ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
      transition: 'background 0.3s ease',
      // thanh scroll thẳng với list card
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/boards'>
          <Tooltip title="Board List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>
        <Link to='/boards' style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrelloIcon fontSize='small' sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
          </Box>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* search board */}
        <AutoCompleteSearchBoard />

        {/* dark mode and light mode */}
        <ModeSelect />

        {/* notifications */}
        <Notifications />

        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
