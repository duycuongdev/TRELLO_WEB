// Board Details
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/Boardbar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  reopenBoardAPI,
  deleteBoardDetailsAPI
} from '~/apis'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined'
import UndoIcon from '@mui/icons-material/Undo'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function Board() {
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)
  const boardLoading = useSelector(state => state.activeBoard.isLoading)
  const boardError = useSelector(state => state.activeBoard.error)

  const { boardId } = useParams()

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
      .catch(() => {
        dispatch(updateCurrentActiveBoard(board))
      })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
      .catch(() => {
        dispatch(updateCurrentActiveBoard(board))
      })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds || []
    if (prevCardOrderIds[0]?.includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds || []
    }).catch(() => {
      dispatch(updateCurrentActiveBoard(board))
    })
  }

  if (boardLoading || (!board && !boardError)) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  if (boardError) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 3 }}>
        <Typography color="error">Unable to load this board.</Typography>
        <Button variant="contained" onClick={() => dispatch(fetchBoardDetailsAPI(boardId))}>Retry</Button>
      </Box>
    )
  }

  // Màn hình khi Bảng đã bị đóng (Closed Board)
  if (board?._destroy) {
    const isOwner = (board?.ownerIds || []).some(id => id.toString() === currentUser?._id?.toString())

    const handleReopen = async () => {
      try {
        await reopenBoardAPI(boardId)
        toast.success('Board reopened!')
        dispatch(fetchBoardDetailsAPI(boardId))
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to reopen board')
      }
    }

    const handleDeletePermanently = () => {
      confirm({
        title: 'Delete Board Permanently?',
        description: `Are you sure you want to permanently delete "${board.title}"? All lists, cards, and invitations will be permanently removed. This action cannot be undone.`,
        confirmationText: 'Delete permanently',
        cancellationText: 'Cancel'
      }).then(async () => {
        try {
          await deleteBoardDetailsAPI(boardId)
          toast.success('Board permanently deleted!')
          navigate('/boards')
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Failed to delete board')
        }
      }).catch(() => {})
    }

    return (
      <Container disableGutters maxWidth={false} sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar />
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center'
        }}>
          <FolderOffOutlinedIcon sx={{ fontSize: 72, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {board.title} is closed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 3 }}>
            This board is closed. Reopen the board to make changes, or permanently delete it.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {isOwner ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<UndoIcon />}
                  onClick={handleReopen}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Reopen board
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleDeletePermanently}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Permanently delete board
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                component={Link}
                to="/boards"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Go to my boards
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: board?.background?.startsWith('http')
          ? `url("${board.background}") center/cover no-repeat fixed`
          : (board?.background || ((theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'))),
        transition: 'background 0.3s ease'
      }}
    >
      <ActiveCard />
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
