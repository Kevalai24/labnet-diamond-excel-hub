import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  message: string
  fileName?: string
}

export function UploadManager() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', message: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['.xlsx', '.xls', '.csv']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validTypes.includes(fileExtension)) {
      setUploadStatus({
        status: 'error',
        message: 'Please upload a valid Excel file (.xlsx, .xls) or CSV file.',
        fileName: file.name
      })
      return
    }

    setUploadStatus({
      status: 'uploading',
      message: 'Processing file...',
      fileName: file.name
    })

    // Simulate file processing
    setTimeout(() => {
      setUploadStatus({
        status: 'success',
        message: 'File uploaded and processed successfully!',
        fileName: file.name
      })
      
      toast({
        title: "Upload Successful",
        description: `${file.name} has been processed and added to your inventory.`,
      })
    }, 2000)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const downloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded to your device.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Upload className="w-5 h-5" />
            Upload Excel Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center space-y-4 hover:border-primary/40 transition-colors">
            <FileSpreadsheet className="w-12 h-12 text-primary mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-foreground">Drop your Excel file here</h3>
              <p className="text-muted-foreground">or click to browse and upload</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleBrowseClick}
                variant="brand"
                size="lg"
                disabled={uploadStatus.status === 'uploading'}
              >
                {uploadStatus.status === 'uploading' ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Browse Files
                  </>
                )}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Supported formats: .xlsx, .xls, .csv (Max size: 10MB)
            </p>
          </div>

          {/* Upload Status */}
          {uploadStatus.status !== 'idle' && (
            <Alert className={
              uploadStatus.status === 'success' ? 'border-success bg-success/5' : 
              uploadStatus.status === 'error' ? 'border-destructive bg-destructive/5' : 
              'border-primary bg-primary/5'
            }>
              {uploadStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-success" />}
              {uploadStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
              {uploadStatus.status === 'uploading' && <FileSpreadsheet className="h-4 w-4 text-primary animate-pulse" />}
              
              <AlertDescription>
                <div>
                  <strong>{uploadStatus.fileName}</strong>
                  <br />
                  {uploadStatus.message}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Download className="w-5 h-5" />
            Download Excel Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-success" />
              <div>
                <h4 className="font-medium">Diamond Inventory Template</h4>
                <p className="text-sm text-muted-foreground">
                  Excel template with all required columns and sample data
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Upload Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium">Download the template</h4>
                <p className="text-sm text-muted-foreground">
                  Use our Excel template to ensure all required columns are included
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium">Fill in your data</h4>
                <p className="text-sm text-muted-foreground">
                  Add your diamond inventory data to the template following the column format
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium">Upload your file</h4>
                <p className="text-sm text-muted-foreground">
                  Upload the completed Excel file and we'll process it automatically
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-medium">Review and manage</h4>
                <p className="text-sm text-muted-foreground">
                  View, edit, and manage your uploaded inventory in the Excel Manager
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}