import React from 'react';

interface LoadingSkeletonProps {
    rows: number;
    columns: number;
}

export function LoadingSkeleton({ rows, columns }: LoadingSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
