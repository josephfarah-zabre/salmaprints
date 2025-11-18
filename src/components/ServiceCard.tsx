import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  iconBg?: string;
}

export const ServiceCard = ({ 
  title, 
  description, 
  imageUrl,
  iconBg = "bg-accent"
}: ServiceCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      {/* Service Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Icon Badge */}
        <div className={`absolute bottom-4 right-4 ${iconBg} p-4 rounded-lg shadow-lg`}>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3">
          {title}
        </h3>
        <p className="text-text-secondary mb-4 line-clamp-3">
          {description}
        </p>
        <Button variant="outline" className="group/btn border-accent text-accent hover:bg-accent hover:text-white">
          Read More
          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
