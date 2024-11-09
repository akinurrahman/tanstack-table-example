'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/table';
import moment from 'moment';

type Person = {
  id: number;
  name: string;
  age: number;
  status: string;
  birthDate: string;
  createdAt: string;
};

type ExtendedColumnDef<T> = ColumnDef<T> & {
  width?: string;
  isEditable?: boolean;
};

const columns: ExtendedColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    width: '20%',
    isEditable: false,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    width: '10%',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    width: '15%',
    meta: {
      fieldType: 'select',
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
  },
  {
    accessorKey: 'birthDate',
    header: 'Birth Date',
    width: '20%',
    meta : {
      fieldType : "date",
    },
    cell: ({ getValue }) => moment(getValue() as string).format('DD-MM-YYYY'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    meta : {
      fieldType: "date"
    },
    width: '20%',
    cell: ({ getValue }) => moment(getValue() as string).format('DD-MM-YYYY'),
  },
];

const initialData: Person[] = [
  { id: 1, name: 'Alice Johnson', age: 28, status: 'active', birthDate: '1995-05-15T10:00:00Z', createdAt: '2023-01-12T10:00:00Z' },
  { id: 2, name: 'Michael Brown', age: 34, status: 'inactive', birthDate: '1989-09-10T10:00:00Z', createdAt: '2023-01-15T11:30:00Z' },
  { id: 3, name: 'Sophia Davis', age: 22, status: 'pending', birthDate: '2001-02-25T10:00:00Z', createdAt: '2023-01-18T09:15:00Z' },
  { id: 4, name: 'Liam Martinez', age: 40, status: 'active', birthDate: '1983-07-05T10:00:00Z', createdAt: '2023-02-20T14:00:00Z' },
  { id: 5, name: 'Emma Wilson', age: 29, status: 'inactive', birthDate: '1994-12-30T10:00:00Z', createdAt: '2023-03-22T09:00:00Z' },
  { id: 6, name: 'James Taylor', age: 31, status: 'active', birthDate: '1992-03-20T10:00:00Z', createdAt: '2023-04-12T08:00:00Z' },
];

 function TableExample() {
  const [data, setData] = useState<Person[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(initialData);
      setLoading(false);
    }, 2000); // Simulate 2-second delay

    return () => clearTimeout(timer);
  }, []);

  const handleView = (row: Person) => {
    console.log('Viewing:', row);
  };

  const handleDelete = (row: Person) => {
    if (data) setData(data.filter((item) => item.id !== row.id));
    console.log('Deleting:', row);
  };

  const handleRowEdit = async (editedRow: Person) => {
    if (data) setData(data.map((row) => (row.id === editedRow.id ? editedRow : row)));
    console.log('Updated data:', editedRow);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reusable Table Example</h1>
      <Table
        columns={columns}
        data={data || []} 
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
        onRowEdit={handleRowEdit}
        // onRedirect={(row)=>console.log(row, "on redirect")}
      />
    </div>
  );
}


 const SuspenseWrapper =()=>{
  return (
    <Suspense fallback="Loading...">
      <TableExample/>
    </Suspense>
  )
}

export default SuspenseWrapper