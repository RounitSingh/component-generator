import React from 'react';
import { Button } from './ui/button';

const TailwindTest = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Tailwind CSS & shadcn/ui Test
      </h1>
      
      {/* Test basic Tailwind classes */}
      <div className="space-y-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold text-card-foreground mb-2">
            Basic Tailwind Test
          </h2>
          <p className="text-muted-foreground">
            This should have proper colors and styling from Tailwind CSS.
          </p>
        </div>
        
        {/* Test shadcn/ui Button component */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">shadcn/ui Button Test</h3>
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🎨</Button>
          </div>
        </div>
        
        {/* Test color system */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">
            Primary
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
            Secondary
          </div>
          <div className="p-4 bg-muted text-muted-foreground rounded-lg">
            Muted
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded-lg">
            Accent
          </div>
        </div>
        
        {/* Test dark mode toggle */}
        <div className="p-4 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            Toggle dark mode to test color system changes
          </p>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;