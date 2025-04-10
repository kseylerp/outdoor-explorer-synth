
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GuidePortal: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Guide Portal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Guide Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is where guides can manage their services, content, and interact with travelers.
            Please use the sidebar navigation to access different sections of the portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidePortal;
