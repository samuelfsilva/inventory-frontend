import DialogWindow from '@/components/dialog-window'
import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import ProductCreationForm from '@/components/product-creation-form'
import DataTable from '@/components/table/data-table'
import TextEdit from '@/components/text-edit'
import { Category } from '@/types/category'
import { Group } from '@/types/group'
import {
  NewProduct,
  Product,
  ProductResponse,
  ProductReview,
} from '@/types/product'
import { getCategories } from '@/utils/category'
import { getGroups } from '@/utils/group'
import {
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '@/utils/product'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Autocomplete,
  DialogContent,
  DialogContentText,
  Divider,
  FormLabel,
  TextField,
} from '@mui/material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [putProduct, setPutProduct] = useState<NewProduct>({
    name: '',
    description: '',
    categoryId: '',
    groupId: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [editErrors, setEditErrors] = useState<ProductReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      listUpdate()
    }

    fetchProducts()
  }, [searchTerm])

  useEffect(() => {
    fetchCategories()
    fetchGroups()
  }, [])

  const fetchCategories = async () => {
    const response = await getCategories()
    setCategoryList(response)
  }

  const fetchGroups = async () => {
    const response = await getGroups()
    setGroupList(response)
  }

  const listUpdate = async () => {
    const response = await getProducts()
    setProducts([])
    setProducts(
      response.filter((product) =>
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)
    setEditOpenDialog(true)

    const data = await getProduct(id as string)
    setPutProduct({
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      groupId: data.groupId,
    })
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProducts = products.filter((product) =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCloseDeleteDialog = () => {
    setDeleteOpenDialog(false)
  }

  const handleCloseEditDialog = () => {
    setEditId('')
    setEditErrors({})
    setEditOpenDialog(false)
  }

  const handleConfirmDelete = async (event: React.FormEvent) => {
    event.preventDefault()

    handleCloseDeleteDialog()

    const response = await deleteProduct(deleteId)

    if (response.status === 204) {
      alert('Product deleted successfully')
    } else {
      alert('Error deleting product, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    handleCloseEditDialog()

    const response = await updateProduct(editId, putProduct)

    if (response.status !== 200) {
      const { error } = (await response.data) as ProductResponse

      if (error) {
        setEditErrors(error)
        setEditOpenDialog(true)
      } else {
        setEditErrors({})
        setEditOpenDialog(false)
        setEditId('')
      }
    } else {
      setEditOpenDialog(false)
      setEditId('')
    }

    listUpdate()
  }

  const content = {
    table: 'product',
    headers: [
      { title: 'Description', size: 85 },
      { title: 'Status', size: 15 },
    ],
    data: filteredProducts.map((product) => ({
      id: product.id,
      description: product.description,
      isActive: product.isActive,
    })),
    handleDelete,
    handleUpdate,
  }

  return (
    <div className={styles.container}>
      <HamburgerMenu links={links} />
      <div>
        <Head>
          <title>Products</title>
        </Head>
        <TextEdit
          label="Search Product"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <ProductCreationForm handleUpdate={listUpdate} />
        <DataTable content={content} />
        {/* Dialog to delete a product */}
        <DialogWindow
          title="Delete Product"
          openDialog={deleteOpenDialog}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
        >
          <DialogContent className={styles.dialogContent}>
            <WarningAmberIcon className={styles.dialogIcon} />
            <DialogContentText>
              Are you sure you want to delete the product? <br /> This action
              cannot be undone
            </DialogContentText>
          </DialogContent>
        </DialogWindow>
        {/* Dialog to edit a product */}
        <DialogWindow
          title="Edit Product"
          openDialog={editOpenDialog}
          handleCloseDialog={handleCloseEditDialog}
          handleConfirm={handleConfirmEdit}
        >
          <FormLabel className={styles.formLabel}>
            Description:
            <TextField
              className={styles.formLabelTextField}
              type="text"
              size="small"
              value={putProduct.description}
              onChange={(e) =>
                setPutProduct({
                  ...putProduct,
                  description: e.target.value,
                })
              }
              error={!!editErrors.description}
              helperText={editErrors.description}
            />
          </FormLabel>
          <FormLabel>
            Category:
            <Autocomplete
              disablePortal
              options={categoryList}
              onChange={(e, value) => {
                if (value)
                  setPutProduct({ ...putProduct, categoryId: value.id })
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="" />}
            />
          </FormLabel>
          <FormLabel>
            Group:
            <Autocomplete
              disablePortal
              options={groupList}
              onChange={(e, value) => {
                if (value) setPutProduct({ ...putProduct, groupId: value.id })
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="" />}
            />
          </FormLabel>
        </DialogWindow>
      </div>
    </div>
  )
}

export default ProductList
