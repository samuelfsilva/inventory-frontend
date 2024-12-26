import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import DataTable from '@/components/table/data-table'
import { Batch, NewBatch } from '@/types/batch'
import { BatchReview, UnknownResponse } from '@/types/response'
import {
  createBatch,
  deleteBatch,
  getBatch,
  getBatches,
  updateBatch,
} from '@/utils/batch'
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

const BatchList: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([])
  const [newBatch, setNewBatch] = useState<NewBatch>({
    description: '',
    expirationDate: new Date(),
  })
  const [putBatch, setPutBatch] = useState<NewBatch>({
    description: '',
    expirationDate: new Date(),
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [insertErrors, setInsertErrors] = useState<BatchReview>({})
  const [editErrors, setEditErrors] = useState<BatchReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')

  useEffect(() => {
    const fetchBatches = async () => {
      listUpdate()
    }

    fetchBatches()
  }, [searchTerm])

  const listUpdate = async () => {
    const response = await getBatches()
    setBatches([])
    setBatches(
      response.filter((batch) =>
        batch.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = (await createBatch(newBatch)) as AxiosResponse<
      Batch | UnknownResponse
    >
    if (response.status !== 200) {
      const { error } = (await response.data) as UnknownResponse as {
        error: BatchReview
      }

      if (error) {
        setInsertErrors(error)
      } else {
        setInsertErrors({})
      }
    }

    setNewBatch({ description: '', expirationDate: new Date() })
    listUpdate()
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)
    setEditOpenDialog(true)

    const data = await getBatch(id as string)
    setPutBatch({
      description: data.description,
      expirationDate: data.expirationDate,
    })
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredBatches = batches.filter((batch) =>
    batch.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCloseDeleteDialog = () => {
    setDeleteOpenDialog(false)
  }

  const handleCloseEditDialog = () => {
    setEditId('')
    setNewBatch({ description: '', expirationDate: new Date() })
    setEditErrors({})
    setEditOpenDialog(false)
  }

  const handleConfirmDelete = async (event: React.FormEvent) => {
    event.preventDefault()

    handleCloseDeleteDialog()

    const response = (await deleteBatch(deleteId)) as AxiosResponse<
      Batch | UnknownResponse
    >
    if (response.status === 204) {
      alert('Batch deleted successfully')
    } else {
      alert('Error deleting batch, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    handleCloseEditDialog()

    const response = (await updateBatch(
      editId as string,
      putBatch as NewBatch,
    )) as AxiosResponse<Batch | UnknownResponse>

    if (response.status !== 200) {
      const { error } = (await response.data) as UnknownResponse as {
        error: BatchReview
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
      { title: 'Expiration Date', size: 15 },
    ],
    data: filteredBatches.map((batch) => ({
      id: batch.id,
      description: batch.description,
      expirationDate: batch.expirationDate,
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
          <title>Batches</title>
        </Head>
        <TextField
          label="Search Batch"
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
              label="New Batch"
              variant="outlined"
              size="small"
              className={styles.searchField}
              value={newBatch.description}
              onChange={(e) =>
                setNewBatch({ ...newBatch, description: e.target.value })
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
        {/* Dialog to delete a batch */}
        <Dialog
          open={deleteOpenDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure you want to delete the batch?'}
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
        {/* Dialog to edit a batch */}
        <Dialog
          open={editOpenDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={styles.dialogTitle} id="alert-dialog-title">
            {'Edit Batch'}
          </DialogTitle>
          <DialogContent>
            <div className={styles.form}>
              <FormLabel className={styles.formLabel}>
                Description:
                <TextField
                  className={styles.formLabelTextField}
                  type="text"
                  size="small"
                  value={putBatch.description}
                  onChange={(e) =>
                    setPutBatch({
                      ...putBatch,
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
                  checked={putBatch.expirationDate}
                  onChange={(e) =>
                    setPutBatch({
                      ...putBatch,
                      expirationDate: e.target.checked,
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

export default BatchList
