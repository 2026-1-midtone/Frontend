import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import TabLayout from '../layouts/TabLayout.jsx'
import DailyRoutine from '../pages/DailyRoutine/DailyRoutine.jsx'
import RoutineStreak from '../pages/DailyRoutine/RoutineStreak.jsx'
import RoutineSummary from '../pages/RoutineSummary/RoutineSummary.jsx'
import Assistant from '../pages/Assistant/Assistant.jsx'
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
      // AI 비서 대화 화면 — 하단 탭 없이 전체 화면으로 띄운다.
      { path: PATH.ASSISTANT, element: <Assistant /> },
      {
        element: <TabLayout />,
        children: [
          { path: PATH.HOME, element: <Home /> },
          { path: PATH.SCHEDULE, element: <Schedule /> },
          { path: PATH.SCHEDULE_CALENDAR, element: <ScheduleCalendar /> },
          { path: PATH.SCHEDULE_RESULT, element: <ScheduleResult /> },
          
          { path: PATH.ROUTINE_SUMMARY, element: <RoutineSummary /> },
          { path: PATH.DAILY_ROUTINE, element: <DailyRoutine /> },
          { path: PATH.ROUTINE, element: <DailyRoutine /> },
          { path: PATH.ROUTINE_STREAK, element: <RoutineStreak /> },
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
