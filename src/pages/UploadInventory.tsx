import { useState } from 'react'
import { UploadManager } from '@/components/UploadManager'
import { ExcelInventorySheet } from '@/components/ExcelInventorySheet'
import type { ProductWithErrors } from '@/hooks/useExcelUpload'

const UploadInventory = () => {
  const [uploadedData, setUploadedData] = useState<{ products: ProductWithErrors[] } | undefined>()

  const handleDataUploaded = (data: { products: ProductWithErrors[] }) => {
    setUploadedData(data)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Upload Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Upload your diamond inventory from Excel files and manage bulk data operations
          </p>
        </div>
        
        <UploadManager onDataUploaded={handleDataUploaded} />
      </div>

      {uploadedData && (
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-primary">Uploaded Data</h2>
            <p className="text-muted-foreground">
              Review your uploaded data. Fields highlighted in red need correction.
            </p>
          </div>
          <ExcelInventorySheet uploadedData={uploadedData} />
        </div>
      )}
    </div>
  )
}

export default UploadInventory