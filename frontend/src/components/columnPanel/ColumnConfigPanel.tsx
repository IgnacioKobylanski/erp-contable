import { useState } from 'react';

interface ColumnConfigPanelProps<T extends string> {
  order: T[];
  labels: Record<T, string>;
  isVisible: (column: T) => boolean;
  toggleColumn: (column: T) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  resetConfig: () => void;
}

export function ColumnConfigPanel<T extends string>({
  order,
  labels,
  isVisible,
  toggleColumn,
  moveColumn,
  resetConfig,
}: ColumnConfigPanelProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    moveColumn(draggedIndex, index);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="columnPanel">
      {order.map((column, index) => (
        <div
          key={column}
          className={`columnRow ${draggedIndex === index ? 'columnRowDragging' : ''}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
        >
          <span className="dragHandle">⠿</span>
          <label className="columnOption">
            <input
              type="checkbox"
              checked={isVisible(column)}
              onChange={() => toggleColumn(column)}
            />
            {labels[column]}
          </label>
        </div>
      ))}
      <button type="button" className="resetColumnsButton" onClick={resetConfig}>
        Restablecer
      </button>
    </div>
  );
}