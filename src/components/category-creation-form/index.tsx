import { Category, NewCategory } from '@/types/category'
import { CategoryReview, UnknownResponse } from '@/types/response'
import { createCategory } from '@/utils/category'
import { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface CategoryCreationFormProps {
  handleUpdate?: () => void
}

const CategoryCreationForm: React.FC<CategoryCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newCategory, setNewCategory] = useState<NewCategory>({
    description: '',
    isActive: true,
  })
  const [insertErrors, setInsertErrors] = useState<CategoryReview>({})
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

    if (handleUpdate) {
      handleUpdate()
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Category"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          error={!!insertErrors.description}
          helperText={insertErrors.description}
        />
        <DefaultPrimaryButton text="Create" type="submit" />
      </div>
    </form>
  )
}

export default CategoryCreationForm
