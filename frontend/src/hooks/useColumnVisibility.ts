import { useState, useEffect } from 'react';

export function useColumnVisibility<T extends string>(
  storageKey: string,
  allColumns: readonly T[],
  defaultVisible: readonly T[] = allColumns
) {
  const [visibleColumns, setVisibleColumns] = useState<T[]>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as T[];
        return parsed.filter((col) => allColumns.includes(col));
      } catch {
        return [...defaultVisible];
      }
    }
    return [...defaultVisible];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
  }, [storageKey, visibleColumns]);

  const toggleColumn = (column: T) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const isVisible = (column: T) => visibleColumns.includes(column);

  return { visibleColumns, toggleColumn, isVisible };
}