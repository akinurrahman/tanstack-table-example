import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function usePagination(
  totalItems: number,
  defaultItemsPerPage: number = 5
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    router.push(`?page=${newPage}`);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
}
