import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { type SelectProps } from "./types";
import { ImageWithFallback } from "../ImageWithFallback";
import { Tooltip } from "../Tooltip";

export function Select({
  options,
  value,
  onChange,
  isLoading,
  placeholder = "Sélectionner...",
  className = "",
  title,
}: Readonly<SelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const selectedOptionRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.id === value);

  // Descend dans la liste pour afficher l'option sélectionnée
  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }
  }, [isOpen]);

  // Masque le tooltip quand le select est ouvert
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="h-10 w-[150px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <div ref={containerRef} className={`relative min-w-[150px] ${className}`}>
      <Tooltip
        content={title}
        open={showTooltip && !isOpen}
        onOpenChange={setShowTooltip}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          type="button"
        >
          <div className="flex items-center truncate">
            {selectedOption ? (
              <>
                {selectedOption.imageUrl && (
                  <ImageWithFallback
                    src={selectedOption.imageUrl}
                    className="mr-2 h-5 w-5 flex-shrink-0 rounded-full"
                  />
                )}
                <span className="truncate">{selectedOption.label}</span>
                {selectedOption.suffix && (
                  <span className="ml-2 flex-shrink-0 text-gray-500 dark:text-gray-400">
                    {selectedOption.suffix}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <svg
            className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </Tooltip>
      {isOpen && (
        <div className="absolute left-0 right-0 top-12 z-10 max-h-60 space-y-1 overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => (
            <button
              key={option.id}
              ref={option.id === value ? selectedOptionRef : null}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm transition-colors
                ${
                  option.id === value
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              type="button"
            >
              {option.imageUrl && (
                <ImageWithFallback
                  src={option.imageUrl}
                  className="mr-2 h-5 w-5 flex-shrink-0 rounded-full"
                />
              )}
              <span className="truncate dark:text-white">{option.label}</span>
              {option.suffix && (
                <span className="ml-2 flex-shrink-0 text-gray-500 dark:text-gray-400">
                  {option.suffix}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
