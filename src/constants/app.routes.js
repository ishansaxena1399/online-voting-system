import { ADMIN_ROUTES } from "./admin.routes";
import { USER_ROUTES } from "./user.routes";
import { AUTH_ROUTES } from "./auth.routes";
import { PUBLIC_ROUTES } from "./public.routes";

import Login from "../pages/login";
import Candidates from "../pages/candidates";
import AdminHome from "../pages/adminHome";
import Voters from "../pages/voters";
import Parties from "../pages/parties";
import Positions from "../pages/positions";
import Register from "../pages/register";
import PublicHomePage from "../pages/publicHomePage";
import ElectionResult from "../pages/result";
import ForgotPassword from "../pages/forgotPassword";

export const AppRoutes = {
  ADMIN: [
    {
      path: ADMIN_ROUTES.home,
      exact: true,
      element: <AdminHome />
    },
    {
      path: ADMIN_ROUTES.candidates,
      exact: true,
      element: <Candidates />
    },
    {
      path: ADMIN_ROUTES.voters,
      exact: true,
      element: <Voters />
    },
    {
      path: ADMIN_ROUTES.parties,
      exact: true,
      element: <Parties />
    },
    {
      path: ADMIN_ROUTES.positions,
      exact: true,
      element: <Positions />
    },
  ],
  AUTH: [
    {
      path: AUTH_ROUTES.login,
      exact: true,
      element: <Login />
    },
    {
      path: AUTH_ROUTES.register,
      exact: true,
      element: <Register />
    },
    {
      path: AUTH_ROUTES.forgotPassword,
      exact: true,
      element: <ForgotPassword />
    },
  ],
  USER: [
    {
      path: USER_ROUTES.vote,
      exact: true,
      element: ""
    }
  ],
  PUBLIC: [
    {
      path: PUBLIC_ROUTES.home,
      exact: true,
      element: <PublicHomePage />
    },
    {
      path: PUBLIC_ROUTES.results,
      exact: true,
      element: <ElectionResult />
    }
  ],
};