import { useMemo } from 'react'
import { ExtendedColumnDef } from './types'
import { Button } from '@/components/ui/button'
import { Eye, Trash2, Edit, Check, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

function SaveDiscardButtons({ onSave, onDiscard }: { onSave: () => void, onDiscard: () => void }) {
  return (
    <div className="flex space-x-2">
      <Button variant={"outline"} size="icon" onClick={onSave} className="bg-transparent border-0" title="Save Changes">
        <Check className="h-4 w-4 text-green-500" />
      </Button>
      <Button variant={"outline"} size="icon" onClick={onDiscard} className="bg-transparent border-0" title="Discard Changes">
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  color = "gray",
}: {
  onClick: () => void
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  color?: string
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      aria-label={label}
      type="button"
      className={`bg-transparent border-0 text-${color}-500`}
      title={label}  
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

function DeleteButton({ onDelete, row }: { onDelete: (row: any) => void, row: any }) {
  return (
 <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-transparent border-0 text-[#FF0800]"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <div className="flex justify-center items-center mb-4">
          <Trash2 className="h-12 w-12 text-[#FF0800]" />
        </div>

        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-[#FF0800] text-xl font-semibold text-center">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 dark:text-gray-300 text-center text-sm">
            This action cannot be undone. It will permanently delete the selected item.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-center gap-4 mt-6">
          <AlertDialogCancel className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md px-4 py-2 transition-all text-sm">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(row)}
            className="bg-[#FF0800] text-white hover:bg-red-700 rounded-md px-4 py-2 transition-all text-sm"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function useTableColumns<T extends object>({
  columns,
  editingRow,
  editedData,
  onView,
  onDelete,
  onRowEdit,
  onRedirect,
  setEditingRow,
  setEditedData,
}: {
  columns: ExtendedColumnDef<T>[]
  editingRow: T | null
  editedData: T | null
  onView?: (row: T) => void
  onDelete?: (row: T) => void
  onRowEdit?: (row: T) => void
  onRedirect?: (row: T) => void
  setEditingRow: (row: T | null) => void
  setEditedData: (data: T | null) => void
}) {
  return useMemo(() => {
    const actionColumn = {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: T } }) => {
        const isEditing = editingRow === row.original

        return isEditing ? (
          <SaveDiscardButtons
            onSave={() => {
              if (editedData && onRowEdit) {
                onRowEdit({ ...row.original, ...editedData })
                setEditingRow(null)
                setEditedData(null)
              }
            }}
            onDiscard={() => {
              setEditingRow(null)
              setEditedData(null)
            }}
          />
        ) : (
          <div className="flex space-x-">
            {onView && <ActionButton onClick={() => onView(row.original)} icon={Eye} label="View" />}
            {onRedirect && <ActionButton onClick={() => onRedirect(row.original)} icon={Edit} label="Edit" />}
            {onDelete && <DeleteButton onDelete={onDelete} row={row.original} />}
            {onRowEdit && (
              <ActionButton
                onClick={() => {
                  setEditingRow(row.original)
                  setEditedData({} as T)
                }}
                icon={Edit}
                label="Edit"
                color="blue"  
              />
            )}
          </div>
        )
      },
    }

    return (onView || onDelete || onRowEdit || onRedirect) ? [...columns, actionColumn] : columns
  }, [columns, onView, onDelete, onRowEdit, onRedirect, editingRow, editedData, setEditingRow, setEditedData])
}
