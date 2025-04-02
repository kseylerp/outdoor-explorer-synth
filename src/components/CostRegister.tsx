
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CostRegisterProps {
  totalTokensUsed: number;
  tokenCostRate: number;
  totalCost: number;
}

const CostRegister: React.FC<CostRegisterProps> = ({ 
  totalTokensUsed, 
  tokenCostRate, 
  totalCost 
}) => {
  return (
    <Card className="mt-4 bg-slate-50 border-t-4 border-t-purple-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            API Cost Tracker
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs max-w-xs">
                    Tracks the usage cost of AI recommendations with Claude 3 Haiku.
                    Rate: ${(tokenCostRate * 1000).toFixed(5)} per 1K tokens.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            Claude 3 Haiku
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-gray-500 text-xs">Tokens Used</p>
            <p className="font-medium">{totalTokensUsed.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-gray-500 text-xs">Token Rate</p>
            <p className="font-medium">${(tokenCostRate * 1000).toFixed(5)}/1K</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-gray-500 text-xs">Total Cost</p>
            <p className="font-medium">${totalCost.toFixed(6)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostRegister;
