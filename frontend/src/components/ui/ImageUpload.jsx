import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import imageCompression from 'browser-image-compression'

export function ImageUpload({ maxImages = 4, maxSizeMB = 2, onImagesChange }) {
  const [images, setImages] = useState([])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > maxImages) {
      toast.error(`Maksimal ${maxImages} foto yang diizinkan.`)
      return
    }

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1200,
      useWebWorker: true
    }

    const newImages = []

    for (const file of files) {
      try {
        const compressedFile = await imageCompression(file, options)
        const reader = new FileReader()
        
        await new Promise((resolve) => {
          reader.onloadend = () => {
            newImages.push(reader.result)
            resolve()
          }
          reader.readAsDataURL(compressedFile)
        })
      } catch (error) {
        console.error("Error compressing image:", error)
        toast.error(`Gagal memproses gambar ${file.name}. Silakan coba gambar lain.`)
      }
    }

    if (newImages.length > 0) {
      setImages(prev => {
        const updated = [...prev, ...newImages].slice(0, maxImages)
        onImagesChange(updated)
        return updated
      })
    }
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => {
      const updated = prev.filter((_, index) => index !== indexToRemove)
      onImagesChange(updated)
      return updated
    })
  }

  return (
    <div className="space-y-4">
      <Input 
        id="images" 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleImageUpload} 
        disabled={images.length >= maxImages}
      />
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-4">
          {images.map((src, idx) => (
            <div key={`upload-${idx}-${Date.now()}`} className="relative group">
              <img 
                src={src} 
                alt={`Preview ${idx+1}`} 
                className="object-cover w-full h-24 border rounded-md" 
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 flex items-center justify-center w-6 h-6"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
