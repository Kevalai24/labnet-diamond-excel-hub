import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Copy, 
  Clipboard,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Validation rules for dropdown columns
const validationRules = {
  shape: [
    "Round", "Pear", "Oval", "Marquise", "Heart", "Radiant", "Princess", "Emerald", 
    "Asscher", "Sq. Emerald", "Asscher & Sq. Emerald", "Square Radiant", "Cushion (All)", 
    "Cushion Brilliant", "Cushion Modified", "Baguette", "European Cut", "Old Miner", 
    "Briolette", "Bullets", "Calf", "Circular Brilliant", "Epaulette", "Flanders", 
    "Half Moon", "Hexagonal", "Kite", "Lozenge", "Octagonal", "Pentagonal", "Rose", 
    "Shield", "Square", "Star", "Tapered Baguette", "Tapered Bullet", "Trapezoid", 
    "Triangular", "Trilliant", "Other"
  ],
  clarity: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2", "I3"],
  fancyColor: [
    "Black", "Brown", "Brownish", "Champagne", "Cognac", "Chameleon", "Violetish", 
    "White", "Brown-Greenish", "Green", "Greenish", "Purple", "Purplish", "Orange", 
    "Orangey", "Violet", "Gray", "Grayish", "None", "Yellow", "Yellowish", "Pink", 
    "Pinkish", "Blue", "Bluish", "Red", "Reddish", "Gray-Greenish", "Gray-Yellowish", 
    "Orange-Brown", "Other"
  ],
  fancyColorOvertone: [
    "Black", "Brown", "Brownish", "Champagne", "Cognac", "Chameleon", "Violetish", 
    "White", "Brown-Greenish", "Green", "Greenish", "Purple", "Purplish", "Orange", 
    "Orangey", "Violet", "Gray", "Grayish", "None", "Yellow", "Yellowish", "Pink", 
    "Pinkish", "Blue", "Bluish", "Red", "Reddish", "Gray-Greenish", "Gray-Yellowish", 
    "Orange-Brown", "Other"
  ],
  color: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  fluorescence: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3"],
  cut: ["Excellent", "Very Good", "Good", "Poor", "Fair", "Ideal"],
  symmetry: ["Excellent", "Very Good", "Good", "Poor", "Fair", "Ideal"],
  polish: ["Excellent", "Very Good", "Good", "Poor", "Fair", "Ideal"],
  fancyColorIntensity: ["Faint", "Very Light", "Fancy Light", "Light", "Fancy", "Dark Fancy", "Fancy Intense", "Fancy Deep", "Other"],
  eyeClean: ["Yes", "Border Line", "E1", "E2(No)"],
  laboratory: ["GIA", "GIA DOR", "HRD", "IGI", "AGS", "CGL", "DBIOD", "GCAL", "GII", "GHI", "GSI", "NGTC", "PGS", "RAP", "RDC", "SGL", "NONE"]
}

// Define the product structure
interface Product {
  id: string
  sellerId: string
  productId: string
  shape: string
  carat: number
  color: string
  clarity: string
  cut: string
  polish: string
  symmetry: string
  fluorescence: string
  laboratory: string
  certificateNumber: string
  measurements: string
  depthPercentage: number
  tablePercentage: number
  pricePerCarat: number
  totalPrice: number
  growthType: string
  fancyColor: string
  fancyColorIntensity: string
  fancyColorOvertone: string
  eyeClean: string
  sellerName: string
  sellerCompany: string
  sellerLocation: string
  sellerPhone: string
  sellerWhatsApp: string
  sellerEmail: string
  videoUrl: string
  imageUrl: string
  certificateUrl: string
}

interface CellPosition {
  rowId: string
  field: keyof Product
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: '1',
    sellerId: 'SD',
    productId: '002529',
    shape: 'Emerald',
    carat: 4.42,
    color: 'F',
    clarity: 'VS2',
    cut: 'Very Good',
    polish: 'Very Good',
    symmetry: 'Very Good',
    fluorescence: 'FL',
    laboratory: 'GIA',
    certificateNumber: '683550971',
    measurements: '6.93*6.63*5.05',
    depthPercentage: 46,
    tablePercentage: 65,
    pricePerCarat: 364.18,
    totalPrice: 1824.55,
    growthType: 'CVD',
    fancyColor: 'Yellow',
    fancyColorIntensity: 'Fancy Intense',
    fancyColorOvertone: 'Pink',
    eyeClean: 'Yes',
    sellerName: 'GemNova',
    sellerCompany: 'GemNova LLC',
    sellerLocation: 'New York, US',
    sellerPhone: '+1 212 555 0199',
    sellerWhatsApp: '+1 212 555 0199',
    sellerEmail: 'contact@gemnova.com',
    videoUrl: 'Video',
    imageUrl: 'Image',
    certificateUrl: 'Certificate'
  },
  {
    id: '2',
    sellerId: 'SD',
    productId: '002528',
    shape: 'Emerald',
    carat: 3.88,
    color: 'G',
    clarity: 'VS1',
    cut: 'Good',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'IF',
    laboratory: 'HRD',
    certificateNumber: '683550971',
    measurements: '6.93*6.63*5.05',
    depthPercentage: 46,
    tablePercentage: 65,
    pricePerCarat: 364.18,
    totalPrice: 1824.55,
    growthType: 'CVD',
    fancyColor: 'Yellow',
    fancyColorIntensity: 'Fancy Deep',
    fancyColorOvertone: 'Green',
    eyeClean: 'Border Line',
    sellerName: 'Aarav Diamonds',
    sellerCompany: 'Aarav Diamonds BVBA',
    sellerLocation: 'Antwerp, BE',
    sellerPhone: '+32 3 123 4567',
    sellerWhatsApp: '+32 3 123 4567',
    sellerEmail: 'sales@aaravdiamonds.com',
    videoUrl: 'Video',
    imageUrl: 'Image',
    certificateUrl: 'Certificate'
  }
]

const columns: Array<{ key: keyof Product; label: string; width: string }> = [
  { key: 'sellerId', label: 'Seller ID', width: 'w-24' },
  { key: 'productId', label: 'Product ID', width: 'w-24' },
  { key: 'shape', label: 'Shape', width: 'w-24' },
  { key: 'carat', label: 'Carat', width: 'w-20' },
  { key: 'color', label: 'Color', width: 'w-16' },
  { key: 'clarity', label: 'Clarity', width: 'w-20' },
  { key: 'cut', label: 'Cut', width: 'w-24' },
  { key: 'polish', label: 'Polish', width: 'w-24' },
  { key: 'symmetry', label: 'Symmetry', width: 'w-24' },
  { key: 'fluorescence', label: 'Fluorescence', width: 'w-28' },
  { key: 'laboratory', label: 'Laboratory', width: 'w-24' },
  { key: 'certificateNumber', label: 'Certificate #', width: 'w-32' },
  { key: 'measurements', label: 'Measurements', width: 'w-32' },
  { key: 'depthPercentage', label: 'Depth %', width: 'w-20' },
  { key: 'tablePercentage', label: 'Table %', width: 'w-20' },
  { key: 'pricePerCarat', label: 'Price/Carat', width: 'w-28' },
  { key: 'totalPrice', label: 'Total Price', width: 'w-28' },
  { key: 'growthType', label: 'Growth Type', width: 'w-28' },
  { key: 'fancyColor', label: 'Fancy Color', width: 'w-28' },
  { key: 'fancyColorIntensity', label: 'FC Intensity', width: 'w-28' },
  { key: 'fancyColorOvertone', label: 'FC Overtone', width: 'w-28' },
  { key: 'eyeClean', label: 'Eye Clean', width: 'w-24' },
  { key: 'sellerName', label: 'Seller Name', width: 'w-32' },
  { key: 'sellerCompany', label: 'Seller Company', width: 'w-36' },
  { key: 'sellerLocation', label: 'Seller Location', width: 'w-32' },
  { key: 'sellerPhone', label: 'Seller Phone', width: 'w-32' },
  { key: 'sellerEmail', label: 'Seller Email', width: 'w-40' }
]

export function ExcelInventorySheet() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [clipboard, setClipboard] = useState<string>('')
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const handleCellClick = useCallback((rowId: string, field: keyof Product) => {
    setEditingCell({ rowId, field })
  }, [])

  const handleCellChange = useCallback((value: string) => {
    if (!editingCell) return
    
    const { rowId, field } = editingCell
    setProducts(prev => prev.map(product => {
      if (product.id === rowId) {
        const newValue = typeof product[field] === 'number' ? parseFloat(value) || 0 : value
        setUnsavedChanges(prev => new Set([...prev, rowId]))
        return { ...product, [field]: newValue }
      }
      return product
    }))
  }, [editingCell])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!editingCell) return

    if (e.key === 'Enter') {
      e.preventDefault()
      const currentRowIndex = products.findIndex(p => p.id === editingCell.rowId)
      const currentColIndex = columns.findIndex(c => c.key === editingCell.field)
      
      // Move to next row, same column
      if (currentRowIndex < products.length - 1) {
        setEditingCell({
          rowId: products[currentRowIndex + 1].id,
          field: editingCell.field
        })
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const currentRowIndex = products.findIndex(p => p.id === editingCell.rowId)
      const currentColIndex = columns.findIndex(c => c.key === editingCell.field)
      
      if (e.shiftKey) {
        // Move to previous cell
        if (currentColIndex > 0) {
          setEditingCell({
            rowId: editingCell.rowId,
            field: columns[currentColIndex - 1].key
          })
        } else if (currentRowIndex > 0) {
          setEditingCell({
            rowId: products[currentRowIndex - 1].id,
            field: columns[columns.length - 1].key
          })
        }
      } else {
        // Move to next cell
        if (currentColIndex < columns.length - 1) {
          setEditingCell({
            rowId: editingCell.rowId,
            field: columns[currentColIndex + 1].key
          })
        } else if (currentRowIndex < products.length - 1) {
          setEditingCell({
            rowId: products[currentRowIndex + 1].id,
            field: columns[0].key
          })
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null)
    }
  }, [editingCell, products, columns])

  const handleAddNew = useCallback(() => {
    const newProduct: Product = {
      id: Date.now().toString(),
      sellerId: '',
      productId: '',
      shape: '',
      carat: 0,
      color: '',
      clarity: '',
      cut: '',
      polish: '',
      symmetry: '',
      fluorescence: '',
      laboratory: '',
      certificateNumber: '',
      measurements: '',
      depthPercentage: 0,
      tablePercentage: 0,
      pricePerCarat: 0,
      totalPrice: 0,
      growthType: '',
      fancyColor: '',
      fancyColorIntensity: '',
      fancyColorOvertone: '',
      eyeClean: '',
      sellerName: '',
      sellerCompany: '',
      sellerLocation: '',
      sellerPhone: '',
      sellerWhatsApp: '',
      sellerEmail: '',
      videoUrl: '',
      imageUrl: '',
      certificateUrl: ''
    }
    setProducts(prev => [newProduct, ...prev])
    setEditingCell({ rowId: newProduct.id, field: 'sellerId' })
    
    toast({
      title: "New Row Added",
      description: "Click on any cell to start editing.",
    })
  }, [toast])

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select rows to delete.",
        variant: "destructive"
      })
      return
    }
    
    setProducts(prev => prev.filter(p => !selectedRows.has(p.id)))
    setSelectedRows(new Set())
    setUnsavedChanges(prev => {
      const updated = new Set(prev)
      selectedRows.forEach(id => updated.delete(id))
      return updated
    })
    
    toast({
      title: "Rows Deleted",
      description: `${selectedRows.size} rows have been deleted.`,
      variant: "destructive"
    })
  }, [selectedRows, toast])

  const handleRowSelect = useCallback((productId: string, selected: boolean) => {
    setSelectedRows(prev => {
      const updated = new Set(prev)
      if (selected) {
        updated.add(productId)
      } else {
        updated.delete(productId)
      }
      return updated
    })
  }, [])

  const handleSaveChanges = useCallback(() => {
    // Simulate save operation
    setUnsavedChanges(new Set())
    toast({
      title: "Changes Saved",
      description: "All changes have been saved successfully.",
    })
  }, [toast])

  const handleCopy = useCallback((value: string) => {
    setClipboard(value)
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied",
      description: "Value copied to clipboard.",
    })
  }, [toast])

  const renderCell = (product: Product, field: keyof Product) => {
    const value = product[field]
    const isEditing = editingCell?.rowId === product.id && editingCell?.field === field
    const hasUnsavedChanges = unsavedChanges.has(product.id)
    const fieldValidation = validationRules[field as keyof typeof validationRules]
    
    if (isEditing) {
      // Use dropdown for fields with validation rules
      if (fieldValidation) {
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={(newValue) => {
              handleCellChange(newValue)
              setEditingCell(null)
            }}
            onOpenChange={(open) => {
              if (!open) setEditingCell(null)
            }}
          >
            <SelectTrigger className="h-8 text-xs border-primary ring-2 ring-primary/20 animate-scale-in">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {fieldValidation.map((option) => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
      
      // Regular input for non-validated fields
      return (
        <Input
          ref={inputRef}
          value={value?.toString() || ''}
          onChange={(e) => handleCellChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditingCell(null)}
          className="h-8 text-xs border-primary ring-2 ring-primary/20 animate-scale-in"
        />
      )
    }
    
    return (
      <div 
        className={cn(
          "px-2 py-2 text-xs cursor-pointer hover:bg-accent/50 transition-colors h-8 flex items-center group",
          hasUnsavedChanges && "bg-warning/10 border-l-2 border-l-warning",
          fieldValidation && !fieldValidation.includes(value?.toString() || '') && value?.toString() !== '' && 
          "bg-destructive/10 border-l-2 border-l-destructive" // Highlight invalid values
        )}
        onClick={() => handleCellClick(product.id, field)}
        title={value?.toString()}
      >
        <span className="truncate flex-1">{value?.toString() || '-'}</span>
        <Copy 
          className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleCopy(value?.toString() || '')
          }}
        />
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-primary">
              Excel Inventory Manager
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddNew} 
                variant="brand" 
                size="sm"
                className="animate-scale-in"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </Button>
              <Button 
                onClick={handleDeleteSelected} 
                variant="destructive" 
                size="sm"
                disabled={selectedRows.size === 0}
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedRows.size})
              </Button>
              <Button 
                onClick={handleSaveChanges} 
                variant="success" 
                size="sm"
                disabled={unsavedChanges.size === 0}
                className={unsavedChanges.size > 0 ? "animate-pulse" : ""}
              >
                <Save className="w-4 h-4" />
                Save Changes ({unsavedChanges.size})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Excel-like Spreadsheet */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[600px] border border-border">
            <table className="w-full border-collapse">
              {/* Header */}
              <thead className="sticky top-0 z-10">
                <tr className="bg-primary text-primary-foreground">
                  <th className="w-12 border border-primary-foreground/20 p-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === products.length && products.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(new Set(products.map(p => p.id)))
                        } else {
                          setSelectedRows(new Set())
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  {columns.map((col) => (
                    <th 
                      key={col.key} 
                      className="border border-primary-foreground/20 p-2 text-left text-xs font-medium min-w-0"
                    >
                      <div className="truncate" title={col.label}>
                        {col.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Data Rows */}
              <tbody>
                {products.map((product, index) => (
                  <tr 
                    key={product.id}
                    className={cn(
                      "transition-all duration-200 hover:bg-accent/30",
                      selectedRows.has(product.id) && "bg-primary/10",
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                      unsavedChanges.has(product.id) && "border-l-4 border-l-warning"
                    )}
                  >
                    {/* Selection checkbox */}
                    <td className="border border-border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(product.id)}
                        onChange={(e) => handleRowSelect(product.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    
                    {/* Data cells */}
                    {columns.map((col) => (
                      <td 
                        key={col.key} 
                        className={cn(
                          "border border-border transition-all duration-200 min-w-0",
                          editingCell?.rowId === product.id && editingCell?.field === col.key && 
                          "ring-2 ring-primary/20 bg-primary/5"
                        )}
                      >
                        {renderCell(product, col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
        <div className="flex gap-4">
          <span>Total: {products.length} products</span>
          <span>Selected: {selectedRows.size} rows</span>
          {unsavedChanges.size > 0 && (
            <span className="text-warning font-medium animate-pulse">
              {unsavedChanges.size} unsaved changes
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <span>Click any cell to edit • Tab/Enter to navigate • Esc to cancel</span>
        </div>
      </div>
    </div>
  )
}