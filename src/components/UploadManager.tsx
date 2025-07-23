import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, Eye, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useExcelUpload } from '@/hooks/useExcelUpload'
import { useToast } from '@/hooks/use-toast'

interface Props {
  onDataUploaded?: (data: any) => void
}

export function UploadManager({ onDataUploaded }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadStatus, uploadExcel, resetUpload } = useExcelUpload()
  const [showErrorDetails, setShowErrorDetails] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['.xlsx', '.xls']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: 'Please upload a valid Excel file (.xlsx, .xls).',
        variant: "destructive"
      })
      return
    }

    uploadExcel(file, (result) => {
      onDataUploaded?.(result)
    })
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
                variant="default"
                size="lg"
                disabled={uploadStatus.status === 'processing'}
              >
                {uploadStatus.status === 'processing' ? (
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
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Supported formats: .xlsx, .xls (Max size: 10MB)
            </p>
          </div>

          {/* Upload Status */}
          {uploadStatus.status !== 'idle' && (
            <Alert className={
              uploadStatus.status === 'success' ? 'border-green-500 bg-green-50' : 
              uploadStatus.status === 'error' ? 'border-destructive bg-destructive/5' : 
              'border-primary bg-primary/5'
            }>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {uploadStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                  {uploadStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />}
                  {uploadStatus.status === 'processing' && <FileSpreadsheet className="h-4 w-4 text-primary animate-pulse mt-0.5" />}
                  
                  <AlertDescription>
                    <div>
                      <strong>{uploadStatus.fileName}</strong>
                      <br />
                      {uploadStatus.message}
                      {uploadStatus.result && uploadStatus.result.errorCount > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {uploadStatus.result.errorCount} validation errors
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowErrorDetails(true)}
                            className="h-6 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </div>
                
                {uploadStatus.status !== 'processing' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
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
                  Upload the completed Excel file and we'll process it automatically with validation
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-medium">Review and correct errors</h4>
                <p className="text-sm text-muted-foreground">
                  Invalid data will be highlighted in red for easy correction
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Details Dialog */}
      <Dialog open={showErrorDetails} onOpenChange={setShowErrorDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Validation Errors</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            {uploadStatus.result?.errors.map((error, index) => (
              <div key={index} className="p-3 border border-destructive/20 rounded-lg mb-2 bg-destructive/5">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">Row {error.row}</Badge>
                  <Badge variant="secondary" className="text-xs">{error.field}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{error.message}</p>
                <p className="text-xs text-destructive mt-1">
                  Invalid value: <code className="bg-destructive/10 px-1 rounded">{error.value}</code>
                </p>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}