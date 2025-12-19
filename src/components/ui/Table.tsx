import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Table component for displaying tabular data with sorting support
 *
 * @example
 * ```tsx
 * <Table variant="simple">
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeadCell sortable sortField="name" onSort={handleSort}>
 *         Name
 *       </Table.HeadCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John Doe</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'simple' | 'striped' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hover?: boolean
  selected?: boolean
  children: React.ReactNode
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
  children?: React.ReactNode
}

interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  sortField?: string
  onSort?: (field: string) => void
  currentSort?: SortState
  children?: React.ReactNode
}

interface TableEmptyStateProps {
  colSpan?: number
  children: React.ReactNode
}

export function Table({
  variant = 'simple',
  size = 'md',
  children,
  className = '',
  ...props
}: TableProps) {
  const baseStyles = 'min-w-full divide-y divide-gray-200'

  const variantStyles = {
    simple: '',
    striped: '[&_tbody_tr:nth-child(odd)]:bg-gray-50',
    bordered: 'border border-gray-200'
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function TableHead({ children, className = '', ...props }: TableSectionProps) {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  )
}

function TableBody({ children, className = '', ...props }: TableSectionProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </tbody>
  )
}

function TableRow({
  hover = false,
  selected = false,
  children,
  className = '',
  ...props
}: TableRowProps) {
  const hoverStyle = hover ? 'hover:bg-gray-50' : ''
  const selectedStyle = selected ? 'bg-indigo-50' : ''

  return (
    <tr className={`${hoverStyle} ${selectedStyle} ${className}`} {...props}>
      {children}
    </tr>
  )
}

function TableCell({
  align = 'left',
  children,
  className = '',
  ...props
}: TableCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${alignStyles[align]} ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}

function TableHeadCell({
  align = 'left',
  sortable = false,
  sortField,
  onSort,
  currentSort,
  children,
  className = '',
  ...props
}: TableHeadCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const baseStyles =
    'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
  const sortableStyles = sortable ? 'cursor-pointer hover:bg-gray-100' : ''

  const isSorted = sortable && currentSort && sortField === currentSort.field

  const handleClick = () => {
    if (sortable && sortField && onSort) {
      onSort(sortField)
    }
  }

  return (
    <th
      className={`${baseStyles} ${alignStyles[align]} ${sortableStyles} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="ml-1">
            {isSorted ? (
              currentSort.direction === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            ) : (
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-30" />
            )}
          </span>
        )}
      </div>
    </th>
  )
}

function TableEmptyState({ colSpan, children }: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-sm text-gray-500">
        {children}
      </td>
    </tr>
  )
}

Table.Head = TableHead
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
Table.HeadCell = TableHeadCell
Table.EmptyState = TableEmptyState
