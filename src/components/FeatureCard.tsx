import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon,
  variant = "primary",
  className 
}: FeatureCardProps) => {
  const bgColors = {
    primary: "bg-accent",
    secondary: "bg-secondary",
    accent: "bg-primary"
  };

  return (
    <div className={cn(
      "group p-6 rounded-lg transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-hover",
      bgColors[variant],
      className
    )}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        {title}
      </h3>
      <p className="text-white/90 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
