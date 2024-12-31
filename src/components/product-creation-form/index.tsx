import { Category } from '@/types/category'
import { Group } from '@/types/group'
import { NewProduct, ProductResponse, ProductReview } from '@/types/product'
import { getCategories } from '@/utils/category'
import { getGroups } from '@/utils/group'
import { createProduct } from '@/utils/product'
import { Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface ProductCreationFormProps {
  handleUpdate?: () => void
}

const ProductCreationForm: React.FC<ProductCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    categoryId: '',
    groupId: '',
  })
  const [errors, setErrors] = useState<ProductReview>({})

  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])

  const fetchCategories = async () => {
    const response = await getCategories()
    setCategoryList(response)
  }

  const fetchGroups = async () => {
    const response = await getGroups()
    setGroupList(response)
  }

  React.useEffect(() => {
    fetchCategories()
    fetchGroups()
  }, [])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await createProduct(newProduct)

    if (response.status !== 200) {
      const { error } = response.data as ProductResponse

      if (error) {
        setErrors(error)
      } else {
        setErrors({})
        setNewProduct({
          name: '',
          description: '',
          categoryId: '',
          groupId: '',
        })
        handleUpdate?.()
      }
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Product"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextInput
          label="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          error={!!errors.description}
          helperText={errors.description}
        />
        <Autocomplete
          disablePortal
          options={categoryList}
          getOptionLabel={(option) => option.description}
          onChange={(e, value) => {
            if (value) setNewProduct({ ...newProduct, categoryId: value.id })
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
        <Autocomplete
          disablePortal
          options={groupList}
          getOptionLabel={(option) => option.description}
          onChange={(e, value) => {
            if (value) setNewProduct({ ...newProduct, groupId: value.id })
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Group" />}
        />
        <div className={styles.buttonCreateContainer}>
          <DefaultPrimaryButton text="Create" type="submit" />
        </div>
      </div>
    </form>
  )
}

export default ProductCreationForm
