import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit3, Save, X, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Define the product structure based on your screenshots
interface Product {
  id: string
  stockId: string
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

// Sample data based on your screenshots
const sampleProducts: Product[] = [
  {
    id: '1',
    stockId: 'SD002529',
    shape: 'Emerald',
    carat: 4.42,
    color: 'F',
    clarity: 'VS2',
    cut: 'Very Good',
    polish: 'Very Good',
    symmetry: 'Very Good',
    fluorescence: 'Faint',
    laboratory: 'GIA',
    certificateNumber: '683550971',
    measurements: '6.93*6.63*5.05',
    depthPercentage: 46,
    tablePercentage: 65,
    pricePerCarat: 364.18,
    totalPrice: 1824.55,
    growthType: 'CVD',
    fancyColor: 'Yellow',
    fancyColorIntensity: 'Fancy Vivid',
    fancyColorOvertone: 'Pink',
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
    stockId: 'SD002528',
    shape: 'Emerald',
    carat: 3.88,
    color: 'G',
    clarity: 'VS1',
    cut: 'Good',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    laboratory: 'HRD',
    certificateNumber: '683550971',
    measurements: '6.93*6.63*5.05',
    depthPercentage: 46,
    tablePercentage: 65,
    pricePerCarat: 364.18,
    totalPrice: 1824.55,
    growthType: 'CVD',
    fancyColor: 'Yellow',
    fancyColorIntensity: 'Fancy Vivid',
    fancyColorOvertone: 'Green',
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

export function InventorySpreadsheet() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleEdit = useCallback((product: Product) => {
    setEditingId(product.id)
    setEditingProduct({ ...product })
  }, [])

  const handleSave = useCallback(() => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p))
      setEditingId(null)
      setEditingProduct(null)
      toast({
        title: "Product Updated",
        description: "Product has been successfully updated.",
      })
    }
  }, [editingProduct, toast])

  const handleCancel = useCallback(() => {
    setEditingId(null)
    setEditingProduct(null)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast({
      title: "Product Deleted",
      description: "Product has been successfully deleted.",
      variant: "destructive"
    })
  }, [toast])

  const handleAddNew = useCallback(() => {
    const newProduct: Product = {
      id: Date.now().toString(),
      stockId: '',
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
    handleEdit(newProduct)
  }, [handleEdit])

  const updateEditingProduct = useCallback((field: keyof Product, value: string | number) => {
    if (editingProduct) {
      setEditingProduct(prev => prev ? { ...prev, [field]: value } : null)
    }
  }, [editingProduct])

  const renderCell = (product: Product, field: keyof Product, isEditing: boolean) => {
    const value = product[field]
    
    if (isEditing) {
      return (
        <Input
          value={value?.toString() || ''}
          onChange={(e) => {
            const newValue = typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
            updateEditingProduct(field, newValue)
          }}
          className="h-8 text-xs"
        />
      )
    }
    
    return (
      <div className="px-2 py-1 text-xs truncate" title={value?.toString()}>
        {value?.toString() || '-'}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-primary">Diamond Inventory Management</CardTitle>
        <Button onClick={handleAddNew} variant="brand" size="sm">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[2000px]">
            {/* Header Row */}
            <div className="grid grid-cols-26 bg-primary text-primary-foreground text-xs font-medium">
              <div className="p-2 border-r border-primary-foreground/20">Actions</div>
              <div className="p-2 border-r border-primary-foreground/20">Stock ID</div>
              <div className="p-2 border-r border-primary-foreground/20">Shape</div>
              <div className="p-2 border-r border-primary-foreground/20">Carat</div>
              <div className="p-2 border-r border-primary-foreground/20">Color</div>
              <div className="p-2 border-r border-primary-foreground/20">Clarity</div>
              <div className="p-2 border-r border-primary-foreground/20">Cut</div>
              <div className="p-2 border-r border-primary-foreground/20">Polish</div>
              <div className="p-2 border-r border-primary-foreground/20">Symmetry</div>
              <div className="p-2 border-r border-primary-foreground/20">Fluorescence</div>
              <div className="p-2 border-r border-primary-foreground/20">Laboratory</div>
              <div className="p-2 border-r border-primary-foreground/20">Certificate #</div>
              <div className="p-2 border-r border-primary-foreground/20">Measurements</div>
              <div className="p-2 border-r border-primary-foreground/20">Depth %</div>
              <div className="p-2 border-r border-primary-foreground/20">Table %</div>
              <div className="p-2 border-r border-primary-foreground/20">Price/Carat</div>
              <div className="p-2 border-r border-primary-foreground/20">Total Price</div>
              <div className="p-2 border-r border-primary-foreground/20">Growth Type</div>
              <div className="p-2 border-r border-primary-foreground/20">Fancy Color</div>
              <div className="p-2 border-r border-primary-foreground/20">FC Intensity</div>
              <div className="p-2 border-r border-primary-foreground/20">FC Overtone</div>
              <div className="p-2 border-r border-primary-foreground/20">Seller Name</div>
              <div className="p-2 border-r border-primary-foreground/20">Seller Company</div>
              <div className="p-2 border-r border-primary-foreground/20">Seller Location</div>
              <div className="p-2 border-r border-primary-foreground/20">Seller Phone</div>
              <div className="p-2">Certificate URL</div>
            </div>
            
            {/* Data Rows */}
            {products.map((product, index) => {
              const isEditing = editingId === product.id
              return (
                <div 
                  key={product.id} 
                  className={`grid grid-cols-26 border-b border-border hover:bg-accent/50 ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                  }`}
                >
                  {/* Actions */}
                  <div className="p-1 border-r border-border flex gap-1">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          variant="success"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          variant="destructive"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Product Data */}
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'stockId', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'shape', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'carat', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'color', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'clarity', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'cut', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'polish', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'symmetry', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'fluorescence', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'laboratory', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'certificateNumber', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'measurements', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'depthPercentage', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'tablePercentage', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'pricePerCarat', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'totalPrice', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'growthType', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'fancyColor', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'fancyColorIntensity', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'fancyColorOvertone', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'sellerName', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'sellerCompany', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'sellerLocation', isEditing)}</div>
                  <div className="border-r border-border">{renderCell(isEditing ? editingProduct! : product, 'sellerPhone', isEditing)}</div>
                  <div>{renderCell(isEditing ? editingProduct! : product, 'certificateUrl', isEditing)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}