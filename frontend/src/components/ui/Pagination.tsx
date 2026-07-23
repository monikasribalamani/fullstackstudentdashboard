import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  if (totalItems === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{start}</span>–
        <span className="font-medium text-slate-700 dark:text-slate-300">{end}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
              …
            </span>
          ) : (
            <Button
              key={pageNumber}
              variant={pageNumber === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? 'page' : undefined}
              className="min-w-[2.25rem]"
            >
              {pageNumber}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function getPageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const result: Array<number | 'ellipsis'> = []
  sorted.forEach((pageNumber, index) => {
    if (index > 0) {
      const prev = sorted[index - 1]
      if (prev !== undefined && pageNumber - prev > 1) result.push('ellipsis')
    }
    result.push(pageNumber)
  })

  return result
}
