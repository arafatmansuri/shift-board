import { CalendarIcon, Trash2 } from "lucide-react";
import type { Shift } from "../types";

type ShiftCardProps = {
  shift: Shift;
  role: "admin" | "employee";
  getEmployeeName: (shift: Shift) => string;
  handleDelete: (id: string) => void;
  formatDate: (date: string) => string;
};

export const ShiftCard = ({
  role,
  shift,
  getEmployeeName,
  handleDelete,
  formatDate,
}: ShiftCardProps) => {
  return (
    <div
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
              <span className="font-medium">Time:</span> {shift.startTime} -{" "}
              {shift.endTime}
            </p>
            <p>
              {role == "admin" && (
                <span className="font-medium">Employee:</span>
              )}

              {role == "admin" && getEmployeeName(shift)}
            </p>
          </div>
        </div>
        {role === "admin" && (
          <button
            onClick={() => handleDelete(shift?._id || "")}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
