
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ModelSelector from '@/components/ModelSelector';
import { ThemeToggle } from '@/components/ThemeToggle';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Separator className="my-4" />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Model Settings</CardTitle>
          <CardDescription>
            Choose which AI model to use for generating trip recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">AI Model Preference</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select which AI model to use for trip recommendations
              </p>
            </div>
            <ModelSelector />
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Model information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Claude</strong>: Anthropic's Claude 3.5 Sonnet model for detailed, nuanced trip recommendations.</li>
              <li><strong>Gemini</strong>: Google's Gemini Pro model for alternative trip planning perspectives.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
