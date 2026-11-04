export interface ToolItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  path: string;
  iconName: string;
  badge?: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  features: string[];
}

export interface UploadedImage {
  file: File;
  src: string;
  name: string;
  width: number;
  height: number;
  size: number; // in bytes
  type: string; // image/jpeg, image/png, image/webp
}

export interface AdSenseProps {
  slotId?: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
  label?: string;
}
