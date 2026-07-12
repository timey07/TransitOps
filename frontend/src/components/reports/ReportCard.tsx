import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

export default function ReportCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            {description}
          </p>
        </div>


        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon 
            size={22}
            className={iconColor}
          />
        </div>

      </div>
    </div>
  );
}