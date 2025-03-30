
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface TripCardHeaderProps {
  title: string;
  description: string;
}

const TripCardHeader: React.FC<TripCardHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
      <CardDescription className="mt-1 font-patano text-base text-gray-800">{description}</CardDescription>
    </div>
  );
};

export default TripCardHeader;
