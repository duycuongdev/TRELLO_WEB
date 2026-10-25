import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import CloseIcon from '@mui/icons-material/Close'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PaletteIcon from '@mui/icons-material/Palette'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const TOUR_STEPS = [
  {
    stepIndex: 1,
    icon: <DashboardCustomizeIcon sx={{ fontSize: 36, color: '#0052cc' }} />,
    tag: 'STEP 1 / 5 • WORKSPACE OVERVIEW',
    tagColor: 'primary',
    title: 'Welcome to Trello Kanban!',
    subtitle: 'A visual workspace designed to help you organize projects, manage daily tasks, and boost team productivity.',
    highlights: [
      'Create unlimited dedicated Boards for projects, personal goals, or team workflows.',
      'Full Dark Mode & Light Mode support with smooth, eye-friendly transitions.',
      'Easily manage active and archived boards with one-click restore or permanent delete.'
    ],
    preview: (
      <Box sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f0f7ff',
        border: '1px dashed',
        borderColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#93c5fd',
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#0052cc', color: '#fff', fontSize: '0.82rem', fontWeight: 600, minWidth: 100, textAlign: 'center', boxShadow: 1 }}>
          🚀 Project Alpha
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#0284c7', color: '#fff', fontSize: '0.82rem', fontWeight: 600, minWidth: 100, textAlign: 'center', boxShadow: 1 }}>
          🎨 Design Sprint
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#16a34a', color: '#fff', fontSize: '0.82rem', fontWeight: 600, minWidth: 100, textAlign: 'center', boxShadow: 1 }}>
          ✨ Personal Goals
        </Box>
      </Box>
    )
  },
  {
    stepIndex: 2,
    icon: <ViewColumnIcon sx={{ fontSize: 36, color: '#0284c7' }} />,
    tag: 'STEP 2 / 5 • KANBAN WORKFLOW',
    tagColor: 'info',
    title: 'Flexible Lists & Cards Drag-and-Drop',
    subtitle: 'Seamlessly visualize your workflow from To Do -> In Progress -> Done with fluid drag-and-drop.',
    highlights: [
      'Smoothly reorder columns and cards with modern dnd-kit touch and mouse gestures.',
      'Instantly duplicate (Copy) or move cards across columns on the board.',
      'Compose rich task descriptions using the built-in formatted Markdown Editor.'
    ],
    preview: (
      <Box sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
        border: '1px dashed',
        borderColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#cbd5e1',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1
      }}>
        <Box sx={{ p: 1, borderRadius: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9' }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, mb: 0.8, color: 'text.secondary' }}>📋 To Do</Typography>
          <Box sx={{ p: 0.8, borderRadius: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#ffffff', fontSize: '0.72rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>Research UI</Box>
        </Box>
        <Box sx={{ p: 1, borderRadius: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9' }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, mb: 0.8, color: '#0284c7' }}>⚡ In Progress</Typography>
          <Box sx={{ p: 0.8, borderRadius: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#ffffff', fontSize: '0.72rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '3px solid #0284c7' }}>Build API</Box>
        </Box>
        <Box sx={{ p: 1, borderRadius: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9' }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, mb: 0.8, color: '#16a34a' }}>✅ Done</Typography>
          <Box sx={{ p: 0.8, borderRadius: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#ffffff', fontSize: '0.72rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>Setup DB</Box>
        </Box>
      </Box>
    )
  },
  {
    stepIndex: 3,
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#16a34a' }} />,
    tag: 'STEP 3 / 5 • CHECKLISTS & DEADLINES',
    tagColor: 'success',
    title: 'Smart Checklists & Due Date Badges',
    subtitle: 'Break down complex goals into actionable sub-tasks and track deadlines with ease.',
    highlights: [
      'Create multiple checklists per card with real-time percentage progress bars.',
      'Set precise Due Dates with smart countdown countdown badges.',
      'Automated color badges: Green (Completed), Amber (Due within 24h), Red (Overdue).'
    ],
    preview: (
      <Box sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f0fdf4',
        border: '1px dashed',
        borderColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#86efac'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Checklist Progress: 75%</Typography>
          <Chip
            size="small"
            icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
            label="Due: Tomorrow"
            sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600, fontSize: '0.72rem' }}
          />
        </Box>
        <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4, mb: 1.5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' } }} />
        <Stack spacing={0.6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
            <span style={{ textDecoration: 'line-through' }}>API Documentation</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
            <span style={{ textDecoration: 'line-through' }}>Pagination Integration</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', fontWeight: 600 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '3px', border: '2px solid #cbd5e1' }} />
            <span>Production Deployment</span>
          </Box>
        </Stack>
      </Box>
    )
  },
  {
    stepIndex: 4,
    icon: <PaletteIcon sx={{ fontSize: 36, color: '#9333ea' }} />,
    tag: 'STEP 4 / 5 • CUSTOMIZATION',
    tagColor: 'secondary',
    title: 'Color-Coded Labels & Board Wallpapers',
    subtitle: 'Give your workspace personality and recognize task priority at a single glance.',
    highlights: [
      'Attach multi-colored Labels with custom titles (Urgent, Bug, Feature, Design, etc.).',
      'Customize board backgrounds from curated Unsplash photos or upload your own via Cloudinary.',
      'Filter cards instantly by labels, keywords, or assigned team members.'
    ],
    preview: (
      <Box sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#faf5ff',
        border: '1px dashed',
        borderColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#d8b4fe',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Chip size="small" label="🚨 Urgent" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }} />
        <Chip size="small" label="✨ Feature" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 700 }} />
        <Chip size="small" label="🎨 UI/UX Design" sx={{ bgcolor: '#fce7f3', color: '#be185d', fontWeight: 700 }} />
        <Chip size="small" label="🖼️ Unsplash Wallpaper" variant="outlined" sx={{ fontWeight: 600 }} />
      </Box>
    )
  },
  {
    stepIndex: 5,
    icon: <GroupAddIcon sx={{ fontSize: 36, color: '#f59e0b' }} />,
    tag: 'STEP 5 / 5 • REAL-TIME COLLABORATION',
    tagColor: 'warning',
    title: 'Teamwork & Instant Socket Notifications',
    subtitle: 'Connect with teammates, discuss in card comments, and stay synchronized in real time.',
    highlights: [
      'Invite members to your boards via email with clear role permissions.',
      'Comment on cards and receive instant notification alerts powered by Socket.io.',
      'Archive completed lists and cards to keep your workspace tidy, with one-click restore anytime.'
    ],
    preview: (
      <Box sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#fffbeb',
        border: '1px dashed',
        borderColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#fde68a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>A</Box>
          <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>B</Box>
          <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#9333ea', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>C</Box>
        </Box>
        <Chip size="small" label="🔔 Real-time Socket Alerts" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600 }} />
      </Box>
    )
  }
]

function UserOnboardingModal({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0)

  const currentStepData = TOUR_STEPS[activeStep]
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === TOUR_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      handleClose()
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setActiveStep((prev) => prev - 1)
    }
  }

  const handleClose = () => {
    setActiveStep(0)
    if (onClose) onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          p: 1,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Top bar: Tag, Steps Dots & Close button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            size="small"
            label={currentStepData.tag}
            color={currentStepData.tagColor}
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5 }}
          />
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Step Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={((activeStep + 1) / TOUR_STEPS.length) * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: 3,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              backgroundImage: 'linear-gradient(90deg, #0052cc 0%, #0284c7 100%)'
            }
          }}
        />

        {/* Icon Header & Title */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
          <Box sx={{
            p: 1.2,
            borderRadius: 2.5,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 82, 204, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentStepData.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 0.5 }}>
              {currentStepData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {currentStepData.subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Interactive Feature Highlights */}
        <Stack spacing={1.2} sx={{ my: 2.5 }}>
          {currentStepData.highlights.map((text, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a', mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.5, color: 'text.primary', fontSize: '0.86rem' }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Visual Preview Box */}
        <Box sx={{ mb: 3 }}>
          {currentStepData.preview}
        </Box>

        {/* Navigation Indicator Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          {TOUR_STEPS.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setActiveStep(idx)}
              sx={{
                width: activeStep === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                cursor: 'pointer',
                bgcolor: activeStep === idx
                  ? '#0052cc'
                  : (theme) => theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>

        {/* Footer Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="text"
            onClick={handleClose}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          >
            Skip
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={isFirstStep}
              startIcon={<NavigateBeforeIcon />}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={isLastStep ? <RocketLaunchIcon /> : <NavigateNextIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                bgcolor: '#0052cc',
                backgroundImage: isLastStep ? 'linear-gradient(135deg, #0052cc 0%, #0284c7 100%)' : 'none',
                '&:hover': {
                  bgcolor: '#0747a6'
                }
              }}
            >
              {isLastStep ? 'Get Started!' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default UserOnboardingModal
