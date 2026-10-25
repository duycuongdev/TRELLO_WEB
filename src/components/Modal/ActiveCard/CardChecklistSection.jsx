import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CloseIcon from '@mui/icons-material/Close'

function CardChecklistSection({ checklists = [], onUpdateCardChecklists }) {
  const [activeChecklistIdForNewItem, setActiveChecklistIdForNewItem] = useState(null)
  const [newItemTitle, setNewItemTitle] = useState('')

  if (!checklists || checklists.length === 0) return null

  // Xóa toàn bộ 1 checklist
  const handleDeleteChecklist = (checklistId) => {
    const updated = checklists.filter(c => c._id !== checklistId)
    onUpdateCardChecklists(updated)
  }

  // Tích chọn hoặc bỏ chọn 1 item trong checklist
  const handleToggleItem = (checklistId, itemId) => {
    const updated = checklists.map(cl => {
      if (cl._id !== checklistId) return cl
      return {
        ...cl,
        items: cl.items.map(item => {
          if (item._id !== itemId) return item
          return { ...item, isDone: !item.isDone }
        })
      }
    })
    onUpdateCardChecklists(updated)
  }

  // Xóa 1 item trong checklist
  const handleDeleteItem = (checklistId, itemId) => {
    const updated = checklists.map(cl => {
      if (cl._id !== checklistId) return cl
      return {
        ...cl,
        items: cl.items.filter(item => item._id !== itemId)
      }
    })
    onUpdateCardChecklists(updated)
  }

  // Bắt đầu nhập item mới
  const handleStartAddItem = (checklistId) => {
    setActiveChecklistIdForNewItem(checklistId)
    setNewItemTitle('')
  }

  // Hủy nhập item mới
  const handleCancelAddItem = () => {
    setActiveChecklistIdForNewItem(null)
    setNewItemTitle('')
  }

  // Thêm item mới vào checklist
  const handleSaveNewItem = (checklistId) => {
    const trimmed = newItemTitle.trim()
    if (!trimmed) return

    const newItem = {
      _id: Date.now().toString(),
      title: trimmed,
      isDone: false
    }

    const updated = checklists.map(cl => {
      if (cl._id !== checklistId) return cl
      return {
        ...cl,
        items: [...(cl.items || []), newItem]
      }
    })

    onUpdateCardChecklists(updated)
    setNewItemTitle('')
  }

  return (
    <Stack spacing={3} sx={{ mb: 3 }}>
      {checklists.map((checklist) => {
        const totalItems = checklist.items?.length || 0
        const completedItems = checklist.items?.filter(i => i.isDone).length || 0
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100)
        const isComplete = totalItems > 0 && completedItems === totalItems
        const isAddingItem = activeChecklistIdForNewItem === checklist._id

        return (
          <Box key={checklist._id}>
            {/* Header Checklist */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TaskAltOutlinedIcon sx={{ color: '#16a34a' }} />
                <Typography sx={{ fontWeight: '600', fontSize: '18px' }}>
                  {checklist.title}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => handleDeleteChecklist(checklist._id)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover', color: 'error.main', borderColor: 'error.light' }
                }}
              >
                Delete
              </Button>
            </Box>

            {/* Thanh tiến độ Progress Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, pl: 4 }}>
              <Typography variant="caption" sx={{ minWidth: 32, fontWeight: 700, color: isComplete ? 'success.main' : 'text.secondary' }}>
                {percentage}%
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  color={isComplete ? 'success' : 'primary'}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      transition: 'transform 0.3s ease'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Danh sách các item trong checklist */}
            <Stack spacing={0.5} sx={{ pl: 3.5, mb: 1 }}>
              {checklist.items?.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.25,
                    px: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      '& .delete-item-btn': { opacity: 1 }
                    }
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => handleToggleItem(checklist._id, item._id)}
                  >
                    <Checkbox
                      checked={Boolean(item.isDone)}
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: item.isDone ? 'line-through' : 'none',
                        color: item.isDone ? 'text.secondary' : 'text.primary',
                        fontWeight: item.isDone ? 400 : 500
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  <IconButton
                    className="delete-item-btn"
                    size="small"
                    onClick={() => handleDeleteItem(checklist._id, item._id)}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main' }
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            {/* Thêm mục mới vào checklist */}
            <Box sx={{ pl: 4.5, mt: 1 }}>
              {isAddingItem ? (
                <Box>
                  <TextField
                    fullWidth
                    autoFocus
                    size="small"
                    placeholder="Add an item..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSaveNewItem(checklist._id)
                      }
                      if (e.key === 'Escape') {
                        handleCancelAddItem()
                      }
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveNewItem(checklist._id)}
                      disabled={!newItemTitle.trim()}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Add
                    </Button>
                    <IconButton size="small" onClick={handleCancelAddItem}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={() => handleStartAddItem(checklist._id)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.825rem',
                    borderColor: 'divider',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f4f5f7',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  + Add an item
                </Button>
              )}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export default CardChecklistSection

