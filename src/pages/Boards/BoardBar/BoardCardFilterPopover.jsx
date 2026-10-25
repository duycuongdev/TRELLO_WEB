import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  selectCardFilter,
  setCardFilter,
  clearCardFilter
} from '~/redux/activeBoard/activeBoardSlice'

function BoardCardFilterPopover({ anchorEl, isOpen, onClose, board }) {
  const dispatch = useDispatch()
  const cardFilter = useSelector(selectCardFilter)

  // Tổng hợp tất cả các nhãn thực tế do người dùng tạo và gán vào các thẻ trên board (không dùng mockdata)
  const availableLabels = useMemo(() => {
    const labelMap = new Map()

    board?.columns?.forEach(column => {
      column.cards?.forEach(card => {
        if (!card?.FE_PlaceholderCard && Array.isArray(card.labels)) {
          card.labels.forEach(label => {
            if (label && label.color) {
              const title = (label.title || '').trim()
              const id = `${label.color}___${title}`
              if (!labelMap.has(id)) {
                labelMap.set(id, {
                  id,
                  color: label.color,
                  title
                })
              }
            }
          })
        }
      })
    })

    return Array.from(labelMap.values())
  }, [board])

  // Đếm số lượng thẻ đang hiển thị / tổng số thẻ
  const { totalCards, matchedCards } = useMemo(() => {
    let total = 0
    let matched = 0
    const search = cardFilter?.search?.trim().toLowerCase()
    const filterLabelIds = cardFilter?.labelIds || []

    board?.columns?.forEach(column => {
      column.cards?.forEach(card => {
        if (!card?.FE_PlaceholderCard) {
          total++
          let isMatch = true
          if (search) {
            const matchTitle = card.title?.toLowerCase().includes(search)
            const matchDesc = card.description?.toLowerCase().includes(search)
            if (!matchTitle && !matchDesc) isMatch = false
          }
          if (filterLabelIds.length > 0) {
            const cardLabelKeys = (card.labels || []).map(l => `${l.color}___${(l.title || '').trim()}`)
            if (!filterLabelIds.some(id => cardLabelKeys.includes(id))) {
              isMatch = false
            }
          }
          if (isMatch) matched++
        }
      })
    })
    return { totalCards: total, matchedCards: matched }
  }, [board, cardFilter])

  const hasActiveFilter = Boolean(cardFilter?.search || cardFilter?.labelIds?.length > 0)

  const handleToggleLabel = (labelId) => {
    const currentLabelIds = cardFilter.labelIds || []
    const newLabelIds = currentLabelIds.includes(labelId)
      ? currentLabelIds.filter(id => id !== labelId)
      : [...currentLabelIds, labelId]
    dispatch(setCardFilter({ labelIds: newLabelIds }))
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            maxWidth: 'calc(100vw - 32px)',
            p: 2,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon fontSize="small" color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            Filter Cards
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {hasActiveFilter && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
          Showing <strong>{matchedCards}</strong> of <strong>{totalCards}</strong> cards
        </Typography>
      )}

      {/* Tìm kiếm theo từ khóa */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
          KEYWORD
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search card title or description..."
          value={cardFilter.search || ''}
          onChange={(e) => dispatch(setCardFilter({ search: e.target.value }))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: cardFilter.search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => dispatch(setCardFilter({ search: '' }))}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Lọc theo Nhãn (Labels) do người dùng tạo */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
          LABELS
        </Typography>

        {availableLabels.length === 0 ? (
          <Box sx={{
            py: 2,
            px: 1.5,
            textAlign: 'center',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f4f5f7'),
            borderRadius: 1.5,
            border: '1px dashed',
            borderColor: 'divider'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.85rem' }}>
              Chưa có nhãn nào trên bảng
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
              Hãy mở thẻ và tạo nhãn để lọc
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0.75} sx={{ maxHeight: 220, overflowY: 'auto', pr: 0.5 }}>
            {availableLabels.map((label) => {
              const isSelected = cardFilter.labelIds?.includes(label.id)
              return (
                <Box
                  key={label.id}
                  onClick={() => handleToggleLabel(label.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 1.5,
                    bgcolor: label.color,
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    boxShadow: isSelected ? '0 0 0 2.5px #1976d2' : 'none',
                    opacity: isSelected ? 1 : 0.85,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      opacity: 1,
                      transform: 'translateX(2px)'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                    {label.title || '(Không có tiêu đề)'}
                  </Typography>
                  {isSelected && <CheckIcon fontSize="small" sx={{ color: 'white' }} />}
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Nút Clear Filter */}
      <Button
        fullWidth
        size="small"
        variant="outlined"
        color="inherit"
        disabled={!hasActiveFilter}
        onClick={() => dispatch(clearCardFilter())}
        sx={{
          textTransform: 'none',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        Clear all filters
      </Button>
    </Popover>
  )
}

export default BoardCardFilterPopover
