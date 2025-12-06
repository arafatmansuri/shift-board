import {
  Calendar as CalendarIcon,
  Filter,
  Menu,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useEmployeeQuery } from "../queries/employeeQueries";
import { useShiftMutation, useShiftQuery } from "../queries/shiftQueries";
import { getEmployee } from "../store/employeeSlice";
import { getShifts, removeShift } from "../store/shiftSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import type { Shift, User } from "../types";

export const Shifts = () => {
  const [filterDate, setFilterDate] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const { shifts } = useAppSelector((state) => state.shifts);
  const { employees } = useAppSelector((state) => state.employees);
  const [endpoint, setEndpoint] = useState(
    user?.role === "admin"
      ? `shifts/${
          typeof user?.company == "object" ? user.company._id : ""
        }?employee=${filterEmployee}&date=${filterDate}`
      : "employeeshift"
  );
  const dispatch = useAppDispatch();
  const {
    isLoading: shiftsLoading,
    data: shiftsData,
    isSuccess: shiftSucessStatus,
    isError: shiftError,
    refetch: refetchShifts,
    error,
  } = useShiftQuery(endpoint);
  const navigate = useNavigate();
  useEffect(() => {
    if (shiftSucessStatus) {
      dispatch(getShifts(shiftsData));
    }
  }, [shiftSucessStatus, shiftsData]);
  const RefTokenMutation = useLoginMutation();
  useEffect(() => {
    if (shiftError && error.status == 401) {
      RefTokenMutation.mutate(
        { endpoint: "refreshaccesstoken", method: "POST" },
        {
          onError: () => {
            navigate("/login");
          },
          onSuccess: () => {
            refetchShifts();
          },
        }
      );
    }
  }, [shiftError, error]);
  const { data: employeesData, isSuccess: employeeSuccessStatus } =
    useEmployeeQuery(typeof user?.company == "object" ? user.company._id : "");
  useEffect(() => {
    if (employeeSuccessStatus) {
      dispatch(getEmployee(employeesData));
    }
  }, [employeeSuccessStatus]);
  const shiftMutation = useShiftMutation();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this shift?")) {
      shiftMutation.mutate(
        { endpoint: `delete/${id}`, method: "DELETE" },
        {
          onSuccess() {
            dispatch(removeShift({ id }));
          },
        }
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEmployeeName = (shift: Shift) => {
    if (typeof shift.employeeId === "object" && shift.employeeId !== null) {
      const employee = shift.employeeId as User;
      return `${employee.username} (${employee.employeeCode})`;
    }
    const employee = employees.find(
      (e: { _id: string }) => e._id === shift.employeeId
    );
    return employee
      ? `${employee.username} (${employee.employeeCode})`
      : "Unknown";
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Shifts</h1>
          <p className="text-slate-600">Manage employee work schedules</p>
        </div>
        <Menu
          className="mt-2 md:hidden"
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
      </div>

      {user?.role === "admin" && (
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard/shifts/create")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Shift
          </button>

          <div className="flex-col md:flex-row items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600 hidden md:inline md:mr-2" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setEndpoint(
                  `shifts/${
                    typeof user?.company == "object" ? user.company._id : ""
                  }?employee=${filterEmployee}&date=${e.target.value}`
                );
                // refetchShifts();
              }}
              className="md:px-4 md:py-2 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 mb-2 md:mb-0 md:mr-2"
              placeholder="Filter by date"
            />
            <select
              value={filterEmployee}
              onChange={(e) => {
                setFilterEmployee(e.target.value);
                setEndpoint(
                  `shifts/${
                    typeof user?.company == "object" ? user.company._id : ""
                  }?employee=${e.target.value}&date=${filterDate}`
                );
              }}
              className="md:px-4 md:py-2 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 mb-2 md:mb-0"
            >
              <option value="">All Employees</option>
              {employees.map((emp: User) => (
                <option key={emp._id} value={emp._id}>
                  {emp.username} ({emp.employeeCode})
                </option>
              ))}
            </select>
            {(filterDate || filterEmployee) && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setFilterEmployee("");
                  setEndpoint(
                    `shifts/${
                      typeof user?.company == "object" ? user.company._id : ""
                    }`
                  );
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {shiftsLoading ? (
        <div className="text-center py-12 text-slate-600">
          Loading shifts...
        </div>
      ) : shifts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No shifts found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {shifts.map((shift: Shift) => (
            <div
              key={shift._id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarIcon className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      {formatDate(shift.date)}
                    </h3>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {shift.startTime} - {shift.endTime}
                    </p>
                    <p>
                      {user?.role == "admin" && (
                        <span className="font-medium">Employee:</span>
                      )}

                      {user?.role == "admin" && getEmployeeName(shift)}
                    </p>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(shift?._id || "")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
