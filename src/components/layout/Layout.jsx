import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
export default function Layout() {
  return (
    <div className="min-h-svh bg-background pb-20 md:pb-0">
      <Sidebar />
      <div className="md:pl-16 lg:pl-56">
        <Header />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
