import {
  BackgroundPlugin,
  ControlsComponent,
  createSurface,
  GeneratedGridBackground,
  MiniviewPlugin,
  Palette,
  type Surface,
  type DataGeneratorFunction,
  CONNECTOR_TYPE_ORTHOGONAL,
  Edge,
  Port,
  EVENT_DESELECT,
  EVENT_SELECT,
  EVENT_SELECTION_CLEARED,
  EVENT_EDGE_REMOVED,
  EVENT_NODE_REMOVED,
  EVENT_CANVAS_CLICK,
  EVENT_EDGE_CLICK,
  EVENT_VERTEX_TAP,
  ModelOptions,
  Node,
  SurfaceOptions,
  uuid,
} from '@visuallyjs/browser-ui';
import { deviceTemplate } from './device-template';
import edgeMappings from './edge-mappings';
import { LibraryDevice, DEVICE_LIBRARY, createBlankTemplate } from './devices';
import { Exporter, type DxfPrimitive } from '@visuallyjs/browser-ui-export';
import {
  CableEdgeData,
  SIGNAL_TYPES,
  CONNECTOR_TYPES,
  DEVICE_TYPES,
  DeviceNodeData,
  DevicePort,
  generateDeviceId,
  PortDirection,
} from "./definitions";

// VisuallyJS owns the canvas. The app supplies the palette and inspector state.
export class Editor {
  private canvas?: Surface;
  private palette?: Palette;
  constructor(readonly refresh: () => void) {}

  library = structuredClone(DEVICE_LIBRARY);
  libraryOpen = true;
  propertiesOpen = true;
  readonly grid = { width: 20, height: 20 };
  dark = localStorage.getItem('av-schematic-theme') === 'dark';
  query = '';
  readonly portTabs = ['input', 'output'] as const;
  activePortTab = 'input' as PortDirection;
  readonly deviceTypes = DEVICE_TYPES;
  private readonly collapsedCategories = new Set<string>();
  get libraryGroups() {
    const groups = new Map<string, LibraryDevice[]>();
    for (const item of this.library) {
      const key = item.template.category?.trim() || '';
      const items = groups.get(key) ?? [];
      items.push(item);
      groups.set(key, items);
    }
    const orderedKeys = new Set([...this.deviceTypes.map(type => type.name), ...groups.keys()].filter(Boolean));
    return [...orderedKeys, ''].flatMap(key => {
      const items = groups.get(key);
      const label = key ? key.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : 'Other';
      return items ? [{ key, label, items }] : [];
    });
  }
  readonly signalTypes = SIGNAL_TYPES;
  readonly connectors = CONNECTOR_TYPES;
  draft: DeviceNodeData | null = null;
  draftId: string | null = null;

  readonly viewOptions = {
    nodes: { device: { template: deviceTemplate } },
    edges: {
      default: {
        overlays: [
          { type: 'Label', options: { id: 'cable-start-label', location: 0.2, label: '{{cableId}}' } },
          { type: 'Label', options: { id: 'cable-end-label', location: 0.8, label: '{{cableId}}' } },
        ]
      },
    },
  };

  readonly renderOptions: SurfaceOptions = {
    activeFiltering: true,
    zoomToFit: true,
    allowLoopbackEdges: true,
    edges: {
      connector: { type: CONNECTOR_TYPE_ORTHOGONAL, options: { cornerRadius: 4, stub: 20 } },
      editable: true,
      detachable: true,
      allowUnattached: true,
      propertyMappings: edgeMappings(),
    },
  };

  private portSpec(port: Port): DevicePort | undefined {
    const parentData = port.getParent()?.data as DeviceNodeData | undefined;
    return parentData?.ports?.find(p => p.id === port.id) ?? (port.data as DevicePort | undefined);
  }

  private canConnect(source: unknown, target: unknown): boolean {
    if (source === target) return false;
    if (source instanceof Port && target instanceof Port) {
      if (source.getParent() === target.getParent()) return false;
      const src = this.portSpec(source);
      const tgt = this.portSpec(target);
      if (!src || !tgt) return false;
      if (src.direction !== 'output' || tgt.direction !== 'input') return false;
      if (src.connectorType !== tgt.connectorType) return false;
    }
    return true;
  }

  readonly modelOptions: ModelOptions = {
    beforeConnect: (source, target) => this.canConnect(source, target),
    beforeMoveConnection: (source, target) => this.canConnect(source, target),
    nodeFactory: (model, _type, data, complete) => {
      const device = data as DeviceNodeData;
      complete({ ...data, id: uuid(), deviceId: generateDeviceId(device.category, model) });
      return true;
    },
    edgeFactory: (_model, _type, data, complete) => {
      complete({ ...data, type: 'cable', cableId: 'C-' + uuid().slice(0, 8) });
      return true;
    },
  };

  mount(container: HTMLElement, source: HTMLElement, controls: HTMLElement, miniview: HTMLElement): void {
    const surface = this.canvas = createSurface(container, {
      ...this.renderOptions,
      view: this.viewOptions,
      plugins: [
        { type: BackgroundPlugin.type, options: { type: GeneratedGridBackground.type, grid: this.grid } },
        { type: MiniviewPlugin.type, options: { container: miniview, trackSelection: true } },
      ],
    }, this.modelOptions);
    const { model } = surface;
    new ControlsComponent(controls, surface);
    this.palette = new Palette(surface, {
      source,
      dataGenerator: this.paletteData,
      canvasDropFilter: data => data.type === 'device',
      allowDropOnNode: true,
      allowDropOnEdge: false,
      allowDropOnGroup: false,
      allowRotation: false,
      autoEdgeConnect: false,
      selectAfterAdd: false,
    });
    surface.setGrid(this.grid);
    surface.bind(EVENT_EDGE_CLICK, ({ obj }: { obj: Edge }) => model.setSelection(obj));
    surface.bind(EVENT_VERTEX_TAP, ({ obj }: { obj: Node | Port }) =>
      model.setSelection(obj instanceof Port ? obj.getParent() : obj));
    surface.bind(EVENT_CANVAS_CLICK, () => model.clearSelection());
    const refreshSelection = (openProperties: boolean) => {
      const selection = model.getSelection();
      const items = [...selection.getNodes(), ...selection.getEdges()];
      if (openProperties && items.length) this.propertiesOpen = true;
      const connected = new Set(items.flatMap(item => item instanceof Node
        ? item.getAllEdges().map(edge => edge.id) : [item.id]));
      for (const element of surface.getContainer().querySelectorAll('[data-vjs-edge]')) {
        element.classList.toggle('av-connected-cable', connected.has(element.getAttribute('data-vjs-edge') ?? ''));
      }
      this.refresh();
    };
    const updateSelection = () => refreshSelection(true);
    const updateAfterRemoval = () => refreshSelection(false);
    model.bind(EVENT_NODE_REMOVED, updateAfterRemoval);
    model.bind(EVENT_EDGE_REMOVED, updateAfterRemoval);
    model.bind(EVENT_SELECT, updateSelection);
    model.bind(EVENT_DESELECT, updateSelection);
    model.bind(EVENT_SELECTION_CLEARED, updateSelection);
    model.bind('node:updated', updateAfterRemoval);
    model.bind('edge:updated', updateAfterRemoval);
    model.load({ url: new URL('dataset.json', document.baseURI).href });
  }

  destroy(): void {
    this.palette?.setEnabled(false);
    this.canvas?.destroy();
    this.canvas = undefined;
    this.palette = undefined;
  }

  isCategoryOpen(key: string): boolean {
    return !this.collapsedCategories.has(key);
  }

  setCategoryOpen(key: string, open: boolean): void {
    if (open) this.collapsedCategories.delete(key);
    else this.collapsedCategories.add(key);
  }

  get searchQuery(): string {
    return this.query.trim();
  }

  get filteredLibrary() {
    const query = this.searchQuery;
    if (!query) return [];
    const matcher = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');

    return this.library.flatMap(item => {
      const { manufacturer, model } = item.template;
      const matches = [manufacturer, model].map(text => ({ text, ranges: [...text.matchAll(matcher)] }));
      if (matches.every(({ ranges }) => ranges.length === 0)) return [];

      const segments: { text: string; match: boolean }[] = [];
      for (const [index, { text, ranges }] of matches.entries()) {
        if (index > 0) segments.push({ text: ' ', match: false });
        let end = 0;
        for (const match of ranges) {
          if (match.index > end) segments.push({ text: text.slice(end, match.index), match: false });
          segments.push({ text: match[0], match: true });
          end = match.index + match[0].length;
        }
        if (end < text.length) segments.push({ text: text.slice(end), match: false });
      }
      return [{ item, segments }];
    });
  }

  get selectedDevice(): DeviceNodeData | undefined {
    const device = this.selectedNode?.data as DeviceNodeData | undefined;
    return device && { ...device };
  }

  private get selectedEdge(): Edge | undefined {
    const selection = this.canvas?.model.getSelection();
    if (selection?.getEdgeCount() === 1 && selection.getNodeCount() === 0) {
      return selection.getEdges()[0];
    }
    return undefined;
  }

  get selectedCable(): CableEdgeData | undefined {
    return this.selectedEdge?.data as CableEdgeData | undefined;
  }

  editCable(changes: Partial<CableEdgeData>): void {
    const edge = this.selectedEdge;
    if (edge) this.canvas?.model.updateEdge(edge, changes);
  }

  deleteCable(): void {
    const edge = this.selectedEdge;
    if (edge) this.canvas?.model.removeEdge(edge);
  }

  resetRouting(): void {
    const edge = this.selectedEdge;
    if (edge) this.canvas?.clearPathEdits(edge);
  }

  deleteDevice(): void {
    const node = this.selectedNode;
    if (node) this.canvas?.model.removeNode(node);
  }

  private get selectedNode(): Node | null {
    const selection = this.canvas?.model?.getSelection();
    if (!selection || selection.getNodeCount() !== 1 || selection.getEdgeCount() !== 0) return null;
    return selection.getNodeAt(0);
  }

  readonly paletteData: DataGeneratorFunction = element => {
    const libraryId = element.getAttribute('data-library-id');
    const template = this.library.find(item => item.libraryId === libraryId)?.template;
    return template ? structuredClone(template) : {};
  };

  editTemplate(id?: string): void {
    this.draftId = id ?? null;
    const template = this.library.find(item => item.libraryId === id)?.template;
    this.draft = template
      ? { ...createBlankTemplate(), ...structuredClone(template) }
      : createBlankTemplate();
  }

  saveTemplate(): void {
    if (!this.draft) return;
    const libraryId = this.draftId ?? uuid();
    const entry = { libraryId, template: this.draft };
    this.library = this.draftId
      ? this.library.map(item => item.libraryId === libraryId ? entry : item)
      : [...this.library, entry];
    this.draft = null;
  }

  deleteTemplate(): void {
    this.library = this.library.filter(item => item.libraryId !== this.draftId);
    this.draft = null;
  }

  editDevice(device: DeviceNodeData, changes: Partial<DeviceNodeData>): void {
    if (device === this.draft) {
      this.draft = { ...device, ...changes };
      return;
    }
    const node = this.selectedNode;
    const surface = this.canvas;
    if (!node || !surface) return;
    surface.model.updateNode(node, changes);
    requestAnimationFrame(() => {
      const element = surface.getRenderedElement(node.id);
      if (element) surface.$revalidateElement(element);
    });
  }

  editPort(device: DeviceNodeData, port: DevicePort, changes: Partial<DevicePort>): void {
    this.editDevice(device, { ports: device.ports.map(item => item.id === port.id ? { ...item, ...changes } : item) });
  }

  addPort(device: DeviceNodeData, direction: PortDirection = 'input'): void {
    this.editDevice(device, { ports: [...device.ports, { id: uuid(), label: 'New port', direction }] });
  }

  removePort(device: DeviceNodeData, port: DevicePort): void {
    const node = this.selectedNode;
    if (device !== this.draft && node) this.canvas?.model.removePort(node, port.id);
    this.editDevice(device, { ports: device.ports.filter(item => item.id !== port.id) });
  }

  portsFor(device: DeviceNodeData, direction: PortDirection): DevicePort[] {
    return device.ports.filter(port => port.direction === direction);
  }

  onPortTabKey(event: Pick<KeyboardEvent, 'key' | 'currentTarget' | 'preventDefault'>): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'input' : event.key === 'End' ? 'output'
      : this.activePortTab === 'input' ? 'output' : 'input';
    this.activePortTab = next;
    const tabList = event.currentTarget as HTMLElement;
    tabList.querySelector<HTMLElement>('#port-tab-' + next)?.focus();
  }

  movePort(device: DeviceNodeData, port: DevicePort, offset: number, direction?: PortDirection): void {
    const ports = [...device.ports];
    const visible = direction ? this.portsFor(device, direction) : ports;
    const index = ports.indexOf(port);
    const neighbor = visible[visible.indexOf(port) + offset];
    const other = ports.indexOf(neighbor);
    if (other < 0 || other >= ports.length) return;
    [ports[index], ports[other]] = [ports[other], ports[index]];
    this.editDevice(device, { ports });
  }

  toggleTheme(): void {
    this.dark = !this.dark;
    localStorage.setItem('av-schematic-theme', this.dark ? 'dark' : 'light');
  }

  downloadDxf(): void {
    const surface = this.canvas;
    if (!surface) return;
    const measure = document.createElement('canvas').getContext('2d');
    const zoom = surface.getZoom();
    const { dxf, warnings } = new Exporter(surface).exportDxf({
      units: 'mm',
      scale: 0.3,
      renderVertex: vertex => {
        if (vertex.kind !== 'node') return undefined;
        const data = vertex.data as unknown as DeviceNodeData;
        const { width, height } = vertex.bounds;
        const deviceRect = vertex.element.getBoundingClientRect();
        const artwork: DxfPrimitive[] = [];
        const outline = (x: number, y: number, w: number, h: number) => {
          artwork.push({
            type: 'polyline', closed: true, points: [
              { x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h },
            ]
          });
        };
        outline(0, 0, width, height);
        artwork.push(
          { type: 'text', position: { x: 8, y: 19 }, height: 14, text: data.deviceId },
          { type: 'text', position: { x: 8, y: 35 }, height: 12, text: [data.manufacturer, data.model].join(' ') },
        );
        for (const port of vertex.ports) {
          const details = data.ports.find(item => item.id === port.id);
          if (!details) continue;
          outline(port.x, port.y, port.width, port.height);
          const output = details.direction === 'output';
          const jack = vertex.element.querySelector(`[data-vjs-port="${CSS.escape(port.id)}"]`);
          const label = jack?.nextElementSibling;
          const type = label?.querySelector('small');
          const labelRect = label?.getBoundingClientRect();
          const x = labelRect
            ? ((output ? labelRect.right : labelRect.left) - deviceRect.left) / zoom
            : output ? port.x - 6 : port.x + port.width + 6;
          const align = output ? 'end' : 'start';

          // CAD TEXT height measures capitals, while CSS font-size measures the em.
          const textGeometry = (element: Element | null | undefined, fallbackSize: number, fallbackY: number) => {
            const node = element?.firstChild;
            if (!element || node?.nodeType !== globalThis.Node.TEXT_NODE || !measure) {
              return { height: fallbackSize * 0.72, baseline: fallbackY };
            }
            const style = getComputedStyle(element);
            measure.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const metrics = measure.measureText('H');
            const range = document.createRange();
            range.selectNodeContents(node);
            const rect = range.getBoundingClientRect();
            const baseline = (rect.top + rect.height / 2 - deviceRect.top) / zoom
              + (metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2;
            return { height: metrics.actualBoundingBoxAscent || fallbackSize * 0.72, baseline };
          };
          const name = textGeometry(label, 11, port.y + 5);
          const connector = textGeometry(type, 10, port.y + 17);
          const connectorBaseline = Math.max(connector.baseline, name.baseline + connector.height + 2);
          artwork.push(
            { type: 'text', position: { x, y: name.baseline }, height: name.height, text: details.label, align },
            { type: 'text', position: { x, y: connectorBaseline }, height: connector.height, text: details.connectorType ?? '', align },
          );
        }
        return artwork;
      },
    });
    if (warnings.length) console.warn('DXF export warnings', warnings);
    const url = URL.createObjectURL(new Blob([dxf], { type: 'application/dxf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'av-schematic.dxf';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
