import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined'
import UndoIcon from '@mui/icons-material/Undo'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { styled } from '@mui/material/styles'
import { fetchBoardsAPI, reopenBoardAPI, deleteBoardDetailsAPI } from '~/apis/index.js'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants.js'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

// Styles của mấy cái Sidebar item menu, gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const navigate = useNavigate()
  const confirm = useConfirm()
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)
  const [loadError, setLoadError] = useState('')

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)
  const isClosedView = query.get('closed') === 'true'

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    setBoards(null)
    setLoadError('')
    fetchBoardsAPI(location.search)
      .then(updateStateData)
      .catch(() => setLoadError('Unable to load boards. Please try again.'))
  }, [location.search])

  const afterCreateNewBoard = () => {
    setLoadError('')
    setBoards(null)
    fetchBoardsAPI(location.search)
      .then(updateStateData)
      .catch(() => setLoadError('Unable to refresh boards. Please try again.'))
  }

  const handleReopenBoard = async (boardId) => {
    try {
      await reopenBoardAPI(boardId)
      toast.success('Board reopened!')
      fetchBoardsAPI(location.search).then(updateStateData)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to reopen board')
    }
  }

  const handleDeleteBoard = (b) => {
    confirm({
      title: 'Delete Board Permanently?',
      description: `Are you sure you want to permanently delete "${b.title}"? All lists, cards, and invitations will be permanently removed. This action cannot be undone.`,
      confirmationText: 'Delete permanently',
      cancellationText: 'Cancel'
    }).then(async () => {
      try {
        await deleteBoardDetailsAPI(b._id)
        toast.success('Board permanently deleted!')
        fetchBoardsAPI(location.search).then(updateStateData)
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete board')
      }
    }).catch(() => { })
  }

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards && !loadError) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  if (loadError) {
    return (
      <Container disableGutters maxWidth={false}>
        <AppBar />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">{loadError}</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 3, my: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Sidebar */}
          <Box sx={{ width: { xs: '100%', md: '240px' }, flexShrink: 0 }}>
            <Stack direction="column" spacing={1}>
              <SidebarItem
                component={Link}
                to="/boards"
                className={!isClosedView ? 'active' : ''}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>

              <SidebarItem
                component={Link}
                to="/boards?closed=true"
                className={isClosedView ? 'active' : ''}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <FolderOffOutlinedIcon fontSize="small" />
                Closed boards
              </SidebarItem>
            </Stack>
            {!isClosedView && (
              <>
                <Divider sx={{ my: 1 }} />
                <Stack direction="column" spacing={1}>
                  <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
                </Stack>
              </>
            )}
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              {isClosedView ? 'Closed boards:' : 'Your boards:'}
            </Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 && (
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                {isClosedView ? 'No closed boards found.' : 'No result found!'}
              </Typography>
            )}

            {/* Render danh sách boards theo CSS Grid 5 cột trên hàng */}
            {boards?.length > 0 && (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(5, 1fr)'
                },
                gap: 2
              }}>
                {boards.map(b => (
                  <Card
                    key={b._id}
                    onClick={() => navigate(`/boards/${b._id}`)}
                    sx={{
                      cursor: 'pointer',
                      width: '100%',
                      height: '135px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 6px 16px rgba(0,0,0,0.5)' : '0 6px 16px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box sx={{
                      height: '50px',
                      backgroundColor: b.background?.startsWith('http') ? 'transparent' : (b.background || randomColor({ seed: b._id })),
                      background: b.background?.startsWith('http') ? `url("${b.background}") center/cover no-repeat` : undefined,
                      flexShrink: 0
                    }} />

                    <CardContent sx={{
                      p: 1.5,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      '&:last-child': { pb: 1.5 }
                    }}>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.3
                        }}
                      >
                        {b.title}
                      </Typography>

                      {isClosedView ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 0.8, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<UndoIcon fontSize="small" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReopenBoard(b._id)
                            }}
                            sx={{ textTransform: 'none', fontSize: '11px', py: 0.2, px: 0.8 }}
                          >
                            Reopen
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteOutlineIcon fontSize="small" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteBoard(b)
                            }}
                            sx={{ textTransform: 'none', fontSize: '11px', py: 0.2, px: 0.8 }}
                          >
                            Delete
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.8, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', fontSize: '11px' }}>
                            {b.type || 'Workspace'}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Phân trang */}
            {(totalBoards > 0) && (
              <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => {
                    const params = new URLSearchParams()
                    if (isClosedView) params.set('closed', 'true')
                    if (item.page !== DEFAULT_PAGE) params.set('page', item.page)
                    const searchStr = params.toString() ? `?${params.toString()}` : ''
                    return (
                      <PaginationItem
                        component={Link}
                        to={`/boards${searchStr}`}
                        {...item}
                      />
                    )
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Boards
