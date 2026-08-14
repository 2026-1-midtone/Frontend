import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import DailyRoutine from '../pages/DailyRoutine/DailyRoutine.jsx'
import Onboarding from '../pages/Onboarding/Onboarding.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import RoutineSummary from '../pages/RoutineSummary/RoutineSummary.jsx'
import { PATH } from './paths.js'

export const router = createBrowserRouter([
  {
    path: PATH.ONBOARDING,
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: PATH.ROUTINE_SUMMARY, element: <RoutineSummary /> },
      { path: PATH.DAILY_ROUTINE, element: <DailyRoutine /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
