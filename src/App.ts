import { defineComponent, Fragment, h, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { Editor } from './editor';
import type { LibraryDevice } from './devices';
import type { DeviceNodeData, DevicePort, PortDirection } from './definitions';

function mount(root: ParentNode, editor: Editor) {
  const part = (name: string) => root.querySelector<HTMLElement>(`[data-avs-part="${name}"]`)!;
  editor.mount(part('surface'), part('palette'), part('controls'), part('miniview'));
  return () => editor.destroy();
}

function renderEditor(editor: Editor, refresh: () => void) {
  function libraryItem(item: LibraryDevice, segments?: {text: string; match: boolean}[]) {
    return [
      h("button", { class: ["vjs-avs-library-item", editor.dark && "dark"].filter(Boolean).join(' '), type: "button", "data-vjs-type": "device", "data-library-id": item.libraryId, onClick: () => { editor.editTemplate(item.libraryId); refresh(); } }, [
        h("span", { class: "vjs-avs-library-item-text" }, [
          h("strong", {}, [
            segments ? [
                segments.map((segment, index) => h(Fragment, { key: index }, [segment.match ? [
                      h("mark", {}, [
                        (segment.text ?? '')
                      ])
                    ] : [
                      h("span", {}, [
                        (segment.text ?? '')
                      ])
                    ]]))
              ] : [
                " " + (item.template.manufacturer ?? '') + " " + (item.template.model ?? '') + " "
              ]
          ]),
          h("small", {}, [
            (item.template.category ?? '')
          ])
        ]),
        h("svg", { class: "icon drag-grip", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true" }, [
          h("circle", { cx: "6", cy: "4.5", r: "1" }),
          h("circle", { cx: "10", cy: "4.5", r: "1" }),
          h("circle", { cx: "6", cy: "8", r: "1" }),
          h("circle", { cx: "10", cy: "8", r: "1" }),
          h("circle", { cx: "6", cy: "11.5", r: "1" }),
          h("circle", { cx: "10", cy: "11.5", r: "1" })
        ])
      ])
    ];
  }

  function deviceForm(item: DeviceNodeData, template: boolean) {
    return [
      h("div", { class: "field-group" }, [
        !template ? [
            h("label", {}, [
              "Device ID ",
              h("input", { value: item.deviceId ?? '', onInput: (event: Event) => { editor.editDevice(item, {deviceId: (event.currentTarget as HTMLInputElement).value}); refresh(); } })
            ])
          ] : null,
        h("label", {}, [
          "Manufacturer ",
          h("input", { value: item.manufacturer ?? '', onInput: (event: Event) => { editor.editDevice(item, {manufacturer: (event.currentTarget as HTMLInputElement).value}); refresh(); } })
        ]),
        h("label", {}, [
          "Model ",
          h("input", { value: item.model ?? '', onInput: (event: Event) => { editor.editDevice(item, {model: (event.currentTarget as HTMLInputElement).value}); refresh(); } })
        ]),
        h("label", {}, [
          "Category ",
          h("input", { list: "device-categories", value: item.category ?? '', onInput: (event: Event) => { editor.editDevice(item, {category: (event.currentTarget as HTMLInputElement).value}); refresh(); } })
        ]),
        !template ? [
            h("label", {}, [
              "Location ",
              h("input", { value: item.location ?? '', onInput: (event: Event) => { editor.editDevice(item, {location: (event.currentTarget as HTMLInputElement).value}); refresh(); } })
            ])
          ] : null
      ]),
      h("h3", { class: "section-heading" }, [
        "Ports"
      ]),
      template ? [
          portList(item, item.ports),
          h("button", { class: "btn-full", type: "button", onClick: () => { editor.addPort(item); refresh(); } }, [
            h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "aria-hidden": "true" }, [
              h("path", { d: "M8 3.5v9M3.5 8h9" })
            ]),
            " Add port "
          ])
        ] : [
          h("div", { class: "port-tabs", role: "tablist", "aria-label": "Port direction", onKeydown: (event: KeyboardEvent) => { editor.onPortTabKey(event); refresh(); } }, [
            editor.portTabs.map((direction) => h("button", { key: direction, type: "button", role: "tab", id: 'port-tab-' + direction, "aria-selected": editor.activePortTab === direction, tabindex: editor.activePortTab === direction ? 0 : -1, onClick: () => { editor.activePortTab = direction; refresh(); } }, [
                h("span", {}, [
                  (direction === 'input' ? 'Input ports' : 'Output ports')
                ]),
                h("span", { class: "tab-count" }, [
                  (editor.portsFor(item, direction).length ?? '')
                ])
              ]))
          ]),
          editor.portTabs.map((direction) => h("div", { key: direction, role: "tabpanel", id: 'port-panel-' + direction, "aria-labelledby": 'port-tab-' + direction, hidden: editor.activePortTab !== direction }, [
              editor.activePortTab === direction ? [
                  portList(item, editor.portsFor(item, direction), direction)
                ] : null
            ]))
        ]
    ];
  }

  function portList(item: DeviceNodeData, ports: DevicePort[], direction?: PortDirection) {
    return [
      h("div", { class: "port-cards" }, [
        ports.length ? ports.map((port, i, items) => {
          const last = i === items.length - 1;
          return h("div", { key: port.id, class: "port-card" }, [
            h("div", { class: "port-row-top" }, [
              h("input", { "aria-label": "Port label", placeholder: "Port label", value: port.label ?? '', onInput: (event: Event) => { editor.editPort(item, port, {label: (event.currentTarget as HTMLInputElement).value}); refresh(); } }),
              h("select", { "aria-label": "Port direction", value: port.direction ?? '', onChange: (event: Event) => { editor.editPort(item, port, {direction: (event.currentTarget as HTMLSelectElement).value as PortDirection}); refresh(); } }, [
                h("option", { value: "input" }, [
                  "Input"
                ]),
                h("option", { value: "output" }, [
                  "Output"
                ])
              ])
            ]),
            h("div", { class: "port-row-bottom" }, [
              h("input", { list: "connector-types", "aria-label": "Connector type", placeholder: "Connector", value: port.connectorType ?? '', onInput: (event: Event) => { editor.editPort(item, port, {connectorType: (event.currentTarget as HTMLInputElement).value}); refresh(); } }),
              h("div", { class: "port-actions" }, [
                h("button", { class: "btn-icon", type: "button", "aria-label": "Move port up", title: "Move up", disabled: i === 0, onClick: () => { editor.movePort(item, port, -1, direction); refresh(); } }, [
                  h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                    h("path", { d: "m4 10 4-4 4 4" })
                  ])
                ]),
                h("button", { class: "btn-icon", type: "button", "aria-label": "Move port down", title: "Move down", disabled: last, onClick: () => { editor.movePort(item, port, 1, direction); refresh(); } }, [
                  h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                    h("path", { d: "m4 6 4 4 4-4" })
                  ])
                ]),
                h("button", { class: "btn-icon btn-danger-ghost", type: "button", "aria-label": "Remove port", title: "Remove port", onClick: () => { editor.removePort(item, port); refresh(); } }, [
                  h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                    h("path", { d: "M2.5 4.5h11M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4.5 4.5l.7 8.5a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.7-8.5" })
                  ])
                ])
              ])
            ])
          ]);
        }) : [
          h("p", { class: "empty-state" }, [
            (direction ? 'No ' + direction + ' ports' : 'No ports')
          ])
        ]
      ])
    ];
  }

  return [
    h("main", { class: ["vjs-avs-container", editor.dark && "dark"].filter(Boolean).join(' ') }, [
      h("header", { class: "vjs-avs-toolbar" }, [
        h("h1", {}, [
          "AV Schematic"
        ]),
        h("button", { type: "button", "aria-expanded": editor.libraryOpen, onClick: () => { editor.libraryOpen = !editor.libraryOpen; refresh(); } }, [
          h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
            h("rect", { x: "2", y: "2.5", width: "12", height: "11", rx: "1.5" }),
            h("path", { d: "M6 2.5v11" })
          ]),
          " Library "
        ]),
        h("button", { type: "button", "aria-expanded": editor.propertiesOpen, onClick: () => { editor.propertiesOpen = !editor.propertiesOpen; refresh(); } }, [
          h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
            h("rect", { x: "2", y: "2.5", width: "12", height: "11", rx: "1.5" }),
            h("path", { d: "M10 2.5v11" })
          ]),
          " Properties "
        ]),
        h("button", { type: "button", onClick: () => { editor.toggleTheme(); refresh(); } }, [
          editor.dark ? [
              h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                h("circle", { cx: "8", cy: "8", r: "3" }),
                h("path", { d: "M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" })
              ]),
              " Light theme "
            ] : [
              h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                h("path", { d: "M13.5 9.8A5.5 5.5 0 0 1 6.2 2.5a5.5 5.5 0 1 0 7.3 7.3Z" })
              ]),
              " Dark theme "
            ]
        ]),
        h("button", { type: "button", onClick: () => { editor.downloadDxf(); refresh(); } }, [
          h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
            h("path", { d: "M9.5 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6L9.5 2Z" }),
            h("path", { d: "M9.5 2v4h4" }),
            h("path", { d: "M8 8.5v3.5m0 0-1.5-1.5M8 12l1.5-1.5" })
          ]),
          " Export DXF "
        ])
      ]),
      h("div", { class: ["vjs-avs-workspace", !editor.libraryOpen && "vjs-avs-library-closed", !editor.propertiesOpen && "vjs-avs-properties-closed"].filter(Boolean).join(' ') }, [
        h("aside", { class: "vjs-avs-pane vjs-avs-library-pane", hidden: !editor.libraryOpen }, [
          h("div", { class: "vjs-avs-pane-header" }, [
            h("h2", {}, [
              "Device library"
            ]),
            h("div", { class: "search-field" }, [
              h("svg", { class: "icon search-icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                h("circle", { cx: "7", cy: "7", r: "4.5" }),
                h("path", { d: "m10.5 10.5 3 3" })
              ]),
              h("input", { type: "search", placeholder: "Search devices", "aria-label": "Search devices", value: editor.query ?? '', onInput: (event: Event) => { editor.query = (event.currentTarget as HTMLInputElement).value; refresh(); } })
            ]),
            h("button", { class: "btn-primary btn-full", type: "button", onClick: () => { editor.editTemplate(); refresh(); } }, [
              h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "aria-hidden": "true" }, [
                h("path", { d: "M8 3.5v9M3.5 8h9" })
              ]),
              " Add template "
            ])
          ]),
          h("div", { class: "vjs-avs-pane-body", "data-avs-part": "palette" }, [
            editor.draft ? [
                h("h3", { class: "section-heading" }, [
                  (editor.draftId ? 'Edit template' : 'New template')
                ]),
                deviceForm(editor.draft!, true)
              ] : editor.searchQuery ? [
                h("div", { class: "vjs-avs-library-items" }, [
                  editor.filteredLibrary.length ? editor.filteredLibrary.map((result) => h(Fragment, { key: result.item.libraryId }, [libraryItem(result.item, result.segments)])) : [
                    h("p", { class: "empty-state" }, [
                      "No matching devices"
                    ])
                  ]
                ])
              ] : [
                editor.libraryGroups.length ? editor.libraryGroups.map((group) => h("details", { key: group.key, class: "library-group", open: editor.isCategoryOpen(group.key), onToggle: (event: Event) => editor.setCategoryOpen(group.key, (event.currentTarget as HTMLDetailsElement).open) }, [
                    h("summary", {}, [
                      h("span", { class: "library-label" }, [
                        (group.label ?? '')
                      ]),
                      h("span", { class: "library-count" }, [
                        (group.items.length ?? '')
                      ])
                    ]),
                    h("div", { class: "vjs-avs-library-items" }, [
                      group.items.map((item) => h(Fragment, { key: item.libraryId }, [libraryItem(item)]))
                    ])
                  ])) : [
                  h("p", { class: "empty-state" }, [
                    "No devices in library"
                  ])
                ]
              ]
          ]),
          editor.draft ? [
              h("div", { class: "vjs-avs-pane-footer" }, [
                h("button", { class: "btn-primary", type: "button", onClick: () => { editor.saveTemplate(); refresh(); } }, [
                  h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                    h("path", { d: "M3.5 8.5 6.5 11.5 12.5 4.5" })
                  ]),
                  " Save "
                ]),
                h("button", { type: "button", onClick: () => { editor.draft = null; refresh(); } }, [
                  h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "aria-hidden": "true" }, [
                    h("path", { d: "M4 4l8 8M12 4l-8 8" })
                  ]),
                  " Discard "
                ]),
                editor.draftId ? [
                    h("button", { class: "btn-danger", type: "button", "aria-label": "Delete template", title: "Delete template", onClick: () => { editor.deleteTemplate(); refresh(); } }, [
                      h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                        h("path", { d: "M2.5 4.5h11M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4.5 4.5l.7 8.5a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.7-8.5" })
                      ])
                    ])
                  ] : null
              ])
            ] : null
        ]),
        h("section", { class: "vjs-avs-canvas" }, [
          h("div", { class: "avs-surface", "data-avs-part": "surface" }),
          h("div", { "data-avs-part": "controls" }),
          h("div", { class: "avs-miniview" }, [
            h("div", { "data-avs-part": "miniview" })
          ])
        ]),
        h("aside", { class: "vjs-avs-pane vjs-avs-properties-pane", hidden: !editor.propertiesOpen }, [
          h("div", { class: "vjs-avs-pane-header" }, [
            h("h2", {}, [
              "Properties"
            ])
          ]),
          h("div", { class: "avs-inspector" }, [
            editor.selectedDevice || editor.selectedCable ? [
                h("div", { class: "vjs-avs-pane-body" }, [
                  editor.selectedDevice ? [
                      deviceForm(editor.selectedDevice!, false)
                    ] : editor.selectedCable ? [
                      h("h3", { class: "section-heading" }, [
                        "Cable"
                      ]),
                      h("div", { class: "field-group" }, [
                        h("label", {}, [
                          "Cable ID ",
                          h("input", { value: editor.selectedCable!.cableId ?? '', onInput: (event: Event) => { editor.editCable({cableId: (event.currentTarget as HTMLInputElement).value}); refresh(); } })
                        ]),
                        h("label", {}, [
                          "Signal type ",
                          h("select", { value: editor.selectedCable!.cableType ?? '', onChange: (event: Event) => { editor.editCable({cableType: (event.currentTarget as HTMLSelectElement).value || undefined}); refresh(); } }, [
                            h("option", { value: "" }, [
                              "Unspecified"
                            ]),
                            editor.signalTypes.map((type) => h("option", { key: type, value: type }, [
                                (type ?? '')
                              ]))
                          ])
                        ])
                      ])
                    ] : null
                ]),
                editor.selectedDevice ? [
                    h("div", { class: "vjs-avs-pane-footer" }, [
                      h("button", { class: "btn-primary", type: "button", onClick: () => { editor.addPort(editor.selectedDevice!, editor.activePortTab); refresh(); } }, [
                        h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "aria-hidden": "true" }, [
                          h("path", { d: "M8 3.5v9M3.5 8h9" })
                        ]),
                        " Add " + (editor.activePortTab ?? '') + " port "
                      ]),
                      h("button", { class: "btn-danger", type: "button", onClick: () => { editor.deleteDevice(); refresh(); } }, [
                        h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                          h("path", { d: "M2.5 4.5h11M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4.5 4.5l.7 8.5a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.7-8.5" })
                        ]),
                        " Delete device "
                      ])
                    ])
                  ] : editor.selectedCable ? [
                    h("div", { class: "vjs-avs-pane-footer" }, [
                      h("button", { type: "button", onClick: () => { editor.resetRouting(); refresh(); } }, [
                        h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                          h("path", { d: "M3 7a5 5 0 1 1 1.5 3.6M3 3.5V7h3.5" })
                        ]),
                        " Reset routing "
                      ]),
                      h("button", { class: "btn-danger", type: "button", onClick: () => { editor.deleteCable(); refresh(); } }, [
                        h("svg", { class: "icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
                          h("path", { d: "M2.5 4.5h11M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4.5 4.5l.7 8.5a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.7-8.5" })
                        ]),
                        " Delete cable "
                      ])
                    ])
                  ] : null
              ] : [
                h("div", { class: "vjs-avs-pane-body" }, [
                  h("p", { class: "empty-state" }, [
                    "Select a device or cable on the canvas to inspect and edit its properties."
                  ])
                ])
              ]
          ])
        ])
      ])
    ]),
    h("datalist", { id: "device-categories" }, [
      editor.deviceTypes.map((type) => h("option", { key: type.name, value: type.name }))
    ]),
    h("datalist", { id: "connector-types" }, [
      editor.connectors.map((type) => h("option", { key: type, value: type }))
    ])
  ];
}

export default defineComponent({
  setup() {
    const root = ref<HTMLDivElement>();
    const revision = shallowRef(0);
    const refresh = () => { revision.value++; };
    const editor = new Editor(refresh);
    onMounted(() => mount(root.value!, editor));
    onUnmounted(() => editor.destroy());
    return () => {
      void revision.value;
      return h('div', { ref: root }, renderEditor(editor, refresh));
    };
  },
});
