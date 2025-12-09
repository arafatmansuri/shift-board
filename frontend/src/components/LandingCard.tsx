import type { ReactNode } from "react";

type LandingCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export const LandingCard = ({ description, icon, title }: LandingCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};
