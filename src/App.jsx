import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

// Lazy loading các route / trang để tối ưu tải ban đầu và chia nhỏ bundle
const Board = lazy(() => import('~/pages/Boards/_id'))
const NotFound = lazy(() => import('~/pages/404/NotFound'))
const Auth = lazy(() => import('~/pages/Auth/Auth'))
const AccountVerification = lazy(() => import('~/pages/Auth/AccountVerification'))
const Settings = lazy(() => import('~/pages/Settings/Settings'))
const Boards = lazy(() => import('~/pages/Boards/index.jsx'))
const Home = lazy(() => import('~/pages/Home/Home'))

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Suspense fallback={<PageLoadingSpinner caption="Loading..." />}>
      <Routes>
        {/* Landing Page: khách chưa đăng nhập xem trang giới thiệu; đã đăng nhập tự chuyển vào /boards */}
        <Route path='/' element={currentUser ? <Navigate to='/boards/' replace={true} /> : <Home />} />
        <Route path='/home' element={<Home />} />

        {/* Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}

          {/* board details route */}
          <Route path='boards/:boardId' element={<Board />} />
          <Route path='boards/' element={<Boards />} />

          {/* User Settings */}
          <Route path='settings/account' element={<Settings />} />
          <Route path='settings/security' element={<Settings />} />
        </Route>

        {/* Authentication */}
        <Route path='login' element={<Auth />} />
        <Route path='register' element={<Auth />} />
        <Route path='/account/verification' element={<AccountVerification />} />

        {/* 404 route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
