import { Batch } from '@/types/batch'
import { Category } from '@/types/category'
import { Group } from '@/types/group'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import styles from './data-table.module.css'

interface DataTableProps {
  content: {
    table: string
    headers: {
      title: string
      size: number
    }[]
    data: Category[] | Batch[] | Group[]
    handleDelete: (id: string) => void
    handleUpdate: (id: string) => void
  }
}

const DataTable: React.FC<DataTableProps> = ({ content }) => {
  const { handleDelete, handleUpdate, headers, table, data } = content

  const actionButtons = (id: string) => {
    return (
      <TableCell className={styles.tableAction}>
        <Button
          variant="contained"
          className={styles.editButton}
          onClick={() => handleUpdate(id)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          className={styles.deleteButton}
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
      </TableCell>
    )
  }

  const CategoryContent = (data: Category[]) => {
    return data
      .sort((a, b) =>
        a.description.localeCompare(b.description, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.description}</TableCell>
          <TableCell>{item.isActive ? 'Active' : 'Inactive'}</TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  const BatchContent = (data: Batch[]) => {
    return data
      .sort((a, b) =>
        a.description.localeCompare(b.description, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.description}</TableCell>
          <TableCell>
            {new Date(item.expirationDate).toLocaleDateString('en-US')}
          </TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  const GroupContent = (data: Group[]) => {
    return data
      .sort((a, b) =>
        a.description.localeCompare(b.description, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.description}</TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  return (
    <React.Fragment>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          {/* Cabeçalho da tabela */}
          <TableHead>
            <TableRow>
              {headers.map((item, index) => (
                <TableCell
                  key={index}
                  style={{ fontWeight: 'bold', width: `${item.size}%` }}
                >
                  {item.title}
                </TableCell>
              ))}
              <TableCell
                style={{
                  fontWeight: 'bold',
                  width: '15%',
                  minWidth: '180px',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Corpo da tabela */}
          <TableBody>
            {table === 'category' && CategoryContent(data as Category[])}
            {table === 'batch' && BatchContent(data as Batch[])}
            {table === 'group' && GroupContent(data as Group[])}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  )
}

export default DataTable
