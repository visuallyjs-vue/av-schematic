// Keyed port rows let VisuallyJS retain jack elements when a device is edited.
const portColumn = (direction: 'input' | 'output') => `
  <div>
    <r-each in="ports" key="id">
      <r-if test="direction === '${direction}'">
        <div class="port-row${direction === 'output' ? ' output' : ''}">
          <button class="jack" type="button" data-vjs-source="true" data-vjs-target="true"
            data-vjs-port="{{id}}" data-vjs-anchor="${direction === 'input' ? 'Left' : 'Right'}"
            data-vjs-scope="{{connectorType || ''}}" aria-label="{{label}}"></button>
          <span>{{label}}<small>{{connectorType}}</small></span>
        </div>
      </r-if>
    </r-each>
  </div>`;

export const deviceTemplate = `
  <article class="device">
    <header><strong>{{deviceId}}</strong><small>{{manufacturer}} {{model}}</small></header>
    <div class="ports">${portColumn('input')}${portColumn('output')}</div>
  </article>`;
