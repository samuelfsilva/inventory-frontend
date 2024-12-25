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
    header: {
      title: string
      size: number
    }[]
    data: {
      id: string
      description: string
      isActive: boolean
    }[]
  }
}

const DataTable: React.FC<DataTableProps> = ({ content }) => {
  return (
    <React.Fragment>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          {/* Cabeçalho da tabela */}
          <TableHead>
            <TableRow>
              {content.header.map((header, index) => (
                <TableCell
                  key={index}
                  style={{ fontWeight: 'bold', width: `${header.size}%` }}
                >
                  {header.title}
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
            {content.data
              .sort((a, b) =>
                a.description.localeCompare(b.description, undefined, {
                  numeric: true,
                }),
              )
              .map((category, index) => (
                <TableRow
                  key={category.id}
                  style={{
                    backgroundColor: index % 2 == 0 ? '#F8F8FF' : '#FFFFFF',
                  }}
                >
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </TableCell>
                  <TableCell>
                    {/* Botões para editar e excluir */}
                    <Button
                      style={{ marginRight: '10px' }}
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(category.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  )
}

export default DataTable
