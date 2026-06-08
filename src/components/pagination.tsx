import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  setCurrentPage:  React.Dispatch<React.SetStateAction<number>>
}

export function Pagination({ currentPage, totalPages, baseUrl, setCurrentPage }: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center space-x-2">
      {/* Previous Button */}
      {currentPage > 1 && (
          <Button 
            variant="outline" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground hover:bg-white/10"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
          <Button
            variant={page === currentPage ? "default" : "outline"}
            className={`
              ${page === currentPage
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/10'}
            `}
            onClick={() => setCurrentPage(page)}
            key={page}
          >
            {page}
          </Button>
      ))}

      {/* Next Button */}
      {currentPage < totalPages && (
          <Button 
            variant="outline" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground hover:bg-white/10"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="size-5" />
          </Button>
      )}
    </div>
  )
}