'use client'

import React, { useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'
import { EditableCell } from './editable-cell'
import { ActionButtons } from './action-buttons'
import { SaveDiscardButtons } from './save-discard-buttons'
import moment from 'moment'

type ExtendedColumnDef<T> = ColumnDef<T> & {
    width?: string
    isEditable?: boolean
    meta?: {
        fieldType?: string;
        options?: { label: string; value: any }[];
    }
}

type TableProps<T extends object> = {
    columns: ExtendedColumnDef<T>[]
    data: T[]
    onView?: (row: T) => void
    onDelete?: (row: T) => void
    onRowEdit?: (row: T) => Promise<void>
    onRedirect?: (row: T) => void
}

export function Table<T extends object>({
    columns,
    data,
    onView,
    onDelete,
    onRowEdit,
    onRedirect,
}: TableProps<T>) {
    const [editingRow, setEditingRow] = useState<T | null>(null)
    const [editedData, setEditedData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const tableColumns = React.useMemo(() => {
        const cols = [...columns]
        if (onView || onDelete || onRowEdit || onRedirect) {
            cols.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    editingRow === row.original ? (
                        <SaveDiscardButtons
                            onSave={async () => {
                                if (editedData && onRowEdit) {
                                    setIsLoading(true)
                                    try {
                                        const processedData = Object.entries(editedData).reduce((acc, [key, value]) => {
                                            if (moment.isMoment(value) || moment.isDate(value)) {
                                                acc[key] = moment(value).toISOString()
                                            } else {
                                                acc[key] = value
                                            }
                                            return acc
                                        }, {} as T)
                                        await onRowEdit({ ...row.original, ...processedData })
                                    } finally {
                                        setIsLoading(false)
                                        setEditingRow(null)
                                        setEditedData(null)
                                    }
                                }
                            }}
                            onDiscard={() => {
                                setEditingRow(null)
                                setEditedData(null)
                            }}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ActionButtons
                            row={row.original}
                            onView={onView}
                            onRedirect={onRedirect}
                            onDelete={onDelete}
                            onEdit={onRowEdit ? () => {
                                setEditingRow(row.original)
                                setEditedData({} as T)
                            } : undefined}
                        />
                    )
                ),
            })
        }
        return cols
    }, [columns, onView, onDelete, onRowEdit, onRedirect, editingRow, editedData, isLoading])

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: (header.column.columnDef as ExtendedColumnDef<T>).width }}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap" style={{ width: (cell.column.columnDef as ExtendedColumnDef<T>).width }}>
                                    {editingRow === row.original && cell.column.id !== 'actions' ? (
                                        <EditableCell
                                            value={cell.getValue() as string}
                                            column={cell.column.columnDef as ExtendedColumnDef<T>}
                                            onSave={(value) => {
                                                setEditedData((prev) => ({
                                                    ...prev,
                                                    [cell.column.id]: value,
                                                } as T))
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {(cell.column.columnDef as ExtendedColumnDef<T>).meta?.fieldType === 'select' ? (
                                                (() => {
                                                    const options = (cell.column.columnDef as ExtendedColumnDef<T>).meta?.options || []
                                                    const selectedOption = options.find(opt => opt.value === cell.getValue())
                                                    return selectedOption ? selectedOption.label : cell.getValue()
                                                })()
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}