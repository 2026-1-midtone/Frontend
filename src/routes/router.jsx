import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import TabLayout from '../layouts/TabLayout.jsx'
import Home from '../pages/Home/Home.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import Onboarding from '../pages/Onboarding/Onboarding.jsx'
import { PATH } from './paths.js'

export const router = createBrowserRouter([
  {
    path: PATH.ONBOARDING,
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Onboarding /> },
      {
        // 하단 탭이 붙는 화면 묶음
        element: <TabLayout />,
        children: [{ path: PATH.HOME, element: <Home /> }],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
