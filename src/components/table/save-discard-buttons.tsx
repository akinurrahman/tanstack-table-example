import React from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SaveDiscardButtonsProps = {
    onSave: () => void
    onDiscard: () => void
}

export function SaveDiscardButtons({ onSave, onDiscard }: SaveDiscardButtonsProps) {
    return (
        <div className="flex space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={onSave}
            >
                <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={onDiscard}
            >
                <X className="h-4 w-4 text-red-500" />
            </Button>
        </div>
    )
}