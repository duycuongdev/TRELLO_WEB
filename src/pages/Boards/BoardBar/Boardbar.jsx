import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import FilterIcon from '@mui/icons-material/FilterList'
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined'
import Tooltip from '@mui/material/Tooltip'
import { capitalizeFirstLetter } from '~/utils/formatter'
import { selectCardFilter, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateBoardDetailsAPI, closeBoardAPI } from '~/apis'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardCardFilterPopover from './BoardCardFilterPopover'
import ChangeBoardBackgroundPopover from './ChangeBoardBackgroundPopover'
import ArchivedItemsDrawer from './ArchivedItemsDrawer'

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
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isOwner = (board?.ownerIds || []).some(id => id.toString() === currentUser?._id?.toString())

  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const isFilterOpen = Boolean(filterAnchorEl)

  const [bgAnchorEl, setBgAnchorEl] = useState(null)
  const isBgOpen = Boolean(bgAnchorEl)
  const [isArchivedOpen, setIsArchivedOpen] = useState(false)

  const handleCloseBoard = () => {
    confirm({
      title: 'Close Board?',
      description: 'You can find and reopen closed boards at the bottom of your boards page.',
      confirmationText: 'Close',
      cancellationText: 'Cancel'
    }).then(async () => {
      try {
        await closeBoardAPI(board._id)
        toast.success('Board closed!')
        navigate('/boards')
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to close board')
      }
    }).catch(() => {})
  }

  const cardFilter = useSelector(selectCardFilter)

  const activeFilterCount = (cardFilter?.search ? 1 : 0) + (cardFilter?.labelIds?.length || 0)
  const hasActiveFilter = activeFilterCount > 0

  const handleOpenFilter = (e) => setFilterAnchorEl(e.currentTarget)
  const handleCloseFilter = () => setFilterAnchorEl(null)

  const handleOpenBgPopover = (e) => setBgAnchorEl(e.currentTarget)
  const handleCloseBgPopover = () => setBgAnchorEl(null)

  const handleSelectBackground = (newBackground) => {
    // Cập nhật Redux ngay lập tức để giao diện mượt mà không có độ trễ
    dispatch(updateCurrentActiveBoard({ ...board, background: newBackground }))

    updateBoardDetailsAPI(board._id, { background: newBackground })
      .then(() => {
        toast.success('Board background updated!')
      })
      .catch(() => {
        dispatch(updateCurrentActiveBoard(board))
        toast.error('Failed to update board background!')
      })
  }

  const handleUploadBackgroundFile = (file) => {
    const formData = new FormData()
    formData.append('boardBackground', file)

    toast.promise(
      updateBoardDetailsAPI(board._id, formData).then((updatedBoard) => {
        dispatch(updateCurrentActiveBoard({ ...board, ...updatedBoard, columns: board.columns, FE_allUsers: board.FE_allUsers }))
      }),
      {
        pending: 'Uploading background image to Cloudinary...',
        success: 'Board background updated!',
        error: 'Failed to upload background image!'
      }
    )
  }

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
      bgcolor: board?.background
        ? 'rgba(0, 0, 0, 0.25)'
        : (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      backdropFilter: board?.background ? 'blur(6px)' : 'none',
      borderBottom: board?.background ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
      transition: 'background 0.3s ease',
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

        {/* Nút Thay đổi Hình nền / Màu nền cho Bảng */}
        <Chip
          sx={{
            ...MENU_STYLES,
            ...(board?.background && {
              bgcolor: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              fontWeight: 600
            })
          }}
          icon={<WallpaperOutlinedIcon />}
          label='Background'
          clickable
          onClick={handleOpenBgPopover}
        />

        <ChangeBoardBackgroundPopover
          anchorEl={bgAnchorEl}
          isOpen={isBgOpen}
          onClose={handleCloseBgPopover}
          currentBackground={board?.background}
          onSelectBackground={handleSelectBackground}
          onUploadBackgroundFile={handleUploadBackgroundFile}
        />

        {/* Nút Mở Danh sách Lưu trữ (Archived Items) */}
        <Chip
          sx={MENU_STYLES}
          icon={<ArchiveOutlinedIcon />}
          label='Archived'
          clickable
          onClick={() => setIsArchivedOpen(true)}
        />

        <ArchivedItemsDrawer
          isOpen={isArchivedOpen}
          onClose={() => setIsArchivedOpen(false)}
          boardId={board?._id}
        />

        {/* Nút Đóng Bảng (Chỉ dành cho Owner) */}
        {isOwner && (
          <Chip
            sx={{
              ...MENU_STYLES,
              '&:hover': {
                bgcolor: 'error.main'
              }
            }}
            icon={<FolderOffOutlinedIcon />}
            label='Close board'
            clickable
            onClick={handleCloseBoard}
          />
        )}
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
