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
    <div className="bg-white dark:bg-[#090d16] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-[1.01]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 pt-1.5">
            {description}
          </p>
        </div>

        <div className={`p-2.5 rounded-xl border ${iconBg}`}>
          <Icon 
            size={20}
            className={iconColor}
          />
        </div>
      </div>
    </div>
  );
}