import { BatchResponse, BatchReview, NewBatch } from '@/types/batch'
import { createBatch } from '@/utils/batch'
import { Typography } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface BatchCreationFormProps {
  handleUpdate?: () => void
}

const BatchCreationForm: React.FC<BatchCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newBatch, setNewBatch] = useState<NewBatch>({
    description: '',
    expirationDate: null,
  })
  const [errors, setErrors] = useState<BatchReview>({})
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await createBatch(newBatch)

    if (response.status !== 200) {
      const { error } = response.data as BatchResponse

      if (error) {
        setErrors(error)
      } else {
        setErrors({})
        setNewBatch({ description: '', expirationDate: null })
        handleUpdate?.()
      }
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Batch"
          value={newBatch.description}
          onChange={(e) =>
            setNewBatch({ ...newBatch, description: e.target.value })
          }
          error={!!errors.description}
          helperText={errors.description}
        />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiration Date"
              value={dayjs(newBatch.expirationDate)}
              onChange={(value) => {
                setNewBatch({
                  ...newBatch,
                  expirationDate: value ? value.toDate() : null,
                })
              }}
            />
            {errors.expirationDate && (
              <Typography className={styles.errorExpirationDate}>
                {errors.expirationDate}
              </Typography>
            )}
          </LocalizationProvider>
        </div>
        <div className={styles.buttonCreateContainer}>
          <DefaultPrimaryButton text="Create" props={{ type: 'submit' }} />
        </div>
      </div>
    </form>
  )
}

export default BatchCreationForm
