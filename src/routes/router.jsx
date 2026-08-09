import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import Onboarding from '../pages/Onboarding/Onboarding.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import { PATH } from './paths.js'

export const router = createBrowserRouter([
  {
    path: PATH.ONBOARDING,
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
