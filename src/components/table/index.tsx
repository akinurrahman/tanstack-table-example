'use client'

import React, { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from '@tanstack/react-table'
import { EditableCell } from './editable-cell'
import { usePagination } from './use-pagination'
import { Button } from '@/components/ui/button'
import { ExtendedColumnDef, TableProps } from './types'
import { useTableColumns } from './use-table-columns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LoadingSkeleton } from './table-skeleton' 

export function Table<T extends object>({
    columns,
    data,
    onView,
    onDelete,
    onRowEdit,
    onRedirect,
    ITEMS_PER_PAGE = 5,
    loading = false,  
}: TableProps<T> & { loading?: boolean }) {
    const [editingRow, setEditingRow] = useState<T | null>(null)
    const [editedData, setEditedData] = useState<T | null>(null)

    const {
        currentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(data.length, ITEMS_PER_PAGE)

    const tableColumns = useTableColumns({
        columns,
        editingRow,
        editedData,
        onView,
        onDelete,
        onRowEdit,
        onRedirect,
        setEditingRow,
        setEditedData,
    })

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return data.slice(startIndex, endIndex)
    }, [data, currentPage, itemsPerPage])

    const table = useReactTable({
        data: paginatedData,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: totalPages,
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: itemsPerPage,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex: currentPage - 1, pageSize: itemsPerPage })
                goToPage(newState.pageIndex + 1)
                setItemsPerPage(newState.pageSize)
            }
        },
        manualPagination: true,
    })

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-4 text-left font-semibold text-gray-500 capitalize tracking-wider"
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
                        {loading ? (
                            // Render loading skeleton component with rows and columns
                            <LoadingSkeleton rows={ITEMS_PER_PAGE} columns={tableColumns.length} />
                        ) : data.length === 0 ? (
                            // Render "No Data" message when there's no data
                            <tr>
                                <td
                                    colSpan={tableColumns.length}
                                    className="px-6 py-28 text-center text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            // Render actual rows when data is available
                            table.getRowModel().rows.map((row) => (
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center space-x-2 justify-end">
                <Button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                >
                    <ChevronLeft />
                </Button>

                <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )
}
