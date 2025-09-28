import React from "react";
import { usePagination, DOTS } from "@/hooks/usePaginationHooks";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
  siblingCount = 1,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <nav>
      <ul className="inline-flex items-center -space-x-px text-sm">
        <li>
          <button
            onClick={onPrevious}
            disabled={currentPage === 1}
            className="flex items-center justify-center h-10 px-3 ml-0 leading-tight text-gray-800 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaRegArrowAltCircleLeft className="mr-2" />
            Previous
          </button>
        </li>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li
                key={index}
                className="flex items-center justify-center h-10 px-3 leading-tight text-gray-800 bg-white border border-gray-300"
              >
                ...
              </li>
            );
          }

          return (
            <li key={index}>
              <button
                onClick={() => onPageChange(pageNumber as number)}
                className={`flex items-center justify-center h-10 px-3 leading-tight border border-gray-300 ${
                  currentPage === pageNumber
                    ? "text-blue-600 bg-blue-50 font-bold"
                    : "text-gray-800 bg-white hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        <li>
          <button
            onClick={onNext}
            disabled={currentPage === lastPage}
            className="flex items-center justify-center h-10 px-3 leading-tight text-gray-800 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FaRegArrowAltCircleRight className="ml-2" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
