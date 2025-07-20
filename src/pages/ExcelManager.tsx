import { ExcelInventorySheet } from '@/components/ExcelInventorySheet'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet, Download, Upload, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const ExcelManager = () => {
  const { toast } = useToast()

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your inventory data is being exported to Excel format.",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import Feature",
      description: "Please use the Upload Inventory page to import new data.",
    })
  }

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Inventory data has been refreshed from the database.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Excel Inventory Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage your diamond inventory with Excel-like functionality
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={handleImport} variant="secondary" size="sm">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button onClick={handleExport} variant="brand" size="sm">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Key Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-subtle p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Excel-like Interface</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Edit cells directly, add new rows, and manage your inventory like a spreadsheet
          </p>
        </div>
        
        <div className="bg-gradient-subtle p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-5 h-5 text-success" />
            <h3 className="font-medium">Bulk Operations</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload, update, and delete multiple products at once
          </p>
        </div>
        
        <div className="bg-gradient-subtle p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-5 h-5 text-warning" />
            <h3 className="font-medium">Export & Import</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Export to Excel or CSV, and import from various formats
          </p>
        </div>
      </div>

      {/* Spreadsheet Component */}
      <ExcelInventorySheet />
    </div>
  )
}

export default ExcelManager