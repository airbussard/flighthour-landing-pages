'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button, Card } from '@eventhour/ui'

interface ExperienceImage {
  id?: string
  filename: string
  altText?: string
  sortOrder?: number
  isNew?: boolean
}

interface ImageUploadProps {
  experienceId?: string
  images: ExperienceImage[]
  onImagesChange: (images: ExperienceImage[]) => void
}

export default function ImageUpload({ experienceId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (!experienceId) {
      alert('Bitte speichern Sie das Erlebnis zuerst, bevor Sie Bilder hochladen.')
      return
    }

    setUploading(true)
    const newImages: ExperienceImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`Die Datei ${file.name} ist kein Bild.`)
        continue
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Die Datei ${file.name} ist zu groß. Maximal 5MB erlaubt.`)
        continue
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('experienceId', experienceId)

      try {
        const response = await fetch(`/api/admin/experiences/${experienceId}/images`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload fehlgeschlagen')
        }

        const data = await response.json()
        console.log('Upload response:', data)
        newImages.push({
          filename: data.filename,
          altText: data.altText || file.name.replace(/\.[^/.]+$/, ''),
          sortOrder: data.sortOrder ?? (images.length + i),
          id: data.id,
          isNew: true
        })
      } catch (error) {
        console.error('Upload error:', error)
        alert(`Fehler beim Hochladen von ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages])
    }
    setUploading(false)
  }

  const handleRemoveImage = async (index: number) => {
    const image = images[index]
    
    if (image.id && experienceId) {
      // Delete from server if it's an existing image
      try {
        const response = await fetch(`/api/admin/experiences/${experienceId}/images/${image.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Löschen fehlgeschlagen')
        }
      } catch (error) {
        console.error('Delete error:', error)
        alert('Fehler beim Löschen des Bildes')
        return
      }
    }

    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    
    // Update sort order
    newImages.forEach((img, index) => {
      img.sortOrder = index
    })
    
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-eventhour-yellow bg-yellow-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          {uploading ? (
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
          )}
          
          <p className="text-lg font-medium mb-2">
            {dragActive
              ? 'Bilder hier ablegen'
              : 'Bilder hierher ziehen oder klicken zum Auswählen'
            }
          </p>
          <p className="text-sm text-gray-500 mb-4">
            JPG, PNG oder GIF - Max. 5MB pro Bild
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Bilder auswählen
          </Button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={image.filename} className="relative group overflow-hidden">
              <div className="aspect-square bg-gray-100">
                {image.filename.startsWith('http') || image.filename.startsWith('/') ? (
                  <img
                    src={image.filename}
                    alt={image.altText || `Bild ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ←
                  </Button>
                )}
                {index < images.length - 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    →
                  </Button>
                )}
              </div>
              
              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveImage(index)
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* Order indicator */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}