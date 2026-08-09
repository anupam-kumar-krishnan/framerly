"use client";

import { useState } from "react";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { LayerItem } from "./types";

export default function LayersPanel({
  layers,
  onLayers,
}: {
  layers: LayerItem[];
  onLayers: (l: LayerItem[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const toggleVisible = (id: LayerItem["id"]) => {
    onLayers(
      layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    );
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...layers];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    onLayers(next);
    setDragIndex(null);
  };

  return (
    <div className="space-y-2">
      <p className="mb-2 text-xs text-ink-faint">
        Drag to reorder. Top of the list renders in front.
      </p>
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          className={`flex items-center gap-2 rounded-lg border bg-panel-2 px-3 py-2.5 text-sm text-ink transition ${
            dragIndex === index ? "border-amber" : "border-line"
          }`}
        >
          <GripVertical
            size={14}
            className="shrink-0 cursor-grab text-ink-faint"
          />
          <span className="flex-1 truncate">{layer.label}</span>
          <button
            onClick={() => toggleVisible(layer.id)}
            className="text-ink-faint transition hover:text-ink"
          >
            {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      ))}
    </div>
  );
}
