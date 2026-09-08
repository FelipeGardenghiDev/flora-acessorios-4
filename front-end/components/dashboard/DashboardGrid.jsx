import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2 } from 'lucide-react';

const DEFAULT_KEY = 'dashboard_widget_order';
// Precisa bater com as classes do container: grid-cols-12 e gap-4 (1rem) e
// auto-rows-[minmax(120px,auto)] — é a partir desses valores que o resize
// converte pixels arrastados em número de colunas/linhas do grid.
const ROW_HEIGHT = 120;
const GRID_GAP = 16;
const MIN_COL_SPAN = 3;
const MAX_COL_SPAN = 12;
const MIN_ROW_SPAN = 2;
const KEYBOARD_STEP = 1;

const SPAN_TO_COLS = { full: 12, '2/3': 8, '1/2': 6, '1/3': 4 };

function readStoredJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Cota excedida ou modo privado: o layout continua funcionando em memória.
  }
}

// Altura em px que corresponde a N trilhas de linha, incluindo os gaps
// internos — garante que a caixa do card sempre preencha exatamente a área
// reservada no grid (mesmo com items-start, que não estica os itens).
function rowsToPx(rows) {
  return rows * ROW_HEIGHT + Math.max(0, rows - 1) * GRID_GAP;
}

function ResizeHandle({ onResizeStart, onResizeKeyDown }) {
  return (
    <button
      type="button"
      aria-label="Redimensionar cartão"
      onPointerDown={onResizeStart}
      onKeyDown={onResizeKeyDown}
      className="pointer-events-none absolute bottom-1 right-1 z-20 flex h-6 w-6 cursor-nwse-resize touch-none items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Maximize2 className="h-3.5 w-3.5 rotate-90" />
    </button>
  );
}

// Memoizado: durante um resize/drag, apenas o card afetado deve re-renderizar
// (e recalcular seus gráficos Recharts) — cards vizinhos recebem props
// referencialmente estáveis e o React.memo evita re-executar w.render() para eles.
const DashboardCard = memo(function DashboardCard({ id, widget, customSize, onResizeStart, onResizeKeyDown }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const colSpan = customSize?.colSpan ?? SPAN_TO_COLS[widget.span] ?? 12;
  const rowSpan = customSize?.rowSpan ?? widget.rows ?? 2;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
    height: `${rowsToPx(rowSpan)}px`,
  };

  return (
    <div
      data-card-id={id}
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'z-50 opacity-80 shadow-xl' : ''}
    >
      <div className="group relative h-full w-full overflow-hidden">
        <div
          {...attributes}
          {...listeners}
          className="pointer-events-none absolute right-2 top-2 z-20 flex h-7 w-7 cursor-grab items-center justify-center rounded-md bg-card/80 text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <ResizeHandle onResizeStart={onResizeStart} onResizeKeyDown={onResizeKeyDown} />
        {widget.render()}
      </div>
    </div>
  );
});

export default function DashboardGrid({ widgets = [], storageKey = DEFAULT_KEY }) {
  const ids = widgets.map(w => w.id);
  // Chave nova (não `_sizes`): o formato mudou de pixels livres para
  // colSpan/rowSpan do grid — entradas antigas ficam órfãs em vez de serem
  // interpretadas incorretamente.
  const spanStorageKey = `${storageKey}_spans`;
  const gridRef = useRef(null);
  const stopResizeRef = useRef(null);
  const sizesRef = useRef(null);
  const byIdRef = useRef({});

  const [order, setOrder] = useState(() => {
    const parsed = readStoredJson(storageKey, null);
    if (parsed) {
      const valid = parsed.filter(id => ids.includes(id));
      ids.forEach(id => { if (!valid.includes(id)) valid.push(id); });
      return valid;
    }
    return ids;
  });

  const [sizes, setSizes] = useState(() => readStoredJson(spanStorageKey, {}));
  sizesRef.current = sizes;

  const byId = Object.fromEntries(widgets.map(w => [w.id, w]));
  byIdRef.current = byId;

  useEffect(() => { writeStoredJson(storageKey, order); }, [order, storageKey]);

  // Garante que listeners de um resize em andamento não sobrevivam ao unmount
  // do grid (ex.: navegação para outra página no meio do arraste).
  useEffect(() => () => stopResizeRef.current?.(), []);

  // A persistência em localStorage roda apenas ao FIM do gesto de resize
  // (pointerup/pointercancel/tecla), não a cada pixel de pointermove — evita
  // serializar e gravar no disco dezenas de vezes por segundo durante o arraste.
  const persistSizes = useCallback(() => {
    writeStoredJson(spanStorageKey, sizesRef.current);
  }, [spanStorageKey]);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Encerra um resize anterior que porventura não tenha sido finalizado
    // corretamente, evitando acumular listeners órfãos em `window`.
    stopResizeRef.current?.();

    const card = e.currentTarget.closest('[data-card-id]');
    if (!card) return;
    const id = card.dataset.cardId;
    const widget = byIdRef.current[id];

    const startColSpan = sizesRef.current[id]?.colSpan ?? SPAN_TO_COLS[widget?.span] ?? 12;
    const startRowSpan = sizesRef.current[id]?.rowSpan ?? widget?.rows ?? 2;
    const startX = e.clientX;
    const startY = e.clientY;
    const gridWidth = gridRef.current ? gridRef.current.offsetWidth : 0;
    const colUnitWidth = gridWidth > 0 ? (gridWidth - 11 * GRID_GAP) / 12 : 0;

    const onPointerMove = (moveEvent) => {
      const deltaCols = colUnitWidth > 0 ? Math.round((moveEvent.clientX - startX) / (colUnitWidth + GRID_GAP)) : 0;
      const deltaRows = Math.round((moveEvent.clientY - startY) / (ROW_HEIGHT + GRID_GAP));
      const nextColSpan = Math.min(MAX_COL_SPAN, Math.max(MIN_COL_SPAN, startColSpan + deltaCols));
      const nextRowSpan = Math.max(MIN_ROW_SPAN, startRowSpan + deltaRows);

      setSizes(curr => {
        const prev = curr[id];
        // O resize agora "encaixa" em trilhas do grid: só atualiza o estado
        // quando o valor arredondado realmente muda, evitando re-render a
        // cada pixel quando o cursor ainda está dentro da mesma trilha.
        if (prev?.colSpan === nextColSpan && prev?.rowSpan === nextRowSpan) return curr;
        return { ...curr, [id]: { colSpan: nextColSpan, rowSpan: nextRowSpan } };
      });
    };

    const stopResize = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopResize);
      window.removeEventListener('pointercancel', stopResize);
      stopResizeRef.current = null;
      persistSizes();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopResize);
    window.addEventListener('pointercancel', stopResize);
    stopResizeRef.current = stopResize;
  }, [persistSizes]);

  const handleResizeKeyDown = useCallback((e) => {
    const step = { ArrowRight: [KEYBOARD_STEP, 0], ArrowLeft: [-KEYBOARD_STEP, 0], ArrowDown: [0, KEYBOARD_STEP], ArrowUp: [0, -KEYBOARD_STEP] }[e.key];
    if (!step) return;
    e.preventDefault();

    const card = e.currentTarget.closest('[data-card-id]');
    if (!card) return;
    const id = card.dataset.cardId;
    const widget = byIdRef.current[id];
    const [dCol, dRow] = step;

    setSizes(curr => {
      const startColSpan = curr[id]?.colSpan ?? SPAN_TO_COLS[widget?.span] ?? 12;
      const startRowSpan = curr[id]?.rowSpan ?? widget?.rows ?? 2;
      const next = {
        ...curr,
        [id]: {
          colSpan: Math.min(MAX_COL_SPAN, Math.max(MIN_COL_SPAN, startColSpan + dCol)),
          rowSpan: Math.max(MIN_ROW_SPAN, startRowSpan + dRow),
        },
      };
      // Grava a partir do próprio updater: `sizesRef` só reflete o commit
      // anterior neste ponto, então usar o `next` calculado aqui evita
      // persistir um estado desatualizado (setSizes é assíncrono).
      writeStoredJson(spanStorageKey, next);
      return next;
    });
  }, [spanStorageKey]);

  // Só ativa o drag após 4px de deslocamento — evita que um clique comum
  // (ex.: em um botão do widget) seja interpretado como início de arraste.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder(curr => {
      const oldIndex = curr.indexOf(active.id);
      const newIndex = curr.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return curr;
      return arrayMove(curr, oldIndex, newIndex);
    });
  }, []);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div
          ref={gridRef}
          className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-12 auto-rows-[minmax(120px,auto)] grid-flow-dense"
        >
          {order.map((id) => {
            const w = byId[id];
            if (!w) return null;
            return (
              <DashboardCard
                key={id}
                id={id}
                widget={w}
                customSize={sizes[id]}
                onResizeStart={handleResizeStart}
                onResizeKeyDown={handleResizeKeyDown}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
