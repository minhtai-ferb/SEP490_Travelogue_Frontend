"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, Image as AntImage } from "antd"

interface MediaItem {
  mediaUrl: string
  fileName: string
  fileType: string | null
  isThumbnail: boolean
  sizeInBytes: number
  createdTime: string
}

interface ImageGalleryProps {
  medias: MediaItem[]
  locationName: string
}

export function ImageGallery({ medias, locationName }: ImageGalleryProps) {
  if (!medias || medias.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Carousel autoplay className="rounded-lg overflow-hidden">
          {medias.map((media, index) => (
            <div key={index} className="relative h-96">
              <AntImage
                src={media.mediaUrl}
                alt={`${locationName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                preview={{
                  mask: <div className="bg-black bg-opacity-50 text-white">Click to preview</div>,
                }}
              />
            </div>
          ))}
        </Carousel>
      </CardContent>
    </Card>
  )
}
