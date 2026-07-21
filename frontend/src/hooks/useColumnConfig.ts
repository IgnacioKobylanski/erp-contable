import { useState, useEffect } from "react";

interface ColumnConfig<T extends string> {
  order: T[];
  hidden: T[];
}

export function useColumnConfig<T extends string>(
  storageKey: string,
  allColumns: readonly T[],
) {
  const [config, setConfig] = useState<ColumnConfig<T>>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ColumnConfig<T>;
        const validOrder = parsed.order.filter((col) =>
          allColumns.includes(col),
        );
        const missing = allColumns.filter((col) => !validOrder.includes(col));
        return {
          order: [...validOrder, ...missing],
          hidden: parsed.hidden.filter((col) => allColumns.includes(col)),
        };
      } catch {
        return { order: [...allColumns], hidden: [] };
      }
    }
    return { order: [...allColumns], hidden: [] };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(config));
  }, [storageKey, config]);

  const isVisible = (column: T) => !config.hidden.includes(column);

  const toggleColumn = (column: T) => {
    setConfig((prev) => ({
      ...prev,
      hidden: prev.hidden.includes(column)
        ? prev.hidden.filter((c) => c !== column)
        : [...prev.hidden, column],
    }));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    setConfig((prev) => {
      const newOrder = [...prev.order];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      return { ...prev, order: newOrder };
    });
  };

  const resetConfig = () => {
    setConfig({ order: [...allColumns], hidden: [] });
  };

  return {
    order: config.order,
    isVisible,
    toggleColumn,
    moveColumn,
    resetConfig,
  };
}
