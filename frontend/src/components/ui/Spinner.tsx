import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Loading...' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400" role="status">
      <Loader2 className={cn('h-8 w-8 animate-spin text-primary-500', className)} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
