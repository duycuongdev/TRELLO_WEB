import { socketIoInstance } from '~/socketClient'

export const BOARD_ACTION_TYPES = {
  MOVE_COLUMN: 'MOVE_COLUMN',
  MOVE_CARD_SAME_COLUMN: 'MOVE_CARD_SAME_COLUMN',
  MOVE_CARD_DIFF_COLUMN: 'MOVE_CARD_DIFF_COLUMN',
  CREATE_COLUMN: 'CREATE_COLUMN',
  UPDATE_COLUMN: 'UPDATE_COLUMN',
  DELETE_COLUMN: 'DELETE_COLUMN',
  ARCHIVE_COLUMN: 'ARCHIVE_COLUMN',
  CREATE_CARD: 'CREATE_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  ARCHIVE_CARD: 'ARCHIVE_CARD',
  RESTORE_CARD: 'RESTORE_CARD',
  UPDATE_BOARD: 'UPDATE_BOARD'
}

/**
 * Phát sự kiện thay đổi dữ liệu bảng tới các thành viên khác đang cùng xem bảng
 */
export const emitBoardUpdate = ({ boardId, actionType, payload, currentUser }) => {
  if (!boardId) return

  socketIoInstance.emit('FE_BOARD_UPDATED', {
    boardId,
    actionType,
    payload,
    senderId: currentUser?._id,
    senderName: currentUser?.displayName || currentUser?.email
  })
}

/**
 * Đăng ký tham gia phòng Socket của Board
 */
export const joinBoardRoom = (boardId, currentUser) => {
  if (!boardId) return

  socketIoInstance.emit('FE_USER_JOIN_BOARD_ROOM', {
    boardId,
    user: currentUser ? {
      _id: currentUser._id,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      email: currentUser.email
    } : null
  })
}

/**
 * Rời khỏi phòng Socket của Board
 */
export const leaveBoardRoom = (boardId) => {
  if (!boardId) return
  socketIoInstance.emit('FE_USER_LEAVE_BOARD_ROOM', { boardId })
}
