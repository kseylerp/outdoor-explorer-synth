
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GuideRecommendationChat from "@/components/guide/GuideRecommendationChat";

const AddActivity = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Activity with Guide Recommendation AI</CardTitle>
        </CardHeader>
        <CardContent>
          <GuideRecommendationChat />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddActivity;
