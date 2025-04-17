"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ImageModalProps {
  images: {
    src: string
    alt: string
  }[]
}

export function ImageModal({ images }: ImageModalProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openModal = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {images.map((image, index) => (
          <div key={index}  >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                style={{
                  padding: '0 4px',
                  width: '100px',
                  height: '100px',
                }}
              />

          </div>
        ))}
      </div>
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white p-2"
            >
              <X size={24} />
            </button>
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-h-[90vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}
    </>
  )
}
