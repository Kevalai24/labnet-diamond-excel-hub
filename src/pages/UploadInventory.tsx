import { UploadManager } from '@/components/UploadManager'

const UploadInventory = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Upload Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Upload your diamond inventory from Excel files and manage bulk data operations
          </p>
        </div>
        
        <UploadManager />
      </div>
    </div>
  )
}

export default UploadInventory