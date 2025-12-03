import { Link } from "react-router-dom";
import { Calendar, Users, Building2 } from "lucide-react";

const App = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-slate-700" />
              <span className="text-xl font-semibold text-slate-800">
                ShiftBoard
              </span>
            </div>
            <Link
              to="/login"
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Employee Shift Management Made Simple
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Streamline your workforce scheduling with our intuitive shift board
            system. Perfect for managing employees, departments, and schedules
            all in one place.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-slate-700 text-white text-lg rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Shift Management
            </h3>
            <p className="text-slate-600">
              Create, update, and manage employee shifts with ease. Filter by
              date, employee, or department.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Employee Portal
            </h3>
            <p className="text-slate-600">
              Employees can easily view their assigned shifts and stay updated
              on their schedules.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Department Organizatison
            </h3>
            <p className="text-slate-600">
              Organize your workforce by departments with designated managers
              for better oversight.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default App