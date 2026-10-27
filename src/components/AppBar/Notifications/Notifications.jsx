import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI,
  addNotification
} from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // get data noti from redux store
  const notifications = useSelector(selectCurrentNotifications)

  // get current user from redux store
  const currentUser = useSelector(selectCurrentUser)

  // check noti
  const [newNotification, setNewNotification] = useState(false)

  // Kiểm tra xem có lời mời chưa chấp nhận hoặc task sắp/quá hạn không
  const hasAlerts = notifications?.some(n =>
    n.type === 'CARD_DEADLINE' ||
    n.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING
  )

  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    // when click notification icon, set newNotification to false
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (currentUser?._id) {
      socketIoInstance.emit('FE_USER_JOIN_ROOM', currentUser._id)
    }

    dispatch(fetchInvitationsAPI())

    // handle get event real time
    const onReceiveInvitation = (invitation) => {
      if (invitation.inviteeId === currentUser?._id) {
        // update invitation to redux store
        dispatch(addNotification(invitation))
        // update state newNotification to true
        setNewNotification(true)
      }
    }

    // listen to event from server
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveInvitation)

    const onConnect = () => {
      if (currentUser?._id) {
        socketIoInstance.emit('FE_USER_JOIN_ROOM', currentUser._id)
      }
    }
    socketIoInstance.on('connect', onConnect)

    // clear event to except resign
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveInvitation)
      socketIoInstance.off('connect', onConnect)
    }
  }, [dispatch, currentUser?._id])

  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId }))
      .then(res => {
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={(hasAlerts || newNotification) ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{ color: (hasAlerts || newNotification) ? '#f59e0b' : 'white' }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
        PaperProps={{
          sx: {
            maxHeight: 460,
            width: { xs: 'min(360px, 92vw)', sm: 380 }
          }
        }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200, color: 'text.secondary' }}>
            You do not have any new notifications.
          </MenuItem>
        )}

        {notifications?.map((notification, index) => {
          // Trường hợp 1: Thông báo Task Quá hạn hoặc Sắp hết hạn
          if (notification.type === 'CARD_DEADLINE') {
            const isOverdue = notification.deadlineStatus === 'OVERDUE'
            return (
              <Box key={notification._id || index}>
                <MenuItem
                  onClick={() => {
                    navigate(`/boards/${notification.boardId}?cardId=${notification.cardId}`)
                    handleClose()
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    whiteSpace: 'normal',
                    borderLeft: (theme) => `4px solid ${isOverdue ? theme.palette.error.main : theme.palette.warning.main}`,
                    bgcolor: (theme) => isOverdue
                      ? (theme.palette.mode === 'dark' ? 'rgba(239, 83, 80, 0.08)' : 'rgba(239, 83, 80, 0.04)')
                      : (theme.palette.mode === 'dark' ? 'rgba(255, 167, 38, 0.08)' : 'rgba(255, 167, 38, 0.04)'),
                    '&:hover': {
                      bgcolor: (theme) => isOverdue
                        ? (theme.palette.mode === 'dark' ? 'rgba(239, 83, 80, 0.16)' : 'rgba(239, 83, 80, 0.1)')
                        : (theme.palette.mode === 'dark' ? 'rgba(255, 167, 38, 0.16)' : 'rgba(255, 167, 38, 0.1)')
                    }
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {/* Header với Icon & Chip */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        {isOverdue ? (
                          <AccessAlarmIcon fontSize="small" color="error" />
                        ) : (
                          <WatchLaterOutlinedIcon fontSize="small" color="warning" />
                        )}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: isOverdue ? 'error.main' : 'warning.main' }}>
                          {isOverdue ? 'Task Overdue' : 'Task Due Soon'}
                        </Typography>
                      </Box>
                      <Chip
                        label={isOverdue ? 'OVERDUE' : 'DUE SOON'}
                        color={isOverdue ? 'error' : 'warning'}
                        size="small"
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                      />
                    </Box>

                    {/* Nội dung Card & Board */}
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.4, color: 'text.primary' }}>
                      Card <strong>&quot;{notification.cardTitle}&quot;</strong> in board <strong>&quot;{notification.boardTitle}&quot;</strong>
                    </Typography>

                    {/* Thời hạn & CTA xem */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.3 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                        Due: {dayjs(notification.dueDate).format('ddd, MMM D [at] h:mm A')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        View card <ArrowForwardIosIcon sx={{ fontSize: 9 }} />
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                {index !== (notifications.length - 1) && <Divider />}
              </Box>
            )
          }

          // Trường hợp 2: Lời mời tham gia Board (Board Invitation)
          return (
            <Box key={notification._id || index}>
              <MenuItem sx={{
                minWidth: 200,
                maxWidth: 380,
                overflowY: 'auto'
              }}>
                <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Nội dung của thông báo */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box><GroupAddIcon fontSize="small" /></Box>
                    <Box><strong>{notification.inviter?.displayName}</strong> had invited you to join the <strong>{notification.board?.title}</strong></Box>
                  </Box>

                  {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                  {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING &&
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  }

                  {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                      <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                    }
                    {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                      <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                    }
                  </Box>

                  {/* Thời gian của thông báo */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="span" sx={{ fontSize: '13px' }}>
                      {dayjs(notification.createdAt).format('ddd, MMM D, YYYY h:mm A')}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              {index !== (notifications.length - 1) && <Divider />}
            </Box>
          )
        })}
      </Menu>
    </Box>
  )
}

export default Notifications
