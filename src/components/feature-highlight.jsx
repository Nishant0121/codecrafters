import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureHighlight({ icon: Icon, title, description }) {
  return (
    <Card className="feature-card border-muted/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}