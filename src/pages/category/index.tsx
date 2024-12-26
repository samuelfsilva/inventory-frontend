import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import DataTable from '@/components/table/data-table'
import { Category, NewCategory } from '@/types/category'
import { CategoryReview, UnknownResponse } from '@/types/response'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '@/utils/category'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [newCategory, setNewCategory] = useState<NewCategory>({
    description: '',
    isActive: true,
  })
  const [putCategory, setPutCategory] = useState<NewCategory>({
    description: '',
    isActive: true,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [insertErrors, setInsertErrors] = useState<CategoryReview>({})
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

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = (await createCategory(newCategory)) as AxiosResponse<
      Category | UnknownResponse
    >
    if (response.status !== 200) {
      const { error } = (await response.data) as UnknownResponse as {
        error: CategoryReview
      }

      if (error) {
        setInsertErrors(error)
      } else {
        setInsertErrors({})
      }
    }

    setNewCategory({ description: '', isActive: true })
    listUpdate()
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
    setNewCategory({ description: '', isActive: true })
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
      {/* <Navbar /> */}
      <HamburgerMenu links={links} />
      <div className={styles.menu}></div>
      <div>
        <Head>
          <title>Categories</title>
        </Head>
        <TextField
          label="Search Category"
          variant="outlined"
          margin="normal"
          size="small"
          className={styles.searchField}
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <form onSubmit={handleCreate}>
          <div className={styles.form}>
            <TextField
              label="New Category"
              variant="outlined"
              size="small"
              className={styles.searchField}
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              error={!!insertErrors.description}
              helperText={insertErrors.description}
            />
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
          </div>
        </form>
        <DataTable content={content} />
        {/* Dialog to delete a category */}
        <Dialog
          open={deleteOpenDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure you want to delete the category?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be undone
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={handleCloseDeleteDialog}
              autoFocus
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog to edit a category */}
        <Dialog
          open={editOpenDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={styles.dialogTitle} id="alert-dialog-title">
            {'Edit Category'}
          </DialogTitle>
          <DialogContent>
            <div className={styles.form}>
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
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={handleCloseEditDialog} autoFocus>
              Cancel
            </Button>
            <Button color="primary" onClick={handleConfirmEdit}>
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default CategoriaList
