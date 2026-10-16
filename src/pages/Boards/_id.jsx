// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/Boardbar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

function Board() {
  // không dùng state của component mà chuyển sang sang dùng state của redux
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    // call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // function này có nhiệm vụ gọi API và xử lí khi kéo thả column xong xuôi, chỉ cần gọi API để cập nhật mảng columnOrderIds của board chứa nó
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    /**
     * Trường hợp dùng spread oprerator (copy nông) thì không sao vì không dùng push() thay đổi trực
     * tiếp trên mảng mà chỉ gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }
  // khi di chuyển card trong cùng 1 column chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu State Board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })

  }
  /**
   * khi di chuyển card sang column khác:
   * b1: cập nhật mảng cardOrderIds của column ban đầu chứa nó (xóa cái _id của card ra khỏi mảng)
   * b2: cập nhật mảng cardOrderIds của column tiếp theo (thêm _id của card vào mảng)
   * b3: cập nhật lại trường columnId mới của cái card đã kéo
   * => làm 1 API support riêng
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // gọi API xử lý phía BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // xóa card cuối cùng không gửi lên cho BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check open or close based on State IsShowModalActiveCard in redux */}
      <ActiveCard />
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // remain 3 functions below to easy maintain
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board