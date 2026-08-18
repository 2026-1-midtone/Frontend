import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import TabLayout from '../layouts/TabLayout.jsx'
import DailyRoutine from '../pages/DailyRoutine/DailyRoutine.jsx'
import RoutineSummary from '../pages/RoutineSummary/RoutineSummary.jsx'
import Home from '../pages/Home/Home.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import Onboarding from '../pages/Onboarding/Onboarding.jsx'
import Schedule from '../pages/Schedule/Schedule.jsx'
import ScheduleCalendar from '../pages/Schedule/ScheduleCalendar.jsx'
import ScheduleResult from '../pages/Schedule/ScheduleResult.jsx'
import AccountSettings from '../pages/Settings/AccountSettings.jsx'
import CoachingAlertSettings from '../pages/Settings/CoachingAlertSettings.jsx'
import PersonalizationSettings from '../pages/Settings/PersonalizationSettings.jsx'
import Settings from '../pages/Settings/Settings.jsx'
import RhythmCoaching from '../pages/RhythmCoaching/RhythmCoaching.jsx'
import TransitionGuide from '../pages/RhythmCoaching/TransitionGuide.jsx'
import { PATH } from './paths.js'

export const router = createBrowserRouter([
  {
    path: PATH.ONBOARDING,
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Onboarding /> },
      {
        element: <TabLayout />,
        children: [
          { path: PATH.HOME, element: <Home /> },
          { path: PATH.SCHEDULE, element: <Schedule /> },
          { path: PATH.SCHEDULE_CALENDAR, element: <ScheduleCalendar /> },
          { path: PATH.SCHEDULE_RESULT, element: <ScheduleResult /> },
          
          { path: PATH.ROUTINE_SUMMARY, element: <RoutineSummary /> },
          { path: PATH.DAILY_ROUTINE, element: <DailyRoutine /> },
          
          // 방금 추가된 코칭 화면들도 하단 탭 내부에 배치
          { path: PATH.COACHING, element: <RhythmCoaching /> },
          { path: PATH.TRANSITION_GUIDE, element: <TransitionGuide /> },
          
          { path: PATH.SETTINGS, element: <Settings /> },
          { path: PATH.SETTINGS_PERSONALIZATION, element: <PersonalizationSettings /> },
          { path: PATH.SETTINGS_COACHING_ALERTS, element: <CoachingAlertSettings /> },
          { path: PATH.SETTINGS_ACCOUNT, element: <AccountSettings /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])