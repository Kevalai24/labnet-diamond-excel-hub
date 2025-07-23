import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
  RotateCcw,
  Settings,
  PlusCircle,
  Files,
  Edit,
  Search,
  Filter,
  ArrowUpDown,
  Video,
  Image,
  FileText,
  SortAsc,
  SortDesc
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

interface ProductWithErrors extends Product {
  validationErrors?: Record<keyof Product, boolean>
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

const defaultColumns: Array<{ key: keyof Product; label: string; width: string; visible: boolean; editable: boolean }> = [
  { key: 'sellerId', label: 'Seller ID', width: 'w-24', visible: true, editable: false },
  { key: 'productId', label: 'Product ID', width: 'w-24', visible: true, editable: false },
  { key: 'shape', label: 'Shape', width: 'w-24', visible: true, editable: true },
  { key: 'carat', label: 'Carat', width: 'w-20', visible: true, editable: true },
  { key: 'color', label: 'Color', width: 'w-16', visible: true, editable: true },
  { key: 'clarity', label: 'Clarity', width: 'w-20', visible: true, editable: true },
  { key: 'cut', label: 'Cut', width: 'w-24', visible: true, editable: true },
  { key: 'polish', label: 'Polish', width: 'w-24', visible: true, editable: true },
  { key: 'symmetry', label: 'Symmetry', width: 'w-24', visible: true, editable: true },
  { key: 'fluorescence', label: 'Fluorescence', width: 'w-28', visible: true, editable: true },
  { key: 'laboratory', label: 'Laboratory', width: 'w-24', visible: true, editable: true },
  { key: 'certificateNumber', label: 'Certificate #', width: 'w-32', visible: true, editable: true },
  { key: 'measurements', label: 'Measurements', width: 'w-32', visible: true, editable: true },
  { key: 'depthPercentage', label: 'Depth %', width: 'w-20', visible: true, editable: true },
  { key: 'tablePercentage', label: 'Table %', width: 'w-20', visible: true, editable: true },
  { key: 'videoUrl', label: 'Video URL', width: 'w-32', visible: true, editable: false },
  { key: 'imageUrl', label: 'Image URL', width: 'w-32', visible: true, editable: false },
  { key: 'certificateUrl', label: 'Certificate URL', width: 'w-32', visible: true, editable: false },
  { key: 'pricePerCarat', label: 'Price/Carat', width: 'w-28', visible: false, editable: true },
  { key: 'totalPrice', label: 'Total Price', width: 'w-28', visible: false, editable: true },
  { key: 'growthType', label: 'Growth Type', width: 'w-28', visible: false, editable: true },
  { key: 'fancyColor', label: 'Fancy Color', width: 'w-28', visible: false, editable: true },
  { key: 'fancyColorIntensity', label: 'FC Intensity', width: 'w-28', visible: false, editable: true },
  { key: 'fancyColorOvertone', label: 'FC Overtone', width: 'w-28', visible: false, editable: true },
  { key: 'eyeClean', label: 'Eye Clean', width: 'w-24', visible: false, editable: true },
  { key: 'sellerName', label: 'Seller Name', width: 'w-32', visible: false, editable: true },
  { key: 'sellerCompany', label: 'Seller Company', width: 'w-36', visible: false, editable: true },
  { key: 'sellerLocation', label: 'Seller Location', width: 'w-32', visible: false, editable: true },
  { key: 'sellerPhone', label: 'Seller Phone', width: 'w-32', visible: false, editable: true },
  { key: 'sellerEmail', label: 'Seller Email', width: 'w-40', visible: false, editable: true }
]

interface Props {
  uploadedData?: { products: ProductWithErrors[] }
}

export function ExcelInventorySheet({ uploadedData }: Props) {
  const [products, setProducts] = useState<ProductWithErrors[]>(uploadedData?.products || sampleProducts)
  const [filteredProducts, setFilteredProducts] = useState<ProductWithErrors[]>(uploadedData?.products || sampleProducts)
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [clipboard, setClipboard] = useState<ProductWithErrors[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set())
  const [columns, setColumns] = useState(defaultColumns)
  const [customColumnNames, setCustomColumnNames] = useState<Record<string, string>>({})
  const [editingColumnName, setEditingColumnName] = useState<string | null>(null)
  const [columnNameInput, setColumnNameInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Update state when uploaded data changes
  useEffect(() => {
    if (uploadedData?.products) {
      setProducts(uploadedData.products)
      setFilteredProducts(uploadedData.products)
    }
  }, [uploadedData])

  // Generate unique Product ID
  const generateProductId = useCallback((offset = 0) => {
    const existingIds = products.map(p => parseInt(p.productId)).filter(id => !isNaN(id))
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0
    return (maxId + 1 + offset).toString().padStart(6, '0')
  }, [products])

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Apply search and filters
  useEffect(() => {
    let filtered = products.filter(product => {
      // Search across all fields
      if (searchTerm) {
        const searchValue = searchTerm.toLowerCase()
        const searchableValue = Object.values(product)
          .join(' ')
          .toLowerCase()
        if (!searchableValue.includes(searchValue)) {
          return false
        }
      }

      // Apply column filters
      for (const [columnKey, filterValue] of Object.entries(columnFilters)) {
        if (filterValue && filterValue.trim() !== '') {
          const productValue = product[columnKey as keyof Product]?.toString().toLowerCase() || ''
          if (!productValue.includes(filterValue.toLowerCase())) {
            return false
          }
        }
      }

      return true
    })

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        const aStr = aValue?.toString() || ''
        const bStr = bValue?.toString() || ''
        
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, columnFilters, sortConfig])

  const handleCellClick = useCallback((rowId: string, field: keyof Product) => {
    // Don't allow editing if field is not editable
    const column = columns.find(col => col.key === field)
    if (column && !column.editable) return
    
    setEditingCell({ rowId, field })
  }, [columns])

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
      sellerId: 'SD',
      productId: generateProductId(),
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
    setEditingCell({ rowId: newProduct.id, field: 'shape' })
    
    toast({
      title: "New Row Added",
      description: `Product ID ${newProduct.productId} created. Click any cell to edit.`,
    })
  }, [toast, generateProductId])

  const handleAddMultipleRows = useCallback((count: number) => {
    const newProducts: Product[] = []
    for (let i = 0; i < count; i++) {
      const newProduct: Product = {
        id: (Date.now() + i).toString(),
        sellerId: 'SD',
        productId: generateProductId(i),
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
      newProducts.push(newProduct)
    }
    setProducts(prev => [...newProducts, ...prev])
    
    toast({
      title: `${count} Rows Added`,
      description: `${count} new products created with unique IDs.`,
    })
  }, [toast, generateProductId])

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
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied",
      description: "Value copied to clipboard.",
    })
  }, [toast])

  const handleCopyRows = useCallback(() => {
    if (selectedRows.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select rows to copy.",
        variant: "destructive"
      })
      return
    }
    
    const copiedProducts = products.filter(p => selectedRows.has(p.id))
    setClipboard(copiedProducts)
    
    toast({
      title: "Rows Copied",
      description: `${selectedRows.size} rows copied to clipboard.`,
    })
  }, [selectedRows, products, toast])

  const handlePasteRows = useCallback(() => {
    if (clipboard.length === 0) {
      toast({
        title: "Nothing to Paste",
        description: "Copy some rows first.",
        variant: "destructive"
      })
      return
    }
    
    const newProducts = clipboard.map((product, index) => ({
      ...product,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      productId: generateProductId(index)
    }))
    
    setProducts(prev => [...newProducts, ...prev])
    
    toast({
      title: "Rows Pasted",
      description: `${clipboard.length} rows pasted with new Product IDs.`,
    })
  }, [clipboard, generateProductId, toast])

  const handleDuplicateRows = useCallback(() => {
    if (selectedRows.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select rows to duplicate.",
        variant: "destructive"
      })
      return
    }
    
    const duplicatedProducts = products
      .filter(p => selectedRows.has(p.id))
      .map((product, index) => ({
        ...product,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productId: generateProductId(index)
      }))
    
    setProducts(prev => [...duplicatedProducts, ...prev])
    setSelectedRows(new Set())
    
    toast({
      title: "Rows Duplicated",
      description: `${duplicatedProducts.length} rows duplicated with new Product IDs.`,
    })
  }, [selectedRows, products, generateProductId, toast])

  const handleColumnVisibilityChange = useCallback((columnKey: string, visible: boolean) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible } : col
    ))
  }, [])

  const handleColumnNameEdit = useCallback((columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (column) {
      setEditingColumnName(columnKey)
      setColumnNameInput(customColumnNames[columnKey] || column.label)
    }
  }, [columns, customColumnNames])

  const handleColumnNameSave = useCallback(() => {
    if (editingColumnName) {
      setCustomColumnNames(prev => ({
        ...prev,
        [editingColumnName]: columnNameInput
      }))
      setEditingColumnName(null)
      setColumnNameInput('')
      
      toast({
        title: "Column Renamed",
        description: "Column name updated successfully.",
      })
    }
  }, [editingColumnName, columnNameInput, toast])

  // File upload functionality
  const handleFileUpload = useCallback(async (productId: string, field: 'videoUrl' | 'imageUrl' | 'certificateUrl', file: File) => {
    setUploadingFiles(prev => new Set([...prev, `${productId}-${field}`]))
    
    try {
      // Simulate file upload and URL generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a mock URL (in real app, this would be from your file storage service)
      const fileExtension = file.name.split('.').pop()
      const mockUrl = `https://storage.example.com/${productId}/${field}/${Date.now()}.${fileExtension}`
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, [field]: mockUrl }
          : product
      ))
      
      setUnsavedChanges(prev => new Set([...prev, productId]))
      
      toast({
        title: "File Uploaded",
        description: `${field} updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploadingFiles(prev => {
        const updated = new Set(prev)
        updated.delete(`${productId}-${field}`)
        return updated
      })
    }
  }, [toast])

  // Sort functionality
  const handleSort = useCallback((columnKey: keyof Product) => {
    setSortConfig(prev => {
      if (prev?.key === columnKey) {
        if (prev.direction === 'asc') {
          return { key: columnKey, direction: 'desc' }
        } else {
          return null // Remove sorting
        }
      } else {
        return { key: columnKey, direction: 'asc' }
      }
    })
  }, [])

  // Filter functionality
  const handleColumnFilter = useCallback((columnKey: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
  }, [])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm('')
    setColumnFilters({})
    setSortConfig(null)
    
    toast({
      title: "Filters Cleared",
      description: "All filters and sorting have been reset.",
    })
  }, [toast])

  const renderCell = (product: ProductWithErrors, field: keyof Product) => {
    const value = product[field]
    const isEditing = editingCell?.rowId === product.id && editingCell?.field === field
    const hasUnsavedChanges = unsavedChanges.has(product.id)
    const fieldValidation = validationRules[field as keyof typeof validationRules]
    const column = columns.find(col => col.key === field)
    const isEditable = column?.editable !== false
    const isUploading = uploadingFiles.has(`${product.id}-${field}`)
    const hasValidationError = product.validationErrors?.[field] || false
    
    // Special handling for URL fields with upload functionality
    if (field === 'videoUrl' || field === 'imageUrl' || field === 'certificateUrl') {
      const getIcon = () => {
        switch (field) {
          case 'videoUrl': return Video
          case 'imageUrl': return Image
          case 'certificateUrl': return FileText
          default: return Upload
        }
      }
      
      const Icon = getIcon()
      const hasUrl = value && value.toString().trim() !== ''
      
      return (
        <div className="px-2 py-1 text-xs h-8 flex items-center gap-2">
          {hasUrl ? (
            <a 
              href={value.toString()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate flex-1"
              title={value.toString()}
            >
              <Icon className="w-3 h-3 inline mr-1" />
              View
            </a>
          ) : (
            <span className="text-muted-foreground flex-1">No file</span>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = field === 'videoUrl' ? 'video/*' : field === 'imageUrl' ? 'image/*' : '.pdf,.doc,.docx'
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  handleFileUpload(product.id, field, file)
                }
              }
              input.click()
            }}
            disabled={isUploading}
            className="h-6 w-6 p-0"
            title={`Upload ${field.replace('Url', '').toLowerCase()}`}
          >
            {isUploading ? (
              <div className="w-3 h-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
          </Button>
        </div>
      )
    }
    
    if (isEditing && isEditable) {
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
          "px-2 py-2 text-xs h-8 flex items-center group",
          isEditable ? "cursor-pointer hover:bg-accent/50" : "cursor-not-allowed bg-muted/50",
          hasUnsavedChanges && "bg-warning/10 border-l-2 border-l-warning",
          hasValidationError && "bg-destructive/10 border-l-2 border-l-destructive text-destructive", // Highlight validation errors
          "transition-colors"
        )}
        onClick={() => isEditable && handleCellClick(product.id, field)}
        title={`${value?.toString()} ${!isEditable ? '(Read-only)' : ''} ${hasValidationError ? '(Invalid data - needs correction)' : ''}`}
      >
        <span className="truncate flex-1">
          {hasValidationError && value?.toString() === '' ? (
            <span className="text-destructive italic">Click to correct</span>
          ) : (
            value?.toString() || '-'
          )}
        </span>
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

  const visibleColumns = columns.filter(col => col.visible)

  const getColumnDisplayName = (column: typeof columns[0]) => {
    return customColumnNames[column.key] || column.label
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
            <div className="flex gap-2 flex-wrap">
              {/* Add Row Options */}
              <div className="flex gap-1">
                <Button 
                  onClick={handleAddNew} 
                  variant="default" 
                  size="sm"
                  className="animate-scale-in"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="w-4 h-4" />
                      Add Multiple
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Multiple Rows</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 5, 10, 25, 50].map(count => (
                          <Button 
                            key={count}
                            onClick={() => {
                              handleAddMultipleRows(count)
                              // Close the dialog by clicking the close button
                              const closeButton = document.querySelector('[role="dialog"] button[type="button"]') as HTMLButtonElement
                              if (closeButton) {
                                closeButton.click()
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            {count} Row{count > 1 ? 's' : ''}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Row Operations */}
              <div className="flex gap-1">
                <Button 
                  onClick={handleCopyRows} 
                  variant="outline" 
                  size="sm"
                  disabled={selectedRows.size === 0}
                >
                  <Copy className="w-4 h-4" />
                  Copy ({selectedRows.size})
                </Button>
                <Button 
                  onClick={handlePasteRows} 
                  variant="outline" 
                  size="sm"
                  disabled={clipboard.length === 0}
                >
                  <Clipboard className="w-4 h-4" />
                  Paste ({clipboard.length})
                </Button>
                <Button 
                  onClick={handleDuplicateRows} 
                  variant="outline" 
                  size="sm"
                  disabled={selectedRows.size === 0}
                >
                  <Files className="w-4 h-4" />
                  Duplicate ({selectedRows.size})
                </Button>
              </div>

              {/* Management Options */}
              <div className="flex gap-1">
                <Button 
                  onClick={handleDeleteSelected} 
                  variant="destructive" 
                  size="sm"
                  disabled={selectedRows.size === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedRows.size})
                </Button>
                <Button 
                  onClick={handleSaveChanges} 
                  variant="default" 
                  size="sm"
                  disabled={unsavedChanges.size === 0}
                  className={unsavedChanges.size > 0 ? "animate-pulse" : ""}
                >
                  <Save className="w-4 h-4" />
                  Save ({unsavedChanges.size})
                </Button>
              </div>

              {/* Column Settings */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                    Columns
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Customize Columns</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Select which columns to display and customize their names:
                    </div>
                    <div className="grid gap-3">
                      {columns.map((column) => (
                        <div key={column.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={column.visible}
                              onCheckedChange={(checked) => 
                                handleColumnVisibilityChange(column.key, checked as boolean)
                              }
                            />
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {getColumnDisplayName(column)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {column.key} • {column.editable ? 'Editable' : 'Read-only'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingColumnName === column.key ? (
                              <div className="flex gap-1">
                                <Input
                                  value={columnNameInput}
                                  onChange={(e) => setColumnNameInput(e.target.value)}
                                  className="h-8 w-32 text-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleColumnNameSave()
                                    if (e.key === 'Escape') {
                                      setEditingColumnName(null)
                                      setColumnNameInput('')
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={handleColumnNameSave}
                                  className="h-8 px-2"
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingColumnName(null)
                                    setColumnNameInput('')
                                  }}
                                  className="h-8 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleColumnNameEdit(column.key)}
                                className="h-8 px-2"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex gap-4 items-center mt-4 pt-4 border-t">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={!searchTerm && Object.keys(columnFilters).length === 0 && !sortConfig}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
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
                 {/* Column Headers */}
                 <tr className="bg-primary text-primary-foreground">
                   <th className="w-12 border border-primary-foreground/20 p-2">
                     <input
                       type="checkbox"
                       checked={selectedRows.size === filteredProducts.length && filteredProducts.length > 0}
                       onChange={(e) => {
                         if (e.target.checked) {
                           setSelectedRows(new Set(filteredProducts.map(p => p.id)))
                         } else {
                           setSelectedRows(new Set())
                         }
                       }}
                       className="rounded"
                     />
                   </th>
                    {visibleColumns.map((col) => (
                      <th 
                        key={col.key} 
                        className="border border-primary-foreground/20 p-1 text-left text-xs font-medium min-w-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="truncate" title={getColumnDisplayName(col)}>
                              {getColumnDisplayName(col)}
                            </span>
                            {!col.editable && (
                              <span className="text-xs opacity-60">🔒</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort(col.key)}
                              className="h-4 w-4 p-0 hover:bg-primary-foreground/20"
                            >
                              {sortConfig?.key === col.key ? (
                                sortConfig.direction === 'asc' ? (
                                  <SortAsc className="w-3 h-3" />
                                ) : (
                                  <SortDesc className="w-3 h-3" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="w-12 border border-primary-foreground/20 p-2 text-center text-xs font-medium">
                      Actions
                    </th>
                 </tr>
                 
                 {/* Filter Row */}
                 <tr className="bg-primary/80 text-primary-foreground">
                   <th className="w-12 border border-primary-foreground/20 p-1">
                     <Filter className="w-3 h-3 mx-auto" />
                   </th>
                   {visibleColumns.map((col) => (
                     <th key={col.key} className="border border-primary-foreground/20 p-1">
                       <Input
                         placeholder="Filter..."
                         value={columnFilters[col.key] || ''}
                         onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                         className="h-6 text-xs bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                       />
                     </th>
                   ))}
                   <th className="w-12 border border-primary-foreground/20 p-1"></th>
                 </tr>
               </thead>
              
               {/* Data Rows */}
               <tbody>
                 {filteredProducts.map((product, index) => (
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
                     {visibleColumns.map((col) => (
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
                     
                     {/* Row Actions */}
                     <td className="border border-border p-1 w-12">
                       <Button
                         size="sm"
                         variant="ghost"
                         onClick={() => {
                           setSelectedRows(new Set([product.id]))
                           handleDeleteSelected()
                         }}
                         className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                         title="Delete this row"
                       >
                         <Trash2 className="w-3 h-3" />
                       </Button>
                     </td>
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
          <span>Filtered: {filteredProducts.length} products</span>
          <span>Selected: {selectedRows.size} rows</span>
          {unsavedChanges.size > 0 && (
            <span className="text-warning font-medium animate-pulse">
              {unsavedChanges.size} unsaved changes
            </span>
          )}
          {sortConfig && (
            <span className="text-primary">
              Sorted by {sortConfig.key} ({sortConfig.direction})
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <span>Click cells to edit • URL columns support file upload • Use filters and search</span>
        </div>
      </div>
    </div>
  )
}