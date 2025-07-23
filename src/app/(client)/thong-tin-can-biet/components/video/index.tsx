// components/VideoComponent.tsx
"use client";

import { useEffect, useRef } from "react";
import { Fullscreen } from "lucide-react";

function VideoComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    }
  };

  useEffect(() => {
    console.log("Video component mounted");
  }, []);

  return (
    <div className="md:col-span-1 relative h-full w-full rounded-lg overflow-hidden">
      <video
        controls
        ref={videoRef}
        className="w-full h-full object-cover"
        src="tvc.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <button
        onClick={handleFullscreen}
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
      >
        <Fullscreen size={20} />
      </button>
    </div>
  );
}

export default VideoComponent;
