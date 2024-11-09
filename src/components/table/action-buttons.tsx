import React from 'react'
import { Eye, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

type ActionButtonsProps<T> = {
    row: T
    onView?: (row: T) => void
    onRedirect?: (row: T) => void
    onDelete?: (row: T) => void
    onEdit?: () => void
}

export function ActionButtons<T>({
    row,
    onView,
    onDelete,
    onEdit,
    onRedirect
}: ActionButtonsProps<T>) {
    return (
        <div className="flex space-x-2">
            {onView && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onView(row)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            )}
            {onRedirect && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRedirect(row)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            )}
            {onDelete && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                selected item.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(row)}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {onEdit && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onEdit}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}