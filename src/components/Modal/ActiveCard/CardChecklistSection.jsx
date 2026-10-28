import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LinkIcon from '@mui/icons-material/Link'
import CloseIcon from '@mui/icons-material/Close'

function CardChecklistSection({ checklists = [], onUpdateCardChecklists }) {
  const [activeChecklistIdForNewItem, setActiveChecklistIdForNewItem] = useState(null)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemLink, setNewItemLink] = useState('')

  const [editingItemId, setEditingItemId] = useState(null)
  const [editingItemTitle, setEditingItemTitle] = useState('')
  const [editingItemLink, setEditingItemLink] = useState('')

  if (!checklists || checklists.length === 0) return null

  const getValidUrl = (url) => {
    if (!url) return null
    const trimmed = url.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('/')) return trimmed
    return `https://${trimmed}`
  }

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
    setNewItemLink('')
    setEditingItemId(null)
  }

  // Hủy nhập item mới
  const handleCancelAddItem = () => {
    setActiveChecklistIdForNewItem(null)
    setNewItemTitle('')
    setNewItemLink('')
  }

  // Thêm item mới vào checklist
  const handleSaveNewItem = (checklistId) => {
    const trimmedTitle = newItemTitle.trim()
    if (!trimmedTitle) return

    const trimmedLink = newItemLink.trim()
    const newItem = {
      _id: Date.now().toString(),
      title: trimmedTitle,
      link: trimmedLink || null,
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
    setNewItemLink('')
  }

  // Bắt đầu sửa 1 item đã có
  const handleStartEditItem = (item) => {
    setEditingItemId(item._id)
    setEditingItemTitle(item.title || '')
    setEditingItemLink(item.link || '')
    setActiveChecklistIdForNewItem(null)
  }

  // Hủy sửa item
  const handleCancelEditItem = () => {
    setEditingItemId(null)
    setEditingItemTitle('')
    setEditingItemLink('')
  }

  // Lưu chỉnh sửa item
  const handleSaveEditItem = (checklistId, itemId) => {
    const trimmedTitle = editingItemTitle.trim()
    if (!trimmedTitle) return

    const trimmedLink = editingItemLink.trim()

    const updated = checklists.map(cl => {
      if (cl._id !== checklistId) return cl
      return {
        ...cl,
        items: (cl.items || []).map(item => {
          if (item._id !== itemId) return item
          return {
            ...item,
            title: trimmedTitle,
            link: trimmedLink || null
          }
        })
      }
    })

    onUpdateCardChecklists(updated)
    handleCancelEditItem()
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
              {checklist.items?.map((item) => {
                const isEditingThisItem = editingItemId === item._id
                const validUrl = getValidUrl(item.link)

                if (isEditingThisItem) {
                  return (
                    <Box
                      key={item._id}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        my: 0.5
                      }}
                    >
                      <TextField
                        fullWidth
                        autoFocus
                        size="small"
                        placeholder="Task title..."
                        value={editingItemTitle}
                        onChange={(e) => setEditingItemTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSaveEditItem(checklist._id, item._id)
                          }
                          if (e.key === 'Escape') {
                            handleCancelEditItem()
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Attach link or URL (optional, e.g. https://...)"
                        value={editingItemLink}
                        onChange={(e) => setEditingItemLink(e.target.value)}
                        InputProps={{
                          startAdornment: <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSaveEditItem(checklist._id, item._id)
                          }
                          if (e.key === 'Escape') {
                            handleCancelEditItem()
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveEditItem(checklist._id, item._id)}
                          disabled={!editingItemTitle.trim()}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          color="inherit"
                          onClick={handleCancelEditItem}
                          sx={{ textTransform: 'none' }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )
                }

                return (
                  <Box
                    key={item._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.4,
                      px: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        '& .action-item-btn': { opacity: 1 }
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexGrow: 1,
                        minWidth: 0,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleToggleItem(checklist._id, item._id)}
                    >
                      <Checkbox
                        checked={Boolean(item.isDone)}
                        size="small"
                        sx={{ p: 0.5 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleItem(checklist._id, item._id)
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: item.isDone ? 'line-through' : 'none',
                            color: item.isDone ? 'text.secondary' : 'text.primary',
                            fontWeight: item.isDone ? 400 : 500,
                            wordBreak: 'break-word'
                          }}
                        >
                          {item.title}
                        </Typography>

                        {/* Gắn link nếu item có link */}
                        {validUrl && (
                          <Tooltip title={`Open: ${validUrl}`}>
                            <Chip
                              size="small"
                              icon={<OpenInNewIcon sx={{ fontSize: '13px !important' }} />}
                              label="Link"
                              clickable
                              color="primary"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(validUrl, '_blank', 'noopener,noreferrer')
                              }}
                              sx={{
                                height: 22,
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white'
                                }
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                    {/* Các nút Sửa và Xóa khi hover */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title="Edit item">
                        <IconButton
                          className="action-item-btn"
                          size="small"
                          onClick={() => handleStartEditItem(item)}
                          sx={{
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete item">
                        <IconButton
                          className="action-item-btn"
                          size="small"
                          onClick={() => handleDeleteItem(checklist._id, item._id)}
                          sx={{
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main' }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )
              })}
            </Stack>

            {/* Thêm mục mới vào checklist */}
            <Box sx={{ pl: 4.5, mt: 1 }}>
              {isAddingItem ? (
                <Box sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <TextField
                    fullWidth
                    autoFocus
                    size="small"
                    placeholder="Add an item title..."
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
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Attach link or URL (optional, e.g. https://...)"
                    value={newItemLink}
                    onChange={(e) => setNewItemLink(e.target.value)}
                    InputProps={{
                      startAdornment: <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSaveNewItem(checklist._id)
                      }
                      if (e.key === 'Escape') {
                        handleCancelAddItem()
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
