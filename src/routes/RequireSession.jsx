import { useSyncExternalStore } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasSession, subscribeSession } from '@/lib/session.js'
import { PATH } from './paths.js'

function RequireSession() {
  const location = useLocation()
  const isAuthenticated = useSyncExternalStore(
    subscribeSession,
    hasSession,
    () => false,
  )

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATH.ONBOARDING}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}

export default RequireSession
