
import React, { useState } from 'react';
import AgentChatComponent from '@/components/agent/AgentChat';
import { Card, CardContent } from '@/components/ui/card';
import { AgentAction } from '@/agents/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AgentChatPage: React.FC = () => {
  const [actionResults, setActionResults] = useState<AgentAction[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAgentAction = (action: AgentAction) => {
    console.log('Agent action received:', action);
    setActionResults(prev => [...prev, action]);
    
    // Handle different action types
    switch (action.type) {
      case 'search':
        toast({
          title: 'Search initiated',
          description: 'Generating trip options based on your request...',
        });
        
        // In a real implementation, this would navigate to results or update the UI
        // For demo purposes, we'll just show a toast
        setTimeout(() => {
          toast({
            title: 'Trip options found',
            description: 'Check out the generated adventures below',
          });
        }, 2000);
        break;
        
      case 'book':
        toast({
          title: 'Booking initiated',
          description: 'Preparing your reservation...',
        });
        break;
        
      case 'save':
        toast({
          title: 'Trip saved',
          description: 'Adventure saved to your profile',
        });
        break;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Adventure Assistant</h1>
      <p className="mb-6 text-gray-600 max-w-3xl">
        Our AI assistant can help you plan trips, answer questions about outdoor activities,
        and even help with bookings. Try asking about hiking trails, campgrounds, or adventure ideas!
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AgentChatComponent 
            onAction={handleAgentAction}
          />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Try asking:</h3>
              <ul className="space-y-2">
                <li className="bg-muted p-2 rounded-md cursor-pointer hover:bg-muted/80">
                  "Find me a weekend hiking trip near Portland"
                </li>
                <li className="bg-muted p-2 rounded-md cursor-pointer hover:bg-muted/80">
                  "What gear do I need for winter camping?"
                </li>
                <li className="bg-muted p-2 rounded-md cursor-pointer hover:bg-muted/80">
                  "Help me book a campground in Yosemite"
                </li>
                <li className="bg-muted p-2 rounded-md cursor-pointer hover:bg-muted/80">
                  "What are the best trails for beginners in Colorado?"
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {actionResults.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2">Agent Activity Log:</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {actionResults.map((action, index) => (
                    <div key={index} className="bg-muted p-2 rounded-md text-sm">
                      <div className="font-medium">{action.type}</div>
                      <div className="text-xs text-muted-foreground">
                        {JSON.stringify(action.payload).substring(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentChatPage;
