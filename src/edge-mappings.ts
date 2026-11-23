import {
  ArrowOverlay,
  DiamondOverlay,
  DotOverlay,
  type EdgePropertyMappings,
  PlainArrowOverlay,
  RectangleOverlay,
} from '@visuallyjs/browser-ui';

/**
 * Signal type visual mappings for AV schematic edges, keyed by `cableType`.
 */
export default function edgeMappings(): EdgePropertyMappings {
  return [
    {
      property: 'cableType',
      name: 'Signal type',
      mappings: {
        audio: {
          color: 'var(--sig-audio)',
          lineWidth: 2,
          targetMarker: {
            type: PlainArrowOverlay.type,
            options: {
              width: 9,
              length: 9,
              paintStyle: { fill: 'var(--sig-audio)', stroke: 'var(--sig-audio)', strokeWidth: 1 },
            },
          },
        },
        video: {
          color: 'var(--sig-video)',
          lineWidth: 1.5,
          outlines: [{ width: 1.5, color: 'var(--sig-video-jacket)' }],
          targetMarker: {
            type: ArrowOverlay.type,
            options: {
              width: 11,
              length: 12,
              paintStyle: { fill: 'var(--sig-video-jacket)', stroke: 'var(--sig-video-jacket)', strokeWidth: 1 },
            },
          },
        },
        speaker: {
          color: 'var(--sig-speaker)',
          lineWidth: 3,
          outlines: [{ width: 1.25, color: 'var(--sig-speaker-jacket)' }],
          sourceMarker: {
            type: RectangleOverlay.type,
            options: {
              width: 5,
              height: 8,
              rotate: true,
              paintStyle: { fill: 'var(--sig-speaker-jacket)', stroke: 'var(--sig-speaker-jacket)', strokeWidth: 1 },
            },
          },
          targetMarker: {
            type: PlainArrowOverlay.type,
            options: {
              width: 12,
              length: 11,
              paintStyle: { fill: 'var(--sig-speaker-marker)', stroke: 'var(--sig-speaker-marker)', strokeWidth: 1 },
            },
          },
        },
        ethernet: {
          color: 'var(--sig-ethernet)',
          lineWidth: 2,
          dashArray: '10 4 2 4',
          sourceMarker: {
            type: DiamondOverlay.type,
            options: {
              width: 9,
              length: 10,
              paintStyle: { fill: 'var(--sig-ethernet)', stroke: 'var(--sig-ethernet)', strokeWidth: 1 },
            },
          },
          targetMarker: {
            type: DiamondOverlay.type,
            options: {
              width: 9,
              length: 10,
              paintStyle: { fill: 'var(--sig-ethernet)', stroke: 'var(--sig-ethernet)', strokeWidth: 1 },
            },
          },
        },
        power: {
          color: 'var(--sig-power)',
          lineWidth: 2.5,
          dashArray: '8 4',
          outlines: [{ width: 0.75, color: 'var(--sig-power-jacket)' }],
          sourceMarker: {
            type: DotOverlay.type,
            options: {
              radius: 3.5,
              paintStyle: { fill: 'var(--sig-power-marker)', stroke: 'var(--sig-power-marker)', strokeWidth: 1 },
            },
          },
          targetMarker: {
            type: PlainArrowOverlay.type,
            options: {
              width: 10,
              length: 10,
              paintStyle: { fill: 'var(--sig-power-marker)', stroke: 'var(--sig-power-marker)', strokeWidth: 1 },
            },
          },
        },
        control: {
          color: 'var(--sig-control)',
          lineWidth: 1.75,
          dashArray: '2 4.5',
          paintStyle: { 'stroke-linecap': 'round' },
          targetMarker: {
            type: PlainArrowOverlay.type,
            options: {
              width: 9,
              length: 9,
              hollow: true,
              paintStyle: { stroke: 'var(--sig-control)', strokeWidth: 1.5 },
            },
          },
        },
        usb: {
          color: 'var(--sig-usb)',
          lineWidth: 2,
          dashArray: '5 3',
          sourceMarker: {
            type: DotOverlay.type,
            options: {
              radius: 3.5,
              paintStyle: { fill: 'var(--sig-usb)', stroke: 'var(--sig-usb)', strokeWidth: 1 },
            },
          },
          targetMarker: {
            type: DotOverlay.type,
            options: {
              radius: 3.5,
              paintStyle: { fill: 'var(--sig-usb)', stroke: 'var(--sig-usb)', strokeWidth: 1 },
            },
          },
        },
        fiber: {
          color: 'var(--sig-fiber)',
          lineWidth: 1.5,
          outlines: [{ width: 1.25, color: 'var(--sig-fiber-clad)' }],
          sourceMarker: {
            type: DiamondOverlay.type,
            options: {
              width: 9,
              length: 9,
              paintStyle: { fill: 'var(--sig-fiber)', stroke: 'var(--sig-fiber-clad)', strokeWidth: 1.5 },
            },
          },
          targetMarker: {
            type: ArrowOverlay.type,
            options: {
              width: 11,
              length: 12,
              paintStyle: { fill: 'var(--sig-fiber-clad)', stroke: 'var(--sig-fiber-clad)', strokeWidth: 1 },
            },
          },
        },
      },
    },
  ];
}
