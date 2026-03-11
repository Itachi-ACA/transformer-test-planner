"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollyVideoProps {
  totalFrames: number;
}

export default function ScrollyVideo({ totalFrames }: ScrollyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedFrames, setLoadedFrames] = useState(0);
  
  // Create an array of all frame URLs
  const framePaths = useMemo(() => {
    const paths: string[] = [];
    // Folder 1: 001 to 300
    for (let i = 1; i <= 300; i++) {
      const paddedIndex = i.toString().padStart(3, "0");
      paths.push(`/assets/sequence1/ezgif-frame-${paddedIndex}.jpg`);
    }
    // Folder 2: 001 to 300
    for (let i = 1; i <= 300; i++) {
        const paddedIndex = i.toString().padStart(3, "0");
        paths.push(`/assets/sequence2/ezgif-frame-${paddedIndex}.jpg`);
    }
    return paths;
  }, []);

  // Set up highly optimized scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map 0 -> 1 scroll progress to 0 -> 599 frame index
  // Math.max guarantees we don't go out of bounds
  const frameIndexRaw = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  useEffect(() => {
    let isMounted = true;
    
    // Background Image Preloader
    const preloadImages = async () => {
      const loadedImagesArray: HTMLImageElement[] = new Array(totalFrames);
      let count = 0;

      // We load sequentially to guarantee earlier frames exist when scrolling starts
      for (let i = 0; i < totalFrames; i++) {
        if (!isMounted) break;
        
        const img = new Image();
        img.src = framePaths[i];
        
        await new Promise((resolve) => {
          img.onload = () => {
            loadedImagesArray[i] = img;
            count++;
            setLoadedFrames(count);
            // On first frame load, draw it immediately
            if (i === 0 && canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) drawImageCover(ctx, canvasRef.current, img);
            }
            resolve(true);
          };
          img.onerror = () => {
            console.warn(`Failed to track frame ${i}`);
            resolve(false);
          };
        });
      }

      if (isMounted) {
        setImages(loadedImagesArray);
      }
    };

    preloadImages();

    return () => {
      isMounted = false;
    };
  }, [totalFrames, framePaths]);

  // The render logic
  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    // Implement "background-size: cover" for canvas
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetY = 0;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // High performance draw loop tied directly to Framer Motion values
  useMotionValueEvent(frameIndexRaw, "change", (latest) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.floor(latest);
    
    // Safety check - if user scrolls fast and frame isn't loaded yet
    if (images[frameIndex]) {
        // High performance RAF draw
        requestAnimationFrame(() => {
            drawImageCover(ctx, canvas, images[frameIndex]);
        });
    }
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && window) {
        // Use devicePixelRatio for crisp retina drawing
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        
        // Redraw current frame
        const currentIndex = Math.floor(frameIndexRaw.get());
        if (images[currentIndex]) {
           const ctx = canvasRef.current.getContext("2d");
           if (ctx) drawImageCover(ctx, canvasRef.current, images[currentIndex]);
        }
      }
    };

    handleResize(); // Initial setup
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, frameIndexRaw]);

  return (
    // The container height dictates how long the scroll takes. 
    // 350vh means the user has to scroll 3.5 screen heights to finish the sequence.
    <div ref={containerRef} className="relative w-full h-[400vh]">
      {/* Sticky container that holds the canvas exactly in viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ 
             // CSS scales the high-res canvas back down to display size
             width: '100vw', 
             height: '100vh',
             opacity: loadedFrames > 0 ? 1 : 0,
             transition: "opacity 0.5s ease-in-out"
          }}
        />
        
        {/* Loading Overlay */}
        {loadedFrames < Math.min(60, totalFrames) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
             <div className="text-center">
                 <div className="w-12 h-12 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-white/60 font-mono text-xs uppercase tracking-widest">Loading Cinematic Sequence</p>
                 <p className="text-white/30 font-mono text-[10px] mt-2">{Math.round((loadedFrames / totalFrames) * 100)}%</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
