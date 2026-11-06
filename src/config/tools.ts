import { ToolItem } from '../types';

export const TOOLS: ToolItem[] = [
  {
    id: 'ai-cartoon-avatar',
    title: 'AI Cartoon Avatar Maker',
    shortDescription: 'Transform your photos into 6 stunning cartoon avatar styles with Cloudflare Workers AI.',
    fullDescription: 'Convert your selfies and portraits into eye-catching cartoon avatars using Cloudflare Workers AI and FLUX.2 Klein 4B. Choose from 6 artistic styles: Cute Cartoon, Hand Drawn, Cool Sunglasses, Glasses Avatar, Anime Illustration, and Minimalist Portrait with instant before & after preview.',
    path: '/ai-cartoon-avatar',
    iconName: 'Wand2',
    badge: 'New AI',
    keywords: [
      'ai cartoon avatar maker',
      'cartoon photo maker',
      'cloudflare workers ai avatar',
      'flux 2 klein 4b avatar',
      'photo to cartoon',
      'anime avatar generator',
      'avatar maker free'
    ],
    metaTitle: 'Free AI Cartoon Avatar Maker – FLUX.2 Klein 4B | Vyopic',
    metaDescription: 'Transform your photos into 6 unique cartoon avatar styles with Cloudflare Workers AI FLUX.2 Klein 4B. 100% free with interactive before/after preview & HD download.',
    features: [
      'Powered by Cloudflare Workers AI (@cf/black-forest-labs/flux-2-klein-4b)',
      '6 Handcrafted Styles: Cute Cartoon, Hand Drawn, Cool Sunglasses, Glasses Avatar, Anime & Minimalist',
      'Interactive Before & After slider comparison',
      'Instant Drag & Drop photo upload up to 5MB with auto 512×512 optimization',
      'High-resolution PNG download with commercial readiness',
      'Ultra-fast 4-step neural distilled inference'
    ],
    faqs: [
      {
        question: 'Which AI model powers the cartoon avatar generator?',
        answer: 'It is powered by Cloudflare Workers AI using the Black Forest Labs FLUX.2 Klein 4B distilled model (@cf/black-forest-labs/flux-2-klein-4b).'
      },
      {
        question: 'What avatar styles are available?',
        answer: 'You can choose between Hand Drawn Cartoon, Cute Cartoon, Cool Sunglasses, Glasses Avatar, Anime Illustration, and Minimalist Portrait.'
      },
      {
        question: 'Is it free to generate and download avatars?',
        answer: 'Yes! All cartoon avatars created on Vyopic are completely free to preview and download in high-resolution PNG format.'
      }
    ]
  },
  {
    id: 'name-brand-logo',
    title: 'Name Brand Logo Maker',
    shortDescription: 'Create professional brand logos with 50 customizable templates in 16 sizes.',
    fullDescription: 'Design professional logos for your brand, business, gaming channel, or startup in seconds. Choose from 50 distinctive templates across 10 categories, customize typography, shapes, colors, and export watermark-free high-res PNGs and JPGs in 16 standard industry sizes.',
    path: '/name-brand-logo',
    iconName: 'Crown',
    badge: 'Featured',
    keywords: ['name brand logo maker', 'free logo generator', 'business logo maker', 'minimal logo design', 'gaming logo creator', 'brand identity designer'],
    metaTitle: 'Free Name Brand Logo Maker – 50 Logo Templates & 16 Sizes | Vyopic',
    metaDescription: 'Create custom brand logos online for free. 50 handcrafted templates in Minimal, Luxury, Gaming, Business, Vintage & Emblem styles. Export in 16 HD sizes with transparent PNG.',
    features: [
      '50 Distinct Handcrafted Templates across 10 Curated Categories',
      'Real-time Name & Tagline auto-sizing generator',
      'Full styling customization: Colors, Backgrounds, Fonts, Spacing, and Frames',
      'Transparent background PNG and high-resolution JPG output',
      '16 Standard Industry Sizes: Ultra HD (2048x2048), Favicon, Social, Website Header',
      'History controls: Undo, Redo, and Reset design'
    ],
    faqs: [
      {
        question: 'Are the generated logos watermark-free?',
        answer: 'Yes! All logos created with Vyopic are 100% free and exported without any watermarks or hidden fees.'
      },
      {
        question: 'What sizes can I download my logo in?',
        answer: 'You can export in 16 preset sizes including Favicon (32x32), Small (256x256), Standard (512x512), HD (1024x1024), Ultra HD (2048x2048), Website Header (800x300), and all social media profile sizes.'
      },
      {
        question: 'Can I export a logo with a transparent background?',
        answer: 'Yes! Simply toggle the "Transparent Background" option and download a clean PNG file.'
      }
    ]
  },
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
  },

  // 10 NEW FEATURES
  {
    id: 'background-remover',
    title: 'AI Background Remover',
    shortDescription: 'Remove photo backgrounds automatically and create transparent PNGs.',
    fullDescription: 'Isolate subjects and automatically remove background clutter from portraits, products, and graphics. Fast, 100% private in-browser edge detection with tolerance adjustments.',
    path: '/background-remover',
    iconName: 'Scissors',
    badge: 'AI Powered',
    keywords: ['background remover', 'ai background removal', 'transparent background png', 'cutout image online', 'remove bg free'],
    metaTitle: 'Free Online AI Background Remover – Transparent PNG Cutouts | Vyopic',
    metaDescription: 'Remove photo backgrounds automatically in your browser. Create transparent PNG cutouts for portraits and product photos with zero server upload.',
    features: [
      'Smart edge and color segmentation engine',
      'Color keying and tolerance threshold controls',
      'Feathering and edge smoothing for natural results',
      'Download clean high-resolution transparent PNG'
    ],
    faqs: [
      {
        question: 'Are my photos uploaded to an AI cloud server?',
        answer: 'No. The intelligent segmentation runs directly inside your web browser on your device, ensuring maximum privacy.'
      },
      {
        question: 'Can I choose which color to remove?',
        answer: 'Yes! You can auto-detect the background color or click any sample point on the photo to isolate and erase.'
      }
    ]
  },
  {
    id: 'image-upscaler',
    title: 'AI Image Upscaler',
    shortDescription: 'Upscale low-resolution photos to 2x or 4x without pixelation.',
    fullDescription: 'Enhance image fidelity and upscale low-resolution photos up to 400%. Uses high-precision bicubic interpolation and edge sharpening algorithms locally.',
    path: '/image-upscaler',
    iconName: 'Sparkles',
    badge: 'New',
    keywords: ['image upscaler', 'ai image upscaler', 'enlarge photo without quality loss', 'increase image resolution', 'photo upscaler online'],
    metaTitle: 'Free Online AI Image Upscaler – Enlarge Photos 2x & 4x | Vyopic',
    metaDescription: 'Upscale low-resolution images 2x and 4x online for free. Sharpen edges, reduce artifacts, and boost clarity in your browser.',
    features: [
      '2x (200%) and 4x (400%) scaling options',
      'Adaptive edge sharpening and detail recovery',
      'Noise suppression and smoothing',
      'Side-by-side zoomed comparison'
    ],
    faqs: [
      {
        question: 'What is the maximum upscale resolution?',
        answer: 'You can upscale photos up to 4x (400%) of original width and height while maintaining crisp details.'
      }
    ]
  },
  {
    id: 'photo-enhancer',
    title: 'AI Photo Enhancer',
    shortDescription: 'One-click auto-enhance to balance lighting, colors, and sharpness.',
    fullDescription: 'Instantly revitalize dull photos. Automatically calculates optimal histogram levels, dynamic contrast, vibrance, tone warmth, and edge clarity.',
    path: '/photo-enhancer',
    iconName: 'Wand2',
    badge: 'Popular',
    keywords: ['photo enhancer', 'ai photo enhancer', 'auto enhance image', 'fix dark photo', 'improve photo quality'],
    metaTitle: 'Free Online AI Photo Enhancer – Auto Balance & Enhance Photos | Vyopic',
    metaDescription: 'Auto-enhance lighting, colors, sharpness and contrast in 1-click. Fix underexposed and washed out photos instantly in your browser.',
    features: [
      'One-click intelligent auto balance',
      'Smart exposure and shadow recovery',
      'Clarity, vibrance, and micro-contrast boost',
      'Interactive before/after comparison slider'
    ],
    faqs: [
      {
        question: 'How does the auto enhancer work?',
        answer: 'It analyzes the color histogram of your image to expand dynamic range, lift crushed shadows, and sharpen soft edges.'
      }
    ]
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    shortDescription: 'Convert one or multiple images into a clean, printable PDF document.',
    fullDescription: 'Merge single or multiple photos (JPG, PNG, WebP) into an organized PDF document. Customize page orientation, paper size (A4, Letter), and margins.',
    path: '/image-to-pdf',
    iconName: 'FileText',
    badge: 'Productivity',
    keywords: ['image to pdf', 'convert jpg to pdf', 'png to pdf converter', 'combine photos to pdf', 'photo to pdf free'],
    metaTitle: 'Free Online Image to PDF Converter – Combine Photos to PDF | Vyopic',
    metaDescription: 'Convert JPG, PNG, and WebP images to PDF document online. Set A4/Letter size, page margins, and download high-quality PDFs instantly.',
    features: [
      'Multi-image batch support (re-order, add, remove)',
      'Page formats: A4, Letter, Fit to Image',
      'Portrait and Landscape page orientation',
      'Custom margin spacing (None, Small, Normal)'
    ],
    faqs: [
      {
        question: 'Can I combine multiple pictures into one PDF file?',
        answer: 'Yes! Upload multiple images at once and generate a single multi-page PDF document.'
      }
    ]
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    shortDescription: 'Extract and render PDF pages as high-resolution JPG or PNG images.',
    fullDescription: 'Convert PDF documents into separate crisp image files. Preview all pages, choose rendering DPI resolution, and download single pages or all images.',
    path: '/pdf-to-image',
    iconName: 'FileImage',
    badge: 'Utility',
    keywords: ['pdf to image', 'convert pdf to jpg', 'pdf to png online', 'extract images from pdf', 'pdf page to picture'],
    metaTitle: 'Free Online PDF to Image Converter – Convert PDF to JPG & PNG | Vyopic',
    metaDescription: 'Convert PDF pages to high-resolution JPG and PNG images online. Completely private in-browser rendering with zero server upload.',
    features: [
      'Client-side PDF rendering with PDF.js',
      'Export pages as JPG or PNG',
      'Choose output quality and zoom scale (1x, 2x, 3x)',
      'Preview all pages with one-click individual or batch downloads'
    ],
    faqs: [
      {
        question: 'Are my confidential PDF documents safe?',
        answer: '100% safe! PDF documents are parsed in your browser memory and are never uploaded to any remote server.'
      }
    ]
  },
  {
    id: 'image-watermark',
    title: 'Image Watermark Maker',
    shortDescription: 'Add custom text or logo watermarks with opacity and position controls.',
    fullDescription: 'Protect your original photography and copyright. Add customizable text watermarks, logo stamps, tile repeat patterns, opacity controls, and custom fonts.',
    path: '/image-watermark',
    iconName: 'Stamp',
    keywords: ['image watermark maker', 'add watermark to photo', 'watermark photo online', 'protect photo copyright', 'stamp logo on image'],
    metaTitle: 'Free Online Image Watermark Maker – Protect Photos with Watermarks | Vyopic',
    metaDescription: 'Add custom text and logo watermarks to your photos online. Control opacity, font size, rotation, 9-point placement, or tile grid patterns.',
    features: [
      'Text watermark with custom font, color, size, and rotation',
      'Logo image watermark stamp overlay',
      '9-point grid alignment (center, corners, edges) or full tile repeat',
      'Smooth opacity slider (0% to 100%)'
    ],
    faqs: [
      {
        question: 'Can I add a repeating tiled watermark across the entire photo?',
        answer: 'Yes! Select the "Tile / Pattern" mode to repeat your text or logo watermark diagonally across the whole picture.'
      }
    ]
  },
  {
    id: 'object-remover',
    title: 'AI Object Remover',
    shortDescription: 'Brush over unwanted objects, people, or blemishes to erase them.',
    fullDescription: 'Erase tourists, telephone wires, unwanted objects, or skin blemishes with an interactive eraser brush that blends surrounding pixel textures.',
    path: '/object-remover',
    iconName: 'Eraser',
    badge: 'Magic',
    keywords: ['object remover', 'ai object remover', 'erase unwanted object from photo', 'remove person from photo', 'photo blemish eraser'],
    metaTitle: 'Free Online AI Object Remover – Erase Unwanted Objects | Vyopic',
    metaDescription: 'Brush over and erase unwanted objects, wires, text, or photobombers from your pictures. Free client-side texture inpainting.',
    features: [
      'Interactive brush canvas with size and feather sliders',
      'Smart content-aware inpainting using neighborhood sampling',
      'Undo/Redo mask brush history',
      'Instant before & after comparison'
    ],
    faqs: [
      {
        question: 'How do I erase an object from a photo?',
        answer: 'Upload your photo, adjust the brush size, paint over the unwanted object, and click "Erase Object".'
      }
    ]
  },
  {
    id: 'meme-generator',
    title: 'Meme Generator',
    shortDescription: 'Create viral memes with top and bottom impact text or modern templates.',
    fullDescription: 'Design funny memes in seconds. Add classic bold impact top/bottom text with black outlines, customize text colors, or choose popular meme templates.',
    path: '/meme-generator',
    iconName: 'Smile',
    badge: 'Fun',
    keywords: ['meme generator', 'online meme maker', 'create meme free', 'impact font meme', 'custom photo meme'],
    metaTitle: 'Free Online Meme Generator – Create Funny Memes Instantly | Vyopic',
    metaDescription: 'Create custom viral memes online with classic top/bottom impact text, custom stickers, text styles, and instant high-res image download.',
    features: [
      'Top and Bottom text fields with uppercase toggle',
      'Custom font size, color, stroke outline thickness',
      'Includes classic meme starter templates or upload your own',
      'Direct social media ready JPG/PNG export'
    ],
    faqs: [
      {
        question: 'Can I upload my own pictures for memes?',
        answer: 'Yes! You can upload any personal photo or choose from built-in popular blank templates.'
      }
    ]
  },
  {
    id: 'image-metadata',
    title: 'Image Metadata Viewer',
    shortDescription: 'View and inspect EXIF metadata, camera info, resolution, and GPS data.',
    fullDescription: 'Inspect hidden details in your photos including camera make, model, lens, shutter speed, ISO, aperture, dimensions, color space, file size, and creation date.',
    path: '/image-metadata',
    iconName: 'Info',
    badge: 'Inspect',
    keywords: ['image metadata viewer', 'exif data viewer online', 'view photo metadata', 'camera info inspector', 'photo date and resolution'],
    metaTitle: 'Free Online Image Metadata & EXIF Viewer | Vyopic',
    metaDescription: 'View hidden EXIF metadata, camera settings, lens model, date created, resolution, color space, and technical properties of your photos.',
    features: [
      'Detailed EXIF header parser (Camera, Lens, ISO, Aperture, Exposure)',
      'Image technical properties (Width, Height, Aspect Ratio, Megapixels, Color Type)',
      'Export metadata as JSON or text report',
      'Option to export clean copy with all EXIF metadata stripped for privacy'
    ],
    faqs: [
      {
        question: 'Can I strip metadata from my photos for privacy?',
        answer: 'Yes! Our tool allows you to save a cleaned version of your photo with all identifying EXIF and GPS tags removed.'
      }
    ]
  },
  {
    id: 'qr-code-generator',
    title: 'QR Code Image Generator',
    shortDescription: 'Generate custom QR code images for URLs, text, Wi-Fi, and contacts.',
    fullDescription: 'Create crisp, high-resolution QR codes for websites, plain text, Wi-Fi passwords, emails, and phone numbers. Customize foreground and background colors.',
    path: '/qr-code-generator',
    iconName: 'QrCode',
    badge: 'Utility',
    keywords: ['qr code generator', 'create qr code online', 'custom qr code maker', 'wifi qr code', 'high resolution qr code'],
    metaTitle: 'Free Online QR Code Image Generator – Custom Colors & High Res | Vyopic',
    metaDescription: 'Generate custom high-resolution QR code images for links, text, and Wi-Fi. Customize colors, error correction, and download PNG/SVG.',
    features: [
      'Support for URLs, Text, Wi-Fi, Phone, Email, and SMS',
      'Custom foreground and background color pickers',
      'Configurable error correction levels (Low, Medium, Quartile, High)',
      'Export as high-resolution PNG or SVG vector'
    ],
    faqs: [
      {
        question: 'Do the generated QR codes expire?',
        answer: 'No! These are standard static QR codes that contain your data directly and never expire.'
      }
    ]
  },

  // 4 NEW REQUESTED FEATURES
  {
    id: 'ai-profile-picture',
    title: 'AI Profile Picture Maker',
    shortDescription: 'Create professional avatars & profile pictures with background styles and frames.',
    fullDescription: 'Transform any selfie or portrait into high-converting avatars for LinkedIn, Business, Gaming, Instagram, and Creative portfolios. Choose from curated aesthetic backgrounds, circular frames, lighting effects, and color themes.',
    path: '/ai-profile-picture',
    iconName: 'User',
    badge: 'Popular',
    keywords: ['profile picture maker', 'ai pfp maker', 'linkedin avatar generator', 'gaming avatar', 'instagram profile photo', 'professional headshot maker'],
    metaTitle: 'Free AI Profile Picture Maker – Professional Avatars & PFP | Vyopic',
    metaDescription: 'Create professional profile pictures for LinkedIn, Instagram, Gaming, and Business online for free. Custom backgrounds, frames, lighting, and HD download.',
    features: [
      'Categories: Professional, Business, Gaming, Facebook, Instagram, LinkedIn, Creative',
      'Curated ready-made gradient & solid backdrop styles',
      'Circular, rounded square & neon ring aesthetic frames',
      'Fine-tuned background contrast, saturation, and blur adjustments',
      '100% private in-browser HD avatar export'
    ],
    faqs: [
      {
        question: 'Are my uploaded selfies safe?',
        answer: 'Yes! Vyopic processes everything inside your local web browser using HTML5 Canvas. Your photos are never sent to external servers or stored.'
      },
      {
        question: 'What sizes are the generated profile pictures?',
        answer: 'The avatars are exported in 1:1 HD square format (1000x1000px), perfect for LinkedIn, Instagram, Discord, and Google accounts.'
      }
    ]
  },
  {
    id: 'photo-to-sketch',
    title: 'AI Photo to Sketch',
    shortDescription: 'Convert photos into artistic pencil sketches, colored drawings & portraits.',
    fullDescription: 'Turn your pictures into handcrafted artwork in seconds. Choose from Pencil Sketch, Color Sketch, Portrait Sketch, Cartoon Sketch, and Black & White artistic drawing styles with intensity tuning.',
    path: '/photo-to-sketch',
    iconName: 'Pencil',
    badge: 'Artistic',
    keywords: ['photo to sketch', 'ai sketch maker', 'pencil sketch effect online', 'turn photo into drawing', 'convert image to sketch free'],
    metaTitle: 'Free AI Photo to Sketch Converter – Pencil, Color & Portrait Sketch | Vyopic',
    metaDescription: 'Convert photos to pencil sketch, color sketch, portrait sketch, and cartoon drawings online for free with real-time Before & After comparison.',
    features: [
      '5 Artistic Sketch Modes: Pencil, Color, Portrait, Cartoon, Black & White',
      'Interactive effect intensity & edge detail sliders',
      'Hold-to-view Before & After comparison',
      'One-click instant HD sketch download'
    ],
    faqs: [
      {
        question: 'How does the sketch conversion work?',
        answer: 'Our algorithm performs edge detection, color desaturation, color dodge inversion, and contrast mapping in your browser to simulate authentic pencil strokes.'
      }
    ]
  },
  {
    id: 'ai-photo-booth',
    title: 'AI Photo Booth',
    shortDescription: 'Style your pictures with retro film, vintage photobooth frames & themes.',
    fullDescription: 'Bring the fun of classic and modern photo booths to your browser! Choose from Vintage, Passport, Professional, Funny, Cartoon, Retro, and Artistic photo booth themes with realistic multi-strip frames.',
    path: '/ai-photo-booth',
    iconName: 'Camera',
    badge: 'Trending',
    keywords: ['ai photo booth', 'online photobooth', 'vintage photo strip maker', 'retro photobooth online', 'free photo booth frames'],
    metaTitle: 'Free AI Photo Booth Online – Vintage, Retro & Strip Frames | Vyopic',
    metaDescription: 'Experience an online AI photo booth with Vintage, Retro, Passport, Funny, and Artistic themes. Customize borders, frames, and download photo strips.',
    features: [
      '7 Signature Styles: Vintage, Passport, Professional, Funny, Cartoon, Retro, Artistic',
      'Classic 3-in-1 photobooth strip & polaroid border options',
      'Date stamp, stickers, and grain texture overlays',
      'High-resolution multi-frame export'
    ],
    faqs: [
      {
        question: 'Can I create vertical photo strips like physical booths?',
        answer: 'Yes! Select the Classic Strip layout to generate vertical photo strips complete with vintage borders and date stamps.'
      }
    ]
  },
  {
    id: 'ai-poster-maker',
    title: 'AI Social Media Poster Maker',
    shortDescription: 'Design eye-catching social media posters, banners & story flyers.',
    fullDescription: 'Create viral posters, announcements, and marketing flyers in minutes. Preset standard dimensions for Facebook, Instagram Post/Story, YouTube Thumbnails, and Web Banners with custom text, branding, and layouts.',
    path: '/ai-poster-maker',
    iconName: 'LayoutTemplate',
    badge: 'Design',
    keywords: ['social media poster maker', 'ai poster maker', 'instagram story flyer maker', 'youtube thumbnail maker', 'facebook post design online'],
    metaTitle: 'Free AI Social Media Poster Maker – Instagram, Facebook & YouTube | Vyopic',
    metaDescription: 'Design stunning social media posters, flyers, and banners with customizable text, badges, photo overlays, and standard platform presets.',
    features: [
      'Platform Dimensions: Facebook Post, Instagram Post, Instagram Story, YouTube Thumbnail, Banner',
      'Custom typography with editable colors, shadow, font scale & position',
      'Logo & brand sticker overlay support',
      'Live visual preview with PNG & JPG high-res downloads'
    ],
    faqs: [
      {
        question: 'What social media dimensions are supported?',
        answer: 'Presets include Facebook Post (1200x630), Instagram Post (1080x1080), Instagram Story (1080x1920), YouTube Thumbnail (1280x720), and Banner (1200x500).'
      }
    ]
  }
];
