import React from 'react';
import {
  Minimize2,
  Maximize2,
  Repeat,
  Crop,
  UserCheck,
  LayoutGrid,
  Sliders,
  RotateCw,
  Palette,
  FlipHorizontal,
  Image as ImageIcon
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Repeat':
      return <Repeat className={className} />;
    case 'Crop':
      return <Crop className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'RotateCw':
      return <RotateCw className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'FlipHorizontal':
      return <FlipHorizontal className={className} />;
    default:
      return <ImageIcon className={className} />;
  }
};
