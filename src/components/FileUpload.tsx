'use client'

import { useCallback, useState } from 'react'

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileUpload(files[0])
    } else {
      alert('Please upload a PDF file')
    }
  }, [onFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      if (files[0].type === 'application/pdf') {
        onFileUpload(files[0])
      } else {
        alert('Please upload a PDF file')
      }
    }
  }, [onFileUpload])

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group cursor-pointer ${
        isDragging 
          ? 'border-purple-400 bg-purple-50 scale-105' 
          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      {/* Upload icon */}
      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg
            className="w-10 h-10 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Drop your blueprint here
        </h3>
        
        <p className="text-gray-600 mb-4">
          <label htmlFor="file-upload" className="cursor-pointer font-semibold text-purple-600 hover:text-purple-700 transition-colors">
            Click to browse files
          </label>
          {' '}or drag and drop your PDF
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            PDF files only
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Up to 50MB
          </div>
        </div>
        
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept=".pdf"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  )
}