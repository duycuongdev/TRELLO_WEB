import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CheckIcon from '@mui/icons-material/Check'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const LABEL_PALETTE = [
  '#2e7d32', // Green
  '#ed6c02', // Orange
  '#d32f2f', // Red
  '#9c27b0', // Purple
  '#0288d1', // Blue
  '#00897b', // Teal
  '#e91e63', // Pink
  '#ffb300', // Amber
  '#3f51b5', // Indigo
  '#546e7a' // Slate
]

const DEFAULT_PRESET_LABELS = [
  { color: '#2e7d32', title: 'Feature' },
  { color: '#d32f2f', title: 'Bug' },
  { color: '#ed6c02', title: 'Urgent' },
  { color: '#0288d1', title: 'Enhancement' },
  { color: '#9c27b0', title: 'Design' },
  { color: '#00897b', title: 'Documentation' }
]

function CardLabelPopover({ anchorEl, isOpen, onClose, activeCardLabels = [], onUpdateCardLabels }) {
  const [availableLabels, setAvailableLabels] = useState(() => {
    // Kết hợp preset với các label hiện có của card nếu có nhãn tự tạo
    const map = new Map()
    DEFAULT_PRESET_LABELS.forEach(l => map.set(`${l.color}-${l.title}`, l))
    activeCardLabels.forEach(l => map.set(`${l.color}-${l.title}`, l))
    return Array.from(map.values())
  })

  const [view, setView] = useState('list') // 'list' | 'create' | 'edit'
  const [editingTarget, setEditingTarget] = useState(null)
  const [inputTitle, setInputTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState(LABEL_PALETTE[0])

  const handleClose = () => {
    setView('list')
    setEditingTarget(null)
    setInputTitle('')
    onClose()
  }

  const handleToggleCardLabel = (label) => {
    const isExisted = activeCardLabels.some(l => l.color === label.color && l.title === label.title)
    let newLabels = []
    if (isExisted) {
      newLabels = activeCardLabels.filter(l => !(l.color === label.color && l.title === label.title))
    } else {
      newLabels = [...activeCardLabels, label]
    }
    onUpdateCardLabels(newLabels)
  }

  const handleOpenCreateView = () => {
    setInputTitle('')
    setSelectedColor(LABEL_PALETTE[0])
    setView('create')
  }

  const handleOpenEditView = (label, e) => {
    e.stopPropagation()
    setEditingTarget(label)
    setInputTitle(label.title || '')
    setSelectedColor(label.color)
    setView('edit')
  }

  const handleSaveCreate = () => {
    const newLabel = {
      title: inputTitle.trim(),
      color: selectedColor
    }
    setAvailableLabels(prev => [...prev, newLabel])
    // Tự động gán nhãn mới tạo vào card
    const newLabels = [...activeCardLabels, newLabel]
    onUpdateCardLabels(newLabels)
    setView('list')
  }

  const handleSaveEdit = () => {
    if (!editingTarget) return
    const updatedLabel = {
      title: inputTitle.trim(),
      color: selectedColor
    }

    // Cập nhật trong danh sách availableLabels
    setAvailableLabels(prev => prev.map(l =>
      (l.color === editingTarget.color && l.title === editingTarget.title) ? updatedLabel : l
    ))

    // Cập nhật lại trong card nếu card đang gắn nhãn này
    const isSelected = activeCardLabels.some(l => l.color === editingTarget.color && l.title === editingTarget.title)
    if (isSelected) {
      const newLabels = activeCardLabels.map(l =>
        (l.color === editingTarget.color && l.title === editingTarget.title) ? updatedLabel : l
      )
      onUpdateCardLabels(newLabels)
    }

    setView('list')
    setEditingTarget(null)
  }

  const handleDeleteLabel = () => {
    if (!editingTarget) return
    setAvailableLabels(prev => prev.filter(l =>
      !(l.color === editingTarget.color && l.title === editingTarget.title)
    ))

    // Gỡ nhãn khỏi card nếu đang gắn
    const newLabels = activeCardLabels.filter(l =>
      !(l.color === editingTarget.color && l.title === editingTarget.title)
    )
    onUpdateCardLabels(newLabels)

    setView('list')
    setEditingTarget(null)
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <Box sx={{ p: 2, width: { xs: 'min(300px, 88vw)', sm: '300px' }, maxWidth: '88vw' }}>
        {/* VIEW: LIST LABELS */}
        {view === 'list' && (
          <Box>
            <Typography sx={{ fontWeight: '600', mb: 1.5, textAlign: 'center', fontSize: '15px' }}>
              Labels
            </Typography>

            <Stack spacing={1} sx={{ maxHeight: '320px', overflowY: 'auto', pr: 0.5 }}>
              {availableLabels.map((label, idx) => {
                const isSelected = activeCardLabels.some(l => l.color === label.color && l.title === label.title)
                return (
                  <Box
                    key={`${label.color}-${label.title}-${idx}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box
                      onClick={() => handleToggleCardLabel(label)}
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: label.color,
                        color: '#fff',
                        px: 1.5,
                        py: 0.8,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                        transition: 'opacity 0.2s',
                        minHeight: '34px',
                        '&:hover': { opacity: 0.88 }
                      }}
                    >
                      <Typography variant="span" sx={{ fontWeight: 600, fontSize: '13px' }}>
                        {label.title || '\u00A0'}
                      </Typography>
                      {isSelected && <CheckIcon fontSize="small" />}
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenEditView(label, e)}
                      sx={{ p: 0.5 }}
                      title="Edit label"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )
              })}
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={handleOpenCreateView}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              + Create a new label
            </Button>
          </Box>
        )}

        {/* VIEW: CREATE OR EDIT LABEL */}
        {(view === 'create' || view === 'edit') && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, position: 'relative' }}>
              <IconButton size="small" onClick={() => setView('list')} sx={{ p: 0.5 }}>
                <ArrowBackIosNewIcon sx={{ fontSize: '14px' }} />
              </IconButton>
              <Typography sx={{ fontWeight: '600', flexGrow: 1, textAlign: 'center', fontSize: '15px' }}>
                {view === 'create' ? 'Create Label' : 'Edit Label'}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Title
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="e.g. Urgent, Bug, Review..."
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              sx={{ mb: 2 }}
              autoFocus
            />

            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
              Select a color
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mb: 2.5 }}>
              {LABEL_PALETTE.map((color) => {
                const isCurrent = selectedColor === color
                return (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      height: '32px',
                      borderRadius: '4px',
                      bgcolor: color,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      outline: isCurrent ? '2px solid' : 'none',
                      outlineColor: 'primary.main',
                      outlineOffset: '2px',
                      '&:hover': { opacity: 0.85 }
                    }}
                  >
                    {isCurrent && <CheckIcon sx={{ fontSize: '18px' }} />}
                  </Box>
                )
              })}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={view === 'create' ? handleSaveCreate : handleSaveEdit}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Save
              </Button>

              {view === 'edit' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDeleteLabel}
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Popover>
  )
}

export default CardLabelPopover
