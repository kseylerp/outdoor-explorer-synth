
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GuideRecommendations from './guide/GuideRecommendations';
import GuideServices from './guide/GuideServices';
import GuideContent from './guide/GuideContent';
import GuideProfile from './guide/GuideProfile';
import GuideAnalytics from './guide/GuideAnalytics';

const GuidePortal = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Guide Portal</h1>
      
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Manage Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <GuideRecommendations />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Manage Services</CardTitle>
            </CardHeader>
            <CardContent>
              <GuideServices />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Create Content</CardTitle>
            </CardHeader>
            <CardContent>
              <GuideContent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Guide Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <GuideProfile />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <GuideAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuidePortal;
