import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App.tsx";
import { ProtectedRoute } from "./components/ProtectedRoutes.tsx";
import "./index.css";
import { CreateEmployee } from "./pages/CreateEmployee.tsx";
import { CreateShift } from "./pages/CreateShift.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Departments } from "./pages/Departments.tsx";
import { Employees } from "./pages/Employee.tsx";
import { Login } from "./pages/Login.tsx";
import { Shifts } from "./pages/Shifts.tsx";
import { store } from "./store/index.ts";
import { CreateDepartment } from "./pages/CreateDepartment.tsx";
import { Signup } from "./pages/Singup.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} index={true} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/dashboard/shifts" replace />}
              />
              <Route path="shifts" element={<Shifts />}></Route>
              <Route path="shifts/create" element={<CreateShift />} />
              <Route
                path="employees"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employees/create"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CreateEmployee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="departments"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Departments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="departments/create"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CreateDepartment />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
