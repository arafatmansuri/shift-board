import { Building2, Calendar, Users } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LandingCard } from "../components/LandingCard";
import { Navbar } from "../components/Navbar";
import { useAppSelector } from "../hooks";

const cards: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Shift Management",
    description:
      "Create, update, and manage employee shifts with ease. Filter by date, employee, or department.",
    icon: <Calendar className="w-6 h-6 text-slate-700" />,
  },
  {
    title: "Employee Portal",
    description:
      "Employees can easily view their assigned shifts and stay updated on their schedules.",
    icon: <Users className="w-6 h-6 text-slate-700" />,
  },
  {
    title: "Department Organizatison",
    description:
      "Organize your workforce by departments with designated managers for better oversight.",
    icon: <Building2 className="w-6 h-6 text-slate-700" />,
  },
];

const LandingPage = () => {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);
  return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="md:text-5xl text-3xl font-bold text-slate-900 mb-4">
            Employee Shift Management Made Simple
          </h1>
          <p className="md:text-xl text-slate-600 max-w-2xl mx-auto">
            Streamline your workforce scheduling with our intuitive shift board
            system. Perfect for managing employees, departments, and schedules
            all in one place.
          </p>
          <div className="mt-8 flex gap-5 justify-center">
            <Link
              to="/register"
              className="inline-block px-8 md:py-3 py-2 bg-slate-700 text-white text-lg rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
              // className="inline-block px-8 py-3 bg-slate-700 text-white text-lg rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            {/* <Link
              to="/login"
              className="inline-block px-8 py-3 bg-slate-700 text-white text-lg rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              Login to your account
            </Link> */}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {cards.map((c) => (
            <LandingCard
              title={c.title}
              description={c.description}
              icon={c.icon}
              key={c.title}
            />
          ))}
        </div>
      </section>
  );
};
export default LandingPage;
