import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import LinearProgress from '@mui/material/LinearProgress'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import Divider from '@mui/material/Divider'

function getProgressColor(percent) {
  if (percent === 100) return '#22c55e' // Vibrant Green
  if (percent >= 60) return '#06b6d4' // Cyan / Teal
  if (percent >= 30) return '#f59e0b' // Amber
  return '#60a5fa' // Blue
}

function BoardProgress({ board }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = Boolean(anchorEl)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const {
    totalCards,
    doneCards,
    remainingCards,
    progressPercent,
    totalChecklistItems,
    doneChecklistItems,
    checklistPercent
  } = useMemo(() => {
    const columns = board?.columns || []
    let total = 0
    let done = 0
    let totalChecklist = 0
    let doneChecklist = 0

    columns.forEach((column) => {
      if (column._destroy) return
      const colTitle = (column.title || '').trim().toLowerCase()
      const isDoneColumn =
        /^(done|hoàn thành|completed|finished|xong)$/i.test(colTitle) ||
        /(done|hoàn thành|completed|finished)/i.test(colTitle)

      const cards = column.cards || []
      cards.forEach((card) => {
        if (card.FE_PlaceholderCard || card._destroy) return
        total += 1

        let cardTotalItems = 0
        let cardDoneItems = 0
        if (Array.isArray(card.checklists)) {
          card.checklists.forEach((cl) => {
            if (Array.isArray(cl.items)) {
              cl.items.forEach((item) => {
                cardTotalItems += 1
                totalChecklist += 1
                if (item.isDone) {
                  cardDoneItems += 1
                  doneChecklist += 1
                }
              })
            }
          })
        }

        const isChecklistAllDone = cardTotalItems > 0 && cardDoneItems === cardTotalItems
        const isCardDone = isDoneColumn || Boolean(card.isDueDateComplete) || isChecklistAllDone
        if (isCardDone) done += 1
      })
    })

    const progPercent = total > 0 ? Math.round((done / total) * 100) : 0
    const clPercent = totalChecklist > 0 ? Math.round((doneChecklist / totalChecklist) * 100) : 0

    return {
      totalCards: total,
      doneCards: done,
      remainingCards: total - done,
      progressPercent: progPercent,
      totalChecklistItems: totalChecklist,
      doneChecklistItems: doneChecklist,
      checklistPercent: clPercent
    }
  }, [board])

  const progressColor = getProgressColor(progressPercent)

  const getMotivationalMessage = () => {
    if (totalCards === 0) return 'Add cards to your lists to track board progress.'
    if (progressPercent === 100) return '🎉 All tasks completed! Outstanding work!'
    if (progressPercent >= 60) return '🚀 Over halfway done! Keep the momentum going!'
    if (progressPercent >= 30) return '💪 Solid progress underway, keep moving forward!'
    return '🎯 Ready to roll! Tackle your first tasks today.'
  }

  return (
    <>
      <Chip
        clickable
        onClick={handleOpen}
        icon={
          <DonutLargeIcon
            sx={{
              fontSize: '18px !important',
              color: `${progressColor} !important`
            }}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 600 }}>
              {totalCards === 0 ? 'Progress' : `${doneCards}/${totalCards} Done (${progressPercent}%)`}
            </Typography>
            {totalCards > 0 && (
              <Box
                sx={{
                  width: 38,
                  height: 6,
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    bgcolor: progressColor,
                    borderRadius: 1,
                    transition: 'width 0.4s ease'
                  }}
                />
              </Box>
            )}
          </Box>
        }
        sx={{
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          paddingX: '5px',
          borderRadius: '4px',
          backdropFilter: 'blur(4px)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.25)'
          }
        }}
      />

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
        PaperProps={{
          sx: {
            p: 2.5,
            width: 320,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: (theme) => `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DonutLargeIcon sx={{ color: progressColor }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Board Progress
            </Typography>
          </Box>
          <Chip
            size="small"
            label={`${progressPercent}%`}
            sx={{
              fontWeight: 700,
              bgcolor: `${progressColor}22`,
              color: progressColor,
              border: `1px solid ${progressColor}55`
            }}
          />
        </Box>

        {/* Linear Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200'),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: progressColor,
                transition: 'transform 0.4s ease'
              }
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic', fontSize: '12.5px' }}>
          {getMotivationalMessage()}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Detailed Stats */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentOutlinedIcon fontSize="small" color="primary" />
              <Typography variant="body2">Total Cards</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700}>{totalCards}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#22c55e' }} />
              <Typography variant="body2">Completed Cards</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#22c55e' }}>
              {doneCards}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HourglassEmptyIcon fontSize="small" sx={{ color: '#f59e0b' }} />
              <Typography variant="body2">Remaining Tasks</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#f59e0b' }}>
              {remainingCards}
            </Typography>
          </Box>

          {totalChecklistItems > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormatListBulletedIcon fontSize="small" color="secondary" />
                <Typography variant="body2">Checklist Items</Typography>
              </Box>
              <Typography variant="body2" fontWeight={700}>
                {doneChecklistItems}/{totalChecklistItems} ({checklistPercent}%)
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}

export default BoardProgress
