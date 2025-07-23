import { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { useToast } from '@/hooks/use-toast'

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

export interface Product {
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

export interface ValidationError {
  field: keyof Product
  value: string
  expectedValues?: string[]
}

export interface ProductWithErrors extends Product {
  validationErrors: Record<keyof Product, boolean>
}

interface UploadResult {
  products: ProductWithErrors[]
  totalRows: number
  errorCount: number
  errors: Array<{ row: number; field: string; value: string; message: string }>
}

interface UploadStatus {
  status: 'idle' | 'processing' | 'success' | 'error'
  message: string
  fileName?: string
  result?: UploadResult
}

// Column mapping from Excel headers to Product fields
const columnMapping: Record<string, keyof Product> = {
  'Seller ID': 'sellerId',
  'Product ID': 'productId',
  'Shape': 'shape',
  'Carat': 'carat',
  'Color': 'color',
  'Clarity': 'clarity',
  'Cut': 'cut',
  'Polish': 'polish',
  'Symmetry': 'symmetry',
  'Fluorescence': 'fluorescence',
  'Laboratory': 'laboratory',
  'Certificate Number': 'certificateNumber',
  'Certificate #': 'certificateNumber',
  'Measurements': 'measurements',
  'Depth %': 'depthPercentage',
  'Depth Percentage': 'depthPercentage',
  'Table %': 'tablePercentage',
  'Table Percentage': 'tablePercentage',
  'Price/Carat': 'pricePerCarat',
  'Price Per Carat': 'pricePerCarat',
  'Total Price': 'totalPrice',
  'Growth Type': 'growthType',
  'Fancy Color': 'fancyColor',
  'FC Intensity': 'fancyColorIntensity',
  'Fancy Color Intensity': 'fancyColorIntensity',
  'FC Overtone': 'fancyColorOvertone',
  'Fancy Color Overtone': 'fancyColorOvertone',
  'Eye Clean': 'eyeClean',
  'Seller Name': 'sellerName',
  'Seller Company': 'sellerCompany',
  'Seller Location': 'sellerLocation',
  'Seller Phone': 'sellerPhone',
  'Seller WhatsApp': 'sellerWhatsApp',
  'Seller Email': 'sellerEmail',
  'Video URL': 'videoUrl',
  'Image URL': 'imageUrl',
  'Certificate URL': 'certificateUrl'
}

export function useExcelUpload() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', message: '' })
  const { toast } = useToast()

  const validateField = useCallback((field: keyof Product, value: string): boolean => {
    if (!value || value.toString().trim() === '') return true // Empty values are allowed

    const stringValue = value.toString().trim()
    
    // Check validation rules for dropdown fields
    if (field in validationRules) {
      const validValues = validationRules[field as keyof typeof validationRules]
      return validValues.includes(stringValue)
    }

    // Email validation
    if (field === 'sellerEmail' && stringValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(stringValue)
    }

    // Phone number validation (basic)
    if ((field === 'sellerPhone' || field === 'sellerWhatsApp') && stringValue) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/
      return phoneRegex.test(stringValue)
    }

    // Numeric field validation
    if (['carat', 'depthPercentage', 'tablePercentage', 'pricePerCarat', 'totalPrice'].includes(field)) {
      return !isNaN(parseFloat(stringValue))
    }

    return true
  }, [])

  const processExcelFile = useCallback(async (file: File): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
          
          if (jsonData.length < 2) {
            reject(new Error('Excel file must contain headers and at least one data row'))
            return
          }

          const headers = jsonData[0]
          const rows = jsonData.slice(1)
          
          const products: ProductWithErrors[] = []
          const errors: Array<{ row: number; field: string; value: string; message: string }> = []
          let errorCount = 0

          rows.forEach((row, rowIndex) => {
            if (row.every(cell => !cell || cell.toString().trim() === '')) {
              return // Skip empty rows
            }

            const product: ProductWithErrors = {
              id: `imported_${Date.now()}_${rowIndex}`,
              sellerId: 'SD',
              productId: `00${rowIndex + 1}`.padStart(6, '0'),
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
              certificateUrl: '',
              validationErrors: {} as Record<keyof Product, boolean>
            }

            // Map Excel columns to product fields
            headers.forEach((header, colIndex) => {
              const fieldName = columnMapping[header]
              if (fieldName && row[colIndex] !== undefined) {
                const cellValue = row[colIndex]?.toString() || ''
                
                // Validate the field
                const isValid = validateField(fieldName, cellValue)
                
                if (!isValid) {
                  // Mark field as having validation error
                  product.validationErrors[fieldName] = true
                  // Leave field blank for invalid data
                  if (['carat', 'depthPercentage', 'tablePercentage', 'pricePerCarat', 'totalPrice'].includes(fieldName)) {
                    (product as any)[fieldName] = 0
                  } else {
                    (product as any)[fieldName] = ''
                  }
                  
                  errors.push({
                    row: rowIndex + 2, // +2 because of header row and 1-based indexing
                    field: fieldName,
                    value: cellValue,
                    message: `Invalid value "${cellValue}" for ${header}`
                  })
                  errorCount++
                } else {
                  // Set valid value
                  if (['carat', 'depthPercentage', 'tablePercentage', 'pricePerCarat', 'totalPrice'].includes(fieldName)) {
                    (product as any)[fieldName] = parseFloat(cellValue) || 0
                  } else {
                    (product as any)[fieldName] = cellValue
                  }
                }
              }
            })

            products.push(product)
          })

          resolve({
            products,
            totalRows: products.length,
            errorCount,
            errors
          })
          
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error}`))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }, [validateField])

  const uploadExcel = useCallback(async (file: File, onSuccess?: (result: UploadResult) => void) => {
    setUploadStatus({
      status: 'processing',
      message: 'Processing Excel file...',
      fileName: file.name
    })

    try {
      const result = await processExcelFile(file)
      
      setUploadStatus({
        status: 'success',
        message: `Successfully processed ${result.totalRows} rows with ${result.errorCount} validation errors`,
        fileName: file.name,
        result
      })

      toast({
        title: "Upload Complete",
        description: `Processed ${result.totalRows} rows. ${result.errorCount} fields need correction.`,
      })

      onSuccess?.(result)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      setUploadStatus({
        status: 'error',
        message: errorMessage,
        fileName: file.name
      })

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }, [processExcelFile, toast])

  const resetUpload = useCallback(() => {
    setUploadStatus({ status: 'idle', message: '' })
  }, [])

  return {
    uploadStatus,
    uploadExcel,
    resetUpload
  }
}