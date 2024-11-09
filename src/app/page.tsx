'use client'

import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@/components/table'
import moment from 'moment'

type Person = {
  id: number
  name: string
  age: number
  status: string
  birthDate: string
  createdAt: string
}

type ExtendedColumnDef<T> = ColumnDef<T> & {
  width?: string
  isEditable?: boolean
}

const columns: ExtendedColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    width: '20%',
    isEditable: false
  },
  {
    accessorKey: 'age',
    header: 'Age',
    width: '20%',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    width: '20%',
    meta: {
      fieldType: 'select',
      options: [
        { label: "Active", value: "123" },
        { label: "Inactive", value: "456" },
        { label: "Pending", value: "789" }
      ],
    },
  },
  {
    accessorKey: 'birthDate',
    header: 'Birth Date',
    width: '20%',
    meta: {
      fieldType: 'date',
    },
    cell: ({ getValue }) => moment(getValue() as string).format('DD MMM YYYY'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    width: '20%',
    meta: {
      fieldType: 'date',
    },
    cell: ({ getValue }) => moment(getValue() as string).format('DD MMM YYYY HH:mm'),
  },

]

const initialData: Person[] = [
  { id: 1, name: 'John Doe', age: 30, status: '123', birthDate: '1993-05-15', createdAt: '2023-06-01T10:00:00Z' },
  { id: 2, name: 'Jane Smith', age: 25, status: '456', birthDate: '1998-08-22', createdAt: '2023-06-02T11:30:00Z' },
  { id: 3, name: 'Bob Johnson', age: 35, status: '789', birthDate: '1988-11-30', createdAt: '2023-06-03T09:15:00Z' },
]

export default function TableExample() {
  const [data, setData] = useState(initialData)

  const handleView = (row: Person) => {
    console.log('Viewing:', row)
  }

  const handleDelete = (row: Person) => {
    setData(data.filter((item) => item.id !== row.id))
  }

  const handleRowEdit = async (editedRow: Person) => {
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Sending to backend:', editedRow)
    setData(data.map((row) => (row.id === editedRow.id ? editedRow : row)))
  }

  const handleRedirect = (row: Person) => {
    console.log("redirecting ", row.id, "to /somewehrew")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reusable Table Example</h1>
      <Table
        columns={columns}
        data={data}
        onView={handleView}
        onDelete={handleDelete}
        onRowEdit={handleRowEdit}
        // onRedirect={handleRedirect}
      />
    </div>
  )
}