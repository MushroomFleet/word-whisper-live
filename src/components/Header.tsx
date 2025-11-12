import React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Coffee } from 'lucide-react';

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
  const linkClass = cn(
    "transition-colors hover:text-primary",
    "theme-retro:hover:text-green-400 theme-retro:hover:text-glow"
  );

  const menuItemClass = cn(
    navigationMenuTriggerStyle(),
    "bg-transparent hover:bg-accent hover:text-accent-foreground",
    "theme-retro:font-mono theme-retro:text-green-400 theme-retro:hover:text-glow"
  );

  return (
    <header className={cn("flex items-center justify-between mb-8 px-4 py-4 border-b border-border/40", className)}>
      {/* Left Side - Logo/Title */}
      <a 
        href="https://www.scuffedepoch.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn(
          "text-2xl md:text-3xl font-bold tracking-tight",
          "theme-retro:text-glow theme-retro:font-mono",
          linkClass
        )}
      >
        CarelessLive
      </a>

      {/* Right Side - Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap gap-1">
          <NavigationMenuItem>
            <a 
              href="https://vestig.oragenai.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <NavigationMenuLink className={menuItemClass}>
                News
              </NavigationMenuLink>
            </a>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <a 
              href="https://www.scuffedepoch.com/radio.html" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <NavigationMenuLink className={menuItemClass}>
                Radio
              </NavigationMenuLink>
            </a>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <a 
              href="https://gallery.scuffedepoch.com/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <NavigationMenuLink className={menuItemClass}>
                Gallery
              </NavigationMenuLink>
            </a>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(
              menuItemClass,
              "theme-retro:data-[state=open]:text-glow"
            )}>
              MORE
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={cn(
                "grid w-48 gap-1 p-2 bg-popover border border-border shadow-lg z-50",
                "theme-retro:bg-black theme-retro:border-green-500/30"
              )}>
                <li>
                  <a 
                    href="https://careless.oragenai.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      "theme-retro:font-mono theme-retro:text-green-400 theme-retro:hover:text-glow theme-retro:hover:bg-green-500/10"
                    )}
                  >
                    Careless
                  </a>
                </li>
                <li>
                  <a 
                    href="https://cognition.oragenai.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      "theme-retro:font-mono theme-retro:text-green-400 theme-retro:hover:text-glow theme-retro:hover:bg-green-500/10"
                    )}
                  >
                    Cognition
                  </a>
                </li>
                <li>
                  <a 
                    href="https://spittoon.oragenai.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      "theme-retro:font-mono theme-retro:text-green-400 theme-retro:hover:text-glow theme-retro:hover:bg-green-500/10"
                    )}
                  >
                    Spittoon
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.oragenai.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      "theme-retro:font-mono theme-retro:text-green-400 theme-retro:hover:text-glow theme-retro:hover:bg-green-500/10"
                    )}
                  >
                    ALL APPS
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <a 
              href="https://ko-fi.com/driftjohnson" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <NavigationMenuLink className={cn(
                menuItemClass,
                "flex items-center gap-1.5"
              )}>
                <Coffee className="h-4 w-4" />
                <span className="hidden sm:inline">Ko-fi</span>
              </NavigationMenuLink>
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};