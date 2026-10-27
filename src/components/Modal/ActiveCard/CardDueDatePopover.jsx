import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import dayjs from 'dayjs'

const HOURS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const DEFAULT_MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

const REMINDER_OPTIONS = [
  { value: -1, label: 'None' },
  { value: 0, label: 'At time of due date' },
  { value: 10, label: '10 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 2880, label: '2 days before' }
]

const parseDueDateTo12h = (timestamp) => {
  if (timestamp) {
    const d = dayjs(timestamp)
    const h24 = d.hour()
    return {
      date: d.format('YYYY-MM-DD'),
      hour: h24 % 12 === 0 ? 12 : h24 % 12,
      minute: d.format('mm'),
      ampm: h24 >= 12 ? 'PM' : 'AM'
    }
  }
  const tomorrow = dayjs().add(1, 'day')
  return {
    date: tomorrow.format('YYYY-MM-DD'),
    hour: 5,
    minute: '00',
    ampm: 'PM'
  }
}

function CardDueDatePopover({
  anchorEl,
  isOpen,
  onClose,
  dueDate,
  isDueDateComplete = false,
  reminderMinutes = 1440,
  onUpdateDueDate
}) {
  const [dateStr, setDateStr] = useState(() => parseDueDateTo12h(dueDate).date)
  const [hour12, setHour12] = useState(() => parseDueDateTo12h(dueDate).hour)
  const [minuteStr, setMinuteStr] = useState(() => parseDueDateTo12h(dueDate).minute)
  const [ampm, setAmpm] = useState(() => parseDueDateTo12h(dueDate).ampm)
  const [isComplete, setIsComplete] = useState(isDueDateComplete)
  const [reminder, setReminder] = useState(() => (reminderMinutes === null ? -1 : (reminderMinutes ?? 1440)))

  useEffect(() => {
    if (isOpen) {
      const initial = parseDueDateTo12h(dueDate)
      setDateStr(initial.date)
      setHour12(initial.hour)
      setMinuteStr(initial.minute)
      setAmpm(initial.ampm)
      setIsComplete(Boolean(isDueDateComplete))
      setReminder(reminderMinutes === null ? -1 : (reminderMinutes ?? 1440))
    }
  }, [isOpen, dueDate, isDueDateComplete, reminderMinutes])

  // Danh sách các phút, đảm bảo giá trị hiện tại luôn có trong danh sách
  const minuteOptions = DEFAULT_MINUTES.includes(minuteStr)
    ? DEFAULT_MINUTES
    : [...DEFAULT_MINUTES, minuteStr].sort()

  const handleSave = () => {
    if (!dateStr) return

    let h24 = Number(hour12)
    if (ampm === 'PM' && h24 < 12) h24 += 12
    if (ampm === 'AM' && h24 === 12) h24 = 0

    const finalDateTime = dayjs(dateStr).hour(h24).minute(Number(minuteStr)).second(0)

    onUpdateDueDate({
      dueDate: finalDateTime.valueOf(),
      isDueDateComplete: isComplete,
      reminderMinutes: reminder === -1 ? null : reminder
    })
    onClose()
  }

  const handleRemove = () => {
    onUpdateDueDate({
      dueDate: null,
      isDueDateComplete: false,
      reminderMinutes: 1440
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
            width: { xs: 'min(330px, 88vw)', sm: 330 },
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

      {/* Chọn Ngày */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
          DUE DATE
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
      </Box>

      {/* Chọn Giờ: 1 đến 12 và AM/PM */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
          DUE TIME
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Giờ từ 1 đến 12 */}
          <Select
            size="small"
            value={hour12}
            onChange={(e) => setHour12(Number(e.target.value))}
            sx={{ flex: 1 }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          >
            {HOURS_12.map((h) => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))}
          </Select>

          <Typography fontWeight={700}>:</Typography>

          {/* Phút */}
          <Select
            size="small"
            value={minuteStr}
            onChange={(e) => setMinuteStr(e.target.value)}
            sx={{ flex: 1 }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          >
            {minuteOptions.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>

          {/* Buổi AM / PM */}
          <Select
            size="small"
            value={ampm}
            onChange={(e) => setAmpm(e.target.value)}
            sx={{ width: 85 }}
          >
            <MenuItem value="AM">AM</MenuItem>
            <MenuItem value="PM">PM</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Cài đặt nhắc nhở (Set Reminder) */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
          SET REMINDER
        </Typography>
        <Select
          fullWidth
          size="small"
          value={reminder}
          onChange={(e) => setReminder(Number(e.target.value))}
          MenuProps={{ PaperProps: { sx: { maxHeight: 220 } } }}
        >
          {REMINDER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

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
          disabled={!dateStr}
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
