import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useConfirm } from 'material-ui-confirm'
import { removeBoardMemberAPI } from '~/apis'
import { removeMemberFromBoard } from '~/redux/activeBoard/activeBoardSlice'

function BoardUserGroup({ boardUsers = [], limit = 4, boardId, ownerIds = [], isOwner = false }) {
  const confirmRemoveMember = useConfirm()
  const dispatch = useDispatch()
  // State to manage the popover for showing all users when the limit is exceeded
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const handleRemoveMember = (user) => {
    confirmRemoveMember({
      title: 'Remove member?',
      description: `Remove ${user?.displayName} from this board?`,
      confirmationText: 'Remove',
      cancellationText: 'Cancel'
    }).then(async () => {
      await removeBoardMemberAPI(boardId, user._id)
      dispatch(removeMemberFromBoard(user._id))
      toast.success('Member removed from board')
    }).catch((error) => {
      if (error?.response) {
        toast.error(error.response.data?.message || 'Unable to remove member')
      }
    })
  }

  const renderUser = (user, index) => {
    const userIsOwner = ownerIds.some(id => id.toString() === user?._id?.toString())
    return (
      <Box key={user?._id || index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title={user?.displayName}>
          <Avatar sx={{ width: 34, height: 34 }} alt={user?.displayName} src={user?.avatar} />
        </Tooltip>
        {isOwner && !userIsOwner &&
          <IconButton size="small" onClick={() => handleRemoveMember(user)} aria-label={`Remove ${user?.displayName}`}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        }
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {/* display limit number of users */}
      {boardUsers.map((user, index) => index < limit ? renderUser(user, index) : null)}

      {/* if the number of users exceeds the limit, show the "+number" button */}
      {boardUsers.length > limit &&
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      }

      {/* popover to show all users */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '235px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {boardUsers.map(renderUser)}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
