"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FeatureCardProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
  iconColor?: string;
  fallbackEmoji?: string;
}

export function FeatureCard({ iconSrc, iconAlt, title, description, iconColor = "text-orange-500", fallbackEmoji = "📅" }: FeatureCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor} bg-slate-700/50 mb-2 p-2`}>
          {!imageError ? (
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={32}
              height={32}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-2xl">{fallbackEmoji}</span>
          )}
        </div>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-slate-300">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

