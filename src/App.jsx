import { useState, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from './router'
import AchievementToastContainer from './components/achievements/AchievementToast'
import ToastProvider from './components/ui/ToastProvider'
import LoadingScreen from './components/ui/LoadingScreen'
import LevelUpOverlay from './components/ui/LevelUpOverlay'
import XpFloatLayer from './components/ui/XpFloatLayer'
import { useLevelUp } from './hooks/useLevelUp'

function AppRoutes() {
  useLevelUp()
  return useRoutes(routes)
}

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 900)
    return () => clearTimeout(t)
  }, [])

  if (booting) {
    return <LoadingScreen message="Preparando sua jornada de foco..." />
  }

  return (
    <>
      <AppRoutes />
      <ToastProvider />
      <AchievementToastContainer />
      <LevelUpOverlay />
      <XpFloatLayer />
    </>
  )
}
