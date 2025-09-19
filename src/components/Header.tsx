import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  projectName: string;
  theme: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  projectName, 
  theme,
  className 
}) => {
  return (
    <header className={cn("text-center mb-8", className)}>
      <h1 className={cn(
        "text-4xl font-bold mb-2 tracking-tight",
        "theme-retro:text-glow theme-retro:font-mono"
      )}>
        CarelessLive
      </h1>
      <div className={cn(
        "text-lg text-muted-foreground mb-1",
        "theme-retro:text-green-400/80 theme-retro:font-mono"
      )}>
        {projectName}
      </div>
      <div className={cn(
        "text-sm text-muted-foreground/70",
        "theme-retro:text-green-600 theme-retro:font-mono theme-retro:tracking-wider"
      )}>
        Zero-data speech-to-text transcription
      </div>
      
      {/* Subtle theme indicator */}
      <div className={cn(
        "mt-4 w-16 h-px mx-auto",
        theme === 'retro-console' 
          ? "bg-gradient-to-r from-transparent via-green-500 to-transparent"
          : "bg-gradient-to-r from-transparent via-primary to-transparent"
      )} />
    </header>
  );
};