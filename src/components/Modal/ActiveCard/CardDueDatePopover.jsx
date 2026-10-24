import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import dayjs from 'dayjs'

function CardDueDatePopover({ anchorEl, isOpen, onClose, dueDate, isDueDateComplete = false, onUpdateDueDate }) {
  const [selectedDateTime, setSelectedDateTime] = useState(() => {
    if (dueDate) return dayjs(dueDate).format('YYYY-MM-DDTHH:mm')
    return dayjs().add(1, 'day').hour(17).minute(0).format('YYYY-MM-DDTHH:mm')
  })
  const [isComplete, setIsComplete] = useState(isDueDateComplete)

  useEffect(() => {
    if (isOpen) {
      if (dueDate) {
        setSelectedDateTime(dayjs(dueDate).format('YYYY-MM-DDTHH:mm'))
      } else {
        setSelectedDateTime(dayjs().add(1, 'day').hour(17).minute(0).format('YYYY-MM-DDTHH:mm'))
      }
      setIsComplete(Boolean(isDueDateComplete))
    }
  }, [isOpen, dueDate, isDueDateComplete])

  const handleSave = () => {
    if (!selectedDateTime) return
    const timestamp = dayjs(selectedDateTime).valueOf()
    onUpdateDueDate({
      dueDate: timestamp,
      isDueDateComplete: isComplete
    })
    onClose()
  }

  const handleRemove = () => {
    onUpdateDueDate({
      dueDate: null,
      isDueDateComplete: false
    })
    onClose()
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
            p: 2,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WatchLaterOutlinedIcon fontSize="small" color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            Dates
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
        DUE DATE & TIME
      </Typography>
      <TextField
        fullWidth
        size="small"
        type="datetime-local"
        value={selectedDateTime}
        onChange={(e) => setSelectedDateTime(e.target.value)}
        sx={{ mb: 1.5 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isComplete}
            onChange={(e) => setIsComplete(e.target.checked)}
          />
        }
        label={<Typography variant="body2" fontWeight={500}>Mark as completed</Typography>}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSave}
          disabled={!selectedDateTime}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Save
        </Button>
        {dueDate && (
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleRemove}
            sx={{
              textTransform: 'none',
              borderColor: 'divider',
              '&:hover': { color: 'error.main', borderColor: 'error.light' }
            }}
          >
            Remove
          </Button>
        )}
      </Box>
    </Popover>
  )
}

export default CardDueDatePopover

