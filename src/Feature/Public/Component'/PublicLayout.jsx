
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { Suspense } from 'react'
import PageLoader from '../../../Component/PageLoader'
import { Toaster } from 'react-hot-toast'

const PublicLayout = () => {
  return (
    <main className=' flex flex-col min-h-screen'>
    <Header />
    <Suspense fallback={<PageLoader />}>
    <Outlet />
    </Suspense>
    <Footer />
    <Toaster position="top-right" />
    </main>
  )
}

export default PublicLayout