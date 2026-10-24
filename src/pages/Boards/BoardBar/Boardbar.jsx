import { useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterIcon from '@mui/icons-material/FilterList'
import Tooltip from '@mui/material/Tooltip'
import { capitalizeFirstLetter } from '~/utils/formatter'
import { selectCardFilter } from '~/redux/activeBoard/activeBoardSlice'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardCardFilterPopover from './BoardCardFilterPopover'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const isFilterOpen = Boolean(filterAnchorEl)
  const cardFilter = useSelector(selectCardFilter)

  const activeFilterCount = (cardFilter?.search ? 1 : 0) + (cardFilter?.labelIds?.length || 0)
  const hasActiveFilter = activeFilterCount > 0

  const handleOpenFilter = (e) => setFilterAnchorEl(e.currentTarget)
  const handleCloseFilter = () => setFilterAnchorEl(null)

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflow: 'auto',
      paddingX: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      // thanh scroll thẳng với list card
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label='Automation'
          clickable
        />

        <Chip
          sx={{
            ...MENU_STYLES,
            ...(hasActiveFilter && {
              bgcolor: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              fontWeight: 600
            })
          }}
          icon={<FilterIcon />}
          label={hasActiveFilter ? `Filters (${activeFilterCount})` : 'Filters'}
          clickable
          onClick={handleOpenFilter}
        />

        <BoardCardFilterPopover
          anchorEl={filterAnchorEl}
          isOpen={isFilterOpen}
          onClose={handleCloseFilter}
          board={board}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* handle invite user into board */}
        <InviteBoardUser boardId={board?._id} />

        {/* handle user group */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
