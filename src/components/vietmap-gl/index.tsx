"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    vietmapgl: any;
  }
}

interface VietmapGLProps {
  apiKey: string;
  center?: [number, number];
  zoom?: number;
  style?: string;
  width?: string | number;
  height?: string | number;
  markers?: Array<{
    lngLat: [number, number];
    popupHTML?: string;
    popupOptions?: any;
  }>;
  onMapLoaded?: (map: any) => void;
  onMapClick?: (e: any) => void;
  interactive?: boolean;
  attributionControl?: boolean;
  bounds?: [[number, number], [number, number]];
}

export default function VietmapGL({
  apiKey,
  center = [106.69531282536502, 10.776983649766555],
  zoom = 14,
  style = "https://maps.vietmap.vn/mt/tm/style.json?apikey={apiKey}",
  width = "100%",
  height = "500px",
  markers = [],
  onMapLoaded,
  onMapClick,
  interactive = true,
  attributionControl = true,
  bounds,
}: VietmapGLProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const loadVietmapScripts = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") return reject("Window is not defined");

      if (window.vietmapgl) {
        setScriptsLoaded(true);
        return resolve();
      }

      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href =
        "https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.css";
      document.head.appendChild(linkEl);

      const scriptEl = document.createElement("script");
      scriptEl.src =
        "https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.js";
      scriptEl.async = true;
      scriptEl.onload = () => {
        setScriptsLoaded(true);
        resolve();
      };
      scriptEl.onerror = (error) => reject(error);
      document.body.appendChild(scriptEl);
    });
  };

  useEffect(() => {
    loadVietmapScripts().catch((error) =>
      console.error("Failed to load Vietmap scripts:", error)
    );
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded || !mapContainerRef.current || !apiKey) return;

    if (mapInstanceRef.current) {
      // Update center and zoom smoothly instead of recreating the map
      mapInstanceRef.current.easeTo({
        center,
        zoom,
        duration: 1000, // Smooth transition in 1 second
      });

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add new markers
      markers.forEach((marker) => {
        const markerInstance = new window.vietmapgl.Marker()
          .setLngLat(marker.lngLat)
          .addTo(mapInstanceRef.current);

        if (marker.popupHTML) {
          const popupOptions = {
            maxWidth: "400px", // Corrected from 'width' to 'maxWidth'
            ...marker.popupOptions,
          };

          const popup = new window.vietmapgl.Popup(popupOptions).setHTML(
            marker.popupHTML
          );
          markerInstance.setPopup(popup);
        }

        markersRef.current.push(markerInstance);
      });
    } else {
      // Initial map creation
      const styleUrl = style.replace("{apiKey}", apiKey);
      const map = new window.vietmapgl.Map({
        container: mapContainerRef.current,
        style: styleUrl,
        center,
        zoom,
        interactive,
        attributionControl,
      });

      mapInstanceRef.current = map;

      if (onMapClick) {
        map.on("click", onMapClick);
      }

      map.on("load", () => {
        markers.forEach((marker) => {
          const markerInstance = new window.vietmapgl.Marker()
            .setLngLat(marker.lngLat)
            .addTo(map);

          if (marker.popupHTML) {
            const popupOptions = {
              maxWidth: "400px",
              ...marker.popupOptions,
            };

            const popup = new window.vietmapgl.Popup(popupOptions).setHTML(
              marker.popupHTML
            );
            markerInstance.setPopup(popup);
          }

          markersRef.current.push(markerInstance);
        });

        if (onMapLoaded) {
          onMapLoaded(map);
        }

        if (bounds) {
          map.fitBounds(bounds, { padding: 20 });
        }
      });
    }
  }, [
    scriptsLoaded,
    apiKey,
    center,
    zoom,
    style,
    markers,
    onMapLoaded,
    onMapClick,
    interactive,
    attributionControl,
  ]);

  // Update bounds when bounds prop changes
  useEffect(() => {
    if (mapInstanceRef.current && bounds) {
      mapInstanceRef.current.fitBounds(bounds, { padding: 20 });
    }
  }, [bounds]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
