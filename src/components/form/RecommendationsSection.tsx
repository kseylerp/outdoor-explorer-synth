
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecommendedCompany } from "./ActivityFormSchema";

interface RecommendationsSectionProps {
  recommendations: RecommendedCompany[];
  updateRecommendation: (index: number, field: keyof RecommendedCompany, value: string) => void;
  addRecommendation: () => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  updateRecommendation,
  addRecommendation
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Recommended Companies</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addRecommendation}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Recommendation
        </Button>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={rec.companyName}
                onChange={(e) => updateRecommendation(index, "companyName", e.target.value)}
                placeholder="Company Name"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Website URL</label>
              <Input
                value={rec.websiteUrl}
                onChange={(e) => updateRecommendation(index, "websiteUrl", e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;
