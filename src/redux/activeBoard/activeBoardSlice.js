import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentActiveBoard: null,
  isLoading: false,
  error: null
}

// Gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const reponse = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return reponse.data
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducer là nơi để xử lý dữ liệu đồng bộ
  reducers: {
    // luôn cần cặp ngoặc {} trong reducer dù code bên trong có 1 dòng vì đầy là rule của redux
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán cho nó 1 biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu cần thiết

      // update lại dữ liệu currentActiveBoard
      state.currentActiveBoard = board
    },
    removeCardFromBoard: (state, action) => {
      const cardId = action.payload
      state.currentActiveBoard?.columns.forEach(column => {
        column.cards = column.cards.filter(card => card._id !== cardId)
        column.cardOrderIds = column.cardOrderIds.filter(id => id !== cardId)
      })
    },
    removeMemberFromBoard: (state, action) => {
      const memberId = action.payload?.toString()
      if (!state.currentActiveBoard || !memberId) return

      state.currentActiveBoard.memberIds = (state.currentActiveBoard.memberIds || [])
        .filter(id => id.toString() !== memberId)
      state.currentActiveBoard.members = (state.currentActiveBoard.members || [])
        .filter(member => member._id?.toString() !== memberId)
      state.currentActiveBoard.FE_allUsers = (state.currentActiveBoard.FE_allUsers || [])
        .filter(user => user._id?.toString() !== memberId)
    },
    updateCardInBoard: (state, action) => {
      // update nested data
      const incomingCard = action.payload

      // find board -> column -> card
      const column = state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.currentActiveBoard = null
    })
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      // action.payload là reponse.data trả về từ api
      let board = action.payload

      // user include ownerIds and members
      board.FE_allUsers = board.owners.concat(board.members)

      // xử lý dữ liệu cần thiết
      // sắp xếp column xong đưa xuống component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // xử lý kéo thả khi column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sắp xếp cards xong đưa xuống component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // update lại dữ liệu currentActiveBoard
      state.currentActiveBoard = board
    })
    builder.addCase(fetchBoardDetailsAPI.rejected, (state, action) => {
      state.isLoading = false
      state.currentActiveBoard = null
      state.error = action.error?.message || 'Unable to load board.'
    })
  }
})

// Action là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đồng bộ)
// Ở trên không có properties action vì những cái action này sẽ được redux tạo tự động theo tên của reducer
export const {
  updateCurrentActiveBoard,
  updateCardInBoard,
  removeCardFromBoard,
  removeMemberFromBoard
} = activeBoardSlice.actions

// selectors: các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// file này tên là activeBoardSlice nhưng export 1 thứ tên là reducer
export const activeBoardReducer = activeBoardSlice.reducer