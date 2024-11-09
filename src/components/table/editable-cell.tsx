import React from 'react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

type SelectOption = {
    label: string
    value: string
}

type EditableCellProps<T> = {
    value: string
    column: ColumnDef<T> & { isEditable?: boolean }
    onSave: (value: string) => void
}

export function EditableCell<T>({
    value,
    column,
    onSave,
}: EditableCellProps<T>) {
    const [editedValue, setEditedValue] = React.useState(value)

    const handleChange = (newValue: string) => {
        setEditedValue(newValue)
        onSave(newValue)
    }

    const fieldType = (column.meta as any)?.fieldType || 'text'
    const isEditable = column.isEditable !== false

    if (!isEditable) {
        return <span>{value}</span>
    }

    switch (fieldType) {
        case 'select':
            const options: SelectOption[] = (column.meta as any)?.options || []
            const selectedOption = options.find(opt => opt.value === editedValue)

            return (
                <Select
                    value={editedValue}
                    onValueChange={handleChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option">
                            {selectedOption ? selectedOption.label : 'Select an option'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case 'date':
            return (
                <Input
                    type="date"
                    value={moment(editedValue).format('YYYY-MM-DD')}
                    onChange={(e) => handleChange(moment(e.target.value).toISOString())}
                />
            )
        default:
            if (fieldType === 'select') {
                const options: SelectOption[] = (column.meta as any)?.options || []
                const selectedOption = options.find(opt => opt.value === value)
                return <span>{selectedOption ? selectedOption.label : value}</span>
            }
            return (
                <Input
                    type="text"
                    value={editedValue}
                    onChange={(e) => handleChange(e.target.value)}
                />
            )
    }
}