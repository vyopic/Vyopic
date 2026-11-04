import { ToolItem } from '../types';

export const TOOLS: ToolItem[] = [
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    shortDescription: 'Compress JPG, PNG & WebP images without losing quality in your browser.',
    fullDescription: 'Reduce image file sizes by up to 90% while keeping high visual quality. All compression happens locally in your browser for maximum speed and complete privacy.',
    path: '/image-compressor',
    iconName: 'Minimize2',
    badge: 'Popular',
    keywords: ['image compressor', 'compress jpg', 'compress png', 'reduce photo size', 'webp optimizer', 'free photo shrinker'],
    metaTitle: 'Free Online Image Compressor – Compress JPG, PNG & WebP | Vyopic',
    metaDescription: 'Compress your images online for free without losing quality. Support for JPG, PNG, and WebP. 100% client-side, fast and secure.',
    features: [
      'Adjust compression quality slider in real time',
      'Supports JPG, PNG, and WebP formats',
      'Instant before & after file size reduction display',
      '100% private - images are processed directly in your device'
    ],
    faqs: [
      {
        question: 'Does compressing images reduce image resolution?',
        answer: 'No, our compressor optimizes image data encoding and quality parameters without altering original pixel dimensions unless you choose to resize.'
      },
      {
        question: 'Is my uploaded photo sent to any server?',
        answer: 'Never! Vyopic processes every file inside your web browser using HTML5 Canvas API. Your photos never leave your device.'
      },
      {
        question: 'Which formats are supported for compression?',
        answer: 'You can compress JPG/JPEG, PNG, and WebP image files directly.'
      }
    ]
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    shortDescription: 'Resize photos to exact pixel width, height, or standard preset ratios.',
    fullDescription: 'Change image dimensions easily. Lock or unlock aspect ratio, or pick popular social media presets for Instagram, YouTube, Facebook, and LinkedIn.',
    path: '/image-resizer',
    iconName: 'Maximize2',
    badge: 'Essential',
    keywords: ['image resizer', 'resize photo', 'change photo dimensions', 'social media crop dimensions', 'pixel resizer'],
    metaTitle: 'Free Online Image Resizer – Resize Photos Easily | Vyopic',
    metaDescription: 'Resize image dimensions in pixels or percentages online for free. Aspect ratio lock and social media dimension presets included.',
    features: [
      'Exact pixel width and height input',
      'Maintain aspect ratio toggle lock',
      'Social media presets (Instagram, YouTube, FB, LinkedIn)',
      'High quality bilinear scaling'
    ],
    faqs: [
      {
        question: 'How do I maintain the aspect ratio when resizing?',
        answer: 'Simply check "Maintain Aspect Ratio". When you change width, the height automatically updates proportionally.'
      },
      {
        question: 'What dimension presets are included?',
        answer: 'Presets for Instagram Posts (1080x1080), Instagram Story (1080x1920), YouTube Thumbnail (1280x720), Facebook Cover (820x312), and LinkedIn Banner (1584x396).'
      }
    ]
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    shortDescription: 'Convert images instantly between JPG, PNG, and WebP formats.',
    fullDescription: 'Switch image formats easily in one click. Convert PNG transparency to JPG with white background, or convert heavy JPG files to modern lightweight WebP.',
    path: '/image-converter',
    iconName: 'Repeat',
    badge: 'Fast',
    keywords: ['image converter', 'jpg to png', 'png to jpg', 'jpg to webp', 'png to webp', 'webp to png'],
    metaTitle: 'Free Online Image Converter – Convert JPG, PNG & WebP | Vyopic',
    metaDescription: 'Convert images between JPG, PNG, and WebP formats instantly in your browser. Free, secure, and fast image format converter.',
    features: [
      'JPG to PNG, PNG to JPG conversion',
      'JPG to WebP, PNG to WebP conversion',
      'WebP to PNG, WebP to JPG conversion',
      'Quality control for lossy conversions'
    ],
    faqs: [
      {
        question: 'Why should I convert my images to WebP?',
        answer: 'WebP provides superior compression and quality compared to JPG and PNG, helping websites load much faster.'
      },
      {
        question: 'What happens to PNG transparency when converted to JPG?',
        answer: 'Since JPG does not support transparent backgrounds, any transparent pixels will be filled with a crisp white background.'
      }
    ]
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    shortDescription: 'Crop unwanted areas from your photos with interactive aspect ratios.',
    fullDescription: 'Crop images precisely with standard aspect ratios like 1:1, 4:3, 16:9, 3:4, 9:16 or freeform drag handles.',
    path: '/image-cropper',
    iconName: 'Crop',
    keywords: ['image cropper', 'crop photo online', 'aspect ratio crop', 'square crop photo', '16:9 crop'],
    metaTitle: 'Free Online Image Cropper – Crop Photos & Images | Vyopic',
    metaDescription: 'Crop images online for free with interactive selection box. Choose 1:1, 4:3, 16:9 aspect ratios or custom freeform cropping.',
    features: [
      'Interactive visual crop box overlay',
      'Standard ratios: Square (1:1), Landscape (16:9), Standard (4:3), Portrait (3:4, 9:16)',
      'Freeform custom rectangle dragging',
      'Instant preview and high-resolution export'
    ],
    faqs: [
      {
        question: 'Can I crop an image into a perfect square for profile photos?',
        answer: 'Yes! Select the 1:1 Square preset and adjust the box position over your subject.'
      }
    ]
  },
  {
    id: 'passport-photo-maker',
    title: 'Passport Photo Maker',
    shortDescription: 'Create standard passport and ID photos with printable grid layouts.',
    fullDescription: 'Turn any portrait image into professional passport and visa photos. Select custom dimensions (mm/cm/inches/px), set background color (white/blue/red), adjust scale, and generate printable A4 sheets.',
    path: '/passport-photo-maker',
    iconName: 'UserCheck',
    badge: 'Popular',
    keywords: ['passport photo maker', 'online id photo', 'passport photo background', 'printable passport photos', 'visa photo generator'],
    metaTitle: 'Free Online Passport Photo Maker – Create Printable ID Photos | Vyopic',
    metaDescription: 'Make passport photos online with background color selection (white, blue, red) and generate printable A4 sheets for custom ID sizes.',
    features: [
      'Custom width & height in mm, cm, inches, or pixels',
      'Background color selector (White, Blue, Red, Custom)',
      'Zoom, rotate, and center alignment controls',
      'Printable grid layout on standard A4 paper size for easy printing',
      'Download single photo or multi-photo sheet'
    ],
    faqs: [
      {
        question: 'How do I choose the right passport photo size for my country?',
        answer: 'Passport dimensions vary by country (e.g. US/US Visa is 2x2 inches / 51x51mm; UK/EU/India is 35x45mm). Use our dimension selectors to specify your exact needed size.'
      },
      {
        question: 'Can I print multiple passport photos on one page?',
        answer: 'Yes! Our tool automatically arranges your passport photo in a printable grid layout on standard A4 sheet paper for easy home or pharmacy printing.'
      }
    ]
  },
  {
    id: 'photo-collage-maker',
    title: 'Photo Collage Maker',
    shortDescription: 'Combine multiple photos into beautiful grid layouts.',
    fullDescription: 'Create stunning photo collages with 2, 3, 4, or 6 image grids. Adjust spacing, border radius, background colors, and photo positioning easily.',
    path: '/photo-collage-maker',
    iconName: 'LayoutGrid',
    keywords: ['photo collage maker', 'combine photos', 'photo grid generator', 'image collage online', 'multi photo collage'],
    metaTitle: 'Free Online Photo Collage Maker – Create Custom Image Grids | Vyopic',
    metaDescription: 'Make beautiful photo collages online with multiple layouts (2, 3, 4, 6 photos). Customize border radius, spacing, and background color.',
    features: [
      'Upload multiple images simultaneously',
      'Layout options for 2, 3, 4, and 6 photo arrangements',
      'Adjust gap spacing and corner border radius sliders',
      'Custom background color picker'
    ],
    faqs: [
      {
        question: 'How many photos can I add to a collage?',
        answer: 'You can combine 2, 3, 4, or 6 photos into clean grid arrangements.'
      }
    ]
  },
  {
    id: 'photo-filters',
    title: 'Photo Filters & Adjustments',
    shortDescription: 'Enhance photos with brightness, contrast, saturation, and color presets.',
    fullDescription: 'Apply professional photo adjustments including Brightness, Contrast, Saturation, Grayscale, Sepia, Blur, and Vintage styling with instant before/after preview.',
    path: '/photo-filters',
    iconName: 'Sliders',
    keywords: ['photo filters', 'adjust photo brightness', 'grayscale filter', 'sepia photo effect', 'photo color editor'],
    metaTitle: 'Free Online Photo Filters & Effects – Enhance Photos | Vyopic',
    metaDescription: 'Apply online photo filters, adjust brightness, contrast, saturation, sepia, grayscale, and blur with side-by-side preview.',
    features: [
      'Sliders for Brightness, Contrast, Saturation, Blur, Hue',
      'One-click presets: Vintage, Sepia, Grayscale, Dramatic, Warm, Cool',
      'Interactive Before/After comparison slider',
      'One-click Reset button'
    ],
    faqs: [
      {
        question: 'Can I compare the edited photo with the original?',
        answer: 'Yes, use the interactive Before/After toggle or slider to see exact visual improvements.'
      }
    ]
  },
  {
    id: 'image-rotator',
    title: 'Image Rotator',
    shortDescription: 'Rotate images by 90 degrees or custom angles smoothly.',
    fullDescription: 'Fix upside down or sideways photos. Rotate images 90° left or right, flip them horizontally or vertically, or dial in exact custom degree rotations.',
    path: '/image-rotator',
    iconName: 'RotateCw',
    keywords: ['image rotator', 'rotate photo online', 'rotate image 90 degrees', 'fix upside down photo'],
    metaTitle: 'Free Online Image Rotator – Rotate & Straighten Photos | Vyopic',
    metaDescription: 'Rotate photos 90 degrees left or right, flip horizontally or vertically, or adjust custom rotation angles online for free.',
    features: [
      'Quick 90° Left and 90° Right rotation buttons',
      'Custom angle slider (-180° to +180°)',
      'Horizontal and vertical flip options',
      'High clarity canvas output'
    ],
    faqs: [
      {
        question: 'How do I fix a photo shot sideways on my phone?',
        answer: 'Upload your photo and click Rotate Right 90° or Rotate Left 90° until it aligns correctly, then download.'
      }
    ]
  },
  {
    id: 'background-color-changer',
    title: 'Background Color Changer',
    shortDescription: 'Change or fill image background color with solid colors.',
    fullDescription: 'Change photo background colors to pure white, black, blue, red, or custom palette colors using background replacement tools.',
    path: '/background-color-changer',
    iconName: 'Palette',
    keywords: ['background color changer', 'change photo background color', 'white background photo', 'blue background id photo'],
    metaTitle: 'Free Online Photo Background Color Changer | Vyopic',
    metaDescription: 'Change photo background color to white, black, blue, red or custom solid colors. Ideal for product photos and ID headshots.',
    features: [
      'Color presets: White, Black, Blue, Red, Custom Color Picker',
      'Adjust tolerance and edge smoothness for precise color replacement',
      'Full resolution download',
      '100% in-browser processing'
    ],
    faqs: [
      {
        question: 'Is this an AI background removal service?',
        answer: 'No, this is a fast browser-based canvas background replacement and fill utility that works reliably without sending photos to cloud AI services.'
      }
    ]
  },
  {
    id: 'image-flipper',
    title: 'Image Flipper',
    shortDescription: 'Flip photos horizontally or vertically in one click.',
    fullDescription: 'Mirror images horizontally (left to right) or vertically (top to bottom). Perfect for selfie mirroring and graphic layout adjustments.',
    path: '/image-flipper',
    iconName: 'FlipHorizontal',
    keywords: ['image flipper', 'flip photo horizontally', 'mirror image online', 'vertical flip photo'],
    metaTitle: 'Free Online Image Flipper – Mirror Images Horizontally & Vertically | Vyopic',
    metaDescription: 'Flip images online for free. Mirror photos horizontally or vertically in a single click with instant preview and fast download.',
    features: [
      'Horizontal flip (mirror selfie view)',
      'Vertical flip (upside down mirror view)',
      'Instant reset button',
      'High-speed instant export'
    ],
    faqs: [
      {
        question: 'Why flip photos horizontally?',
        answer: 'Selfies taken on mobile phones are often saved as inverted mirror images. Flipping horizontally restores the natural perspective.'
      }
    ]
  }
];
