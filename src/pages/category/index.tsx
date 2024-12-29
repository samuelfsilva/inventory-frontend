import CategoryCreationForm from '@/components/category-creation-form'
import DialogWindow from '@/components/dialog-window'
import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import DataTable from '@/components/table/data-table'
import TextEdit from '@/components/text-edit'
import { Category, NewCategory } from '@/types/category'
import { CategoryReview, UnknownResponse } from '@/types/response'
import {
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '@/utils/category'
import {
  Checkbox,
  DialogContent,
  DialogContentText,
  Divider,
  FormLabel,
  TextField,
} from '@mui/material'
import { AxiosResponse } from 'axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const CategoriaList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [putCategory, setPutCategory] = useState<NewCategory>({
    description: '',
    isActive: true,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [editErrors, setEditErrors] = useState<CategoryReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      listUpdate()
    }

    fetchCategories()
  }, [searchTerm])

  const listUpdate = async () => {
    const response = await getCategories()
    setCategories([])
    setCategories(
      response.filter((category) =>
        category.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)
    setEditOpenDialog(true)

    const data = await getCategory(id as string)
    setPutCategory({
      description: data.description,
      isActive: data.isActive,
    })
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredCategories = categories.filter((category) =>
    category.description.toLowerCase().includes(searchTerm.toLowerCase()),
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

    const response = (await deleteCategory(deleteId)) as AxiosResponse<
      Category | UnknownResponse
    >
    if (response.status === 204) {
      alert('Category deleted successfully')
    } else {
      alert('Error deleting category, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    handleCloseEditDialog()

    const response = (await updateCategory(
      editId as string,
      putCategory as NewCategory,
    )) as AxiosResponse<Category | UnknownResponse>

    if (response.status !== 200) {
      const { error } = (await response.data) as UnknownResponse as {
        error: CategoryReview
      }

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
    header: [
      { title: 'Description', size: 85 },
      { title: 'Status', size: 15 },
    ],
    data: filteredCategories.map((category) => ({
      id: category.id,
      description: category.description,
      isActive: category.isActive,
    })),
    handleDelete,
    handleUpdate,
  }

  return (
    <div className={styles.container}>
      <HamburgerMenu links={links} />
      <div>
        <Head>
          <title>Categories</title>
        </Head>
        <TextEdit
          label="Search Category"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <CategoryCreationForm handleUpdate={listUpdate} />
        <DataTable content={content} />
        {/* Dialog to delete a category */}
        <DialogWindow
          title="Are you sure you want to delete the category?"
          openDialog={deleteOpenDialog}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
        >
          <DialogContent>
            <DialogContentText>This action cannot be undone</DialogContentText>
          </DialogContent>
        </DialogWindow>
        {/* Dialog to edit a category */}
        <DialogWindow
          title="Edit Category"
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
              value={putCategory.description}
              onChange={(e) =>
                setPutCategory({
                  ...putCategory,
                  description: e.target.value,
                })
              }
              error={!!editErrors.description}
              helperText={editErrors.description}
            />
          </FormLabel>
          <FormLabel>
            Active:
            <Checkbox
              checked={putCategory.isActive}
              onChange={(e) =>
                setPutCategory({
                  ...putCategory,
                  isActive: e.target.checked,
                })
              }
            />
          </FormLabel>
        </DialogWindow>
      </div>
    </div>
  )
}

export default CategoriaList
