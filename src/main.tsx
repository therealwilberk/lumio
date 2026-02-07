import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ToastProvider } from '@/lib/notifications';
import { PageTransition } from '@/components/ui/PageTransition';
import '@/index.css'
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdditionPage } from '@/pages/math/AdditionPage';
import { SubtractionPage } from '@/pages/math/SubtractionPage';
import { MathHubPage } from '@/pages/math/MathHubPage';
import { SpeedDrillPage } from '@/pages/math/SpeedDrillPage';
import { RegularPracticePage } from '@/pages/math/RegularPracticePage';
import { SubjectsPage } from '@/pages/SubjectsPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageTransition>
        <HomePage />
      </PageTransition>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/math/subtraction",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <SubtractionPage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: (
      <PageTransition>
        <LoginPage />
      </PageTransition>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    element: (
      <PageTransition>
        <SignupPage />
      </PageTransition>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <DashboardPage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/subjects",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <SubjectsPage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/math",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <MathHubPage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/math/addition",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <AdditionPage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/math/speed-drill",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <SpeedDrillPage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/math/regular-practice",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <RegularPracticePage />
        </PageTransition>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <ToastProvider />
            <RouterProvider router={router} />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
