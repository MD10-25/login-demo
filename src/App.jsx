import { useEffect } from "react"
import {
  Route,
  matchRoutes,
  useLocation,
  RouterProvider,
  useNavigationType,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import About, { loader as aboutLoader } from "./pages/About";
import Home from "./pages/Home";
import Statements, {
  loader as statementsLoader,
  action as statementsAction,
} from "./pages/Statements";
import Signup from "./pages/Signup";
import LogIn from "./pages/LogIn";
import RequireAuth from "./components/RequireAuth";
import Secrets, { secretsLoader, action as secretsAction } from "./pages/Secrets";
import Error from "./pages/Error";
import Profile, { profileAction, profileLoader } from "./pages/Profile";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';



Sentry.init({
  dsn: import.meta.env.VITE_APP_SENTRY_DSN_KEY,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromElements,
          matchRoutes,
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});


function App() {
  const { user } = useAuth()

  const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(
    createBrowserRouter
  );
  

   const router = sentryCreateBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<Error/>} >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} loader={aboutLoader} />
        <Route
          path="statements"
          element={<Statements />}
          loader={statementsLoader}
          action={statementsAction}
        />
        <Route path="secrets" element={<RequireAuth><Secrets /></RequireAuth>} loader={secretsLoader(user)} action={secretsAction(user)}/>
        <Route path="profile" element={<RequireAuth><Profile/></RequireAuth>} loader={profileLoader(user)} action={profileAction(user)}/>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<LogIn />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
