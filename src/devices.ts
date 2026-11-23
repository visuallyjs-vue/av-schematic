import { type DeviceNodeData } from './definitions';

export const createBlankTemplate = (): DeviceNodeData => ({
  type: 'device',
  deviceId: '',
  manufacturer: '',
  model: '',
  category: '',
  location: '',
  ports: [],
});

export type DeviceTemplate = Omit<DeviceNodeData, 'deviceId' | 'location'>;

export interface LibraryDevice {
  libraryId: string;
  template: DeviceTemplate;
}

export const DEVICE_LIBRARY: LibraryDevice[] = [
  {
    libraryId: 'lib-akg-c414-xls',
    template: {
      type: 'device',
      manufacturer: 'AKG',
      model: 'C414 XLS',
      category: 'microphone',
      ports: [{ id: 'out', label: 'OUT', direction: 'output', connectorType: 'XLR' }],
    },
  },
  {
    libraryId: 'lib-rode-ntg3',
    template: {
      type: 'device',
      manufacturer: 'Røde',
      model: 'NTG3',
      category: 'microphone',
      ports: [{ id: 'out', label: 'OUT', direction: 'output', connectorType: 'XLR' }],
    },
  },
  {
    libraryId: 'lib-electrovoice-re20',
    template: {
      type: 'device',
      manufacturer: 'Electro-Voice',
      model: 'RE20',
      category: 'microphone',
      ports: [{ id: 'out', label: 'OUT', direction: 'output', connectorType: 'XLR' }],
    },
  },
  {
    libraryId: 'lib-audiotechnica-atw-r5220',
    template: {
      type: 'device',
      manufacturer: 'Audio-Technica',
      model: 'ATW-R5220',
      category: 'wireless-mic',
      ports: [
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'XLR' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'XLR' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-sony-dwr-r03d',
    template: {
      type: 'device',
      manufacturer: 'Sony',
      model: 'DWR-R03D',
      category: 'wireless-mic',
      ports: [
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'XLR' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'XLR' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-lectrosonics-dsqd',
    template: {
      type: 'device',
      manufacturer: 'Lectrosonics',
      model: 'DSQD',
      category: 'wireless-mic',
      ports: [
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'XLR' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'XLR' },
        { id: 'out-3', label: 'OUT 3', direction: 'output', connectorType: 'XLR' },
        { id: 'out-4', label: 'OUT 4', direction: 'output', connectorType: 'XLR' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-spinetix-hmp400',
    template: {
      type: 'device',
      manufacturer: 'SpinetiX',
      model: 'HMP400',
      category: 'media-player',
      ports: [
        { id: 'hdmi-out', label: 'HDMI', direction: 'output', connectorType: 'HDMI' },
        { id: 'audio-out', label: 'AUDIO', direction: 'output', connectorType: '3.5mm' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-denon-dn-500bd-mkii',
    template: {
      type: 'device',
      manufacturer: 'Denon Professional',
      model: 'DN-500BD MKII',
      category: 'media-player',
      ports: [
        { id: 'hdmi-out', label: 'HDMI', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-l', label: 'OUT L', direction: 'output', connectorType: 'XLR' },
        { id: 'out-r', label: 'OUT R', direction: 'output', connectorType: 'XLR' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-blackmagic-hyperdeck-studio-hd-plus',
    template: {
      type: 'device',
      manufacturer: 'Blackmagic Design',
      model: 'HyperDeck Studio HD Plus',
      category: 'media-player',
      ports: [
        { id: 'sdi-in', label: 'SDI IN', direction: 'input', connectorType: 'BNC' },
        { id: 'sdi-out', label: 'SDI OUT', direction: 'output', connectorType: 'BNC' },
        { id: 'hdmi-out', label: 'HDMI OUT', direction: 'output', connectorType: 'HDMI' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-allenheath-sq5',
    template: {
      type: 'device',
      manufacturer: 'Allen & Heath',
      model: 'SQ-5',
      category: 'mixer',
      ports: [
        { id: 'mic-1', label: 'MIC 1', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-2', label: 'MIC 2', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-3', label: 'MIC 3', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-4', label: 'MIC 4', direction: 'input', connectorType: 'XLR' },
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'XLR' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'XLR' },
        { id: 'out-3', label: 'OUT 3', direction: 'output', connectorType: 'XLR' },
        { id: 'out-4', label: 'OUT 4', direction: 'output', connectorType: 'XLR' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-mackie-profx12v3',
    template: {
      type: 'device',
      manufacturer: 'Mackie',
      model: 'ProFX12v3',
      category: 'mixer',
      ports: [
        { id: 'mic-1', label: 'MIC 1', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-2', label: 'MIC 2', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-3', label: 'MIC 3', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-4', label: 'MIC 4', direction: 'input', connectorType: 'XLR' },
        { id: 'line-1', label: 'LINE 1', direction: 'input', connectorType: 'TRS' },
        { id: 'line-2', label: 'LINE 2', direction: 'input', connectorType: 'TRS' },
        { id: 'out-l', label: 'OUT L', direction: 'output', connectorType: 'XLR' },
        { id: 'out-r', label: 'OUT R', direction: 'output', connectorType: 'XLR' },
        { id: 'usb', label: 'USB', direction: 'output', connectorType: 'USB' },
      ],
    },
  },
  {
    libraryId: 'lib-soundcraft-ui24r',
    template: {
      type: 'device',
      manufacturer: 'Soundcraft',
      model: 'Ui24R',
      category: 'mixer',
      ports: [
        { id: 'mic-1', label: 'MIC 1', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-2', label: 'MIC 2', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-3', label: 'MIC 3', direction: 'input', connectorType: 'XLR' },
        { id: 'mic-4', label: 'MIC 4', direction: 'input', connectorType: 'XLR' },
        { id: 'out-l', label: 'OUT L', direction: 'output', connectorType: 'XLR' },
        { id: 'out-r', label: 'OUT R', direction: 'output', connectorType: 'XLR' },
        { id: 'aux-1', label: 'AUX 1', direction: 'output', connectorType: 'XLR' },
        { id: 'aux-2', label: 'AUX 2', direction: 'output', connectorType: 'XLR' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-qsc-gxd4',
    template: {
      type: 'device',
      manufacturer: 'QSC',
      model: 'GXD 4',
      category: 'amplifier',
      ports: [
        { id: 'in-a', label: 'IN A', direction: 'input', connectorType: 'XLR' },
        { id: 'in-b', label: 'IN B', direction: 'input', connectorType: 'XLR' },
        { id: 'out-a', label: 'OUT A', direction: 'output', connectorType: 'Speakon' },
        { id: 'out-b', label: 'OUT B', direction: 'output', connectorType: 'Speakon' },
      ],
    },
  },
  {
    libraryId: 'lib-powersoft-quattrocanali-1204',
    template: {
      type: 'device',
      manufacturer: 'Powersoft',
      model: 'Quattrocanali 1204',
      category: 'amplifier',
      ports: [
        { id: 'in-1', label: 'IN 1', direction: 'input', connectorType: 'Phoenix' },
        { id: 'in-2', label: 'IN 2', direction: 'input', connectorType: 'Phoenix' },
        { id: 'in-3', label: 'IN 3', direction: 'input', connectorType: 'Phoenix' },
        { id: 'in-4', label: 'IN 4', direction: 'input', connectorType: 'Phoenix' },
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'Phoenix' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'Phoenix' },
        { id: 'out-3', label: 'OUT 3', direction: 'output', connectorType: 'Phoenix' },
        { id: 'out-4', label: 'OUT 4', direction: 'output', connectorType: 'Phoenix' },
      ],
    },
  },
  {
    libraryId: 'lib-labgruppen-e8-2',
    template: {
      type: 'device',
      manufacturer: 'Lab Gruppen',
      model: 'E 8:2',
      category: 'amplifier',
      ports: [
        { id: 'in-a', label: 'IN A', direction: 'input', connectorType: 'Phoenix' },
        { id: 'in-b', label: 'IN B', direction: 'input', connectorType: 'Phoenix' },
        { id: 'out-a', label: 'OUT A', direction: 'output', connectorType: 'Phoenix' },
        { id: 'out-b', label: 'OUT B', direction: 'output', connectorType: 'Phoenix' },
      ],
    },
  },
  {
    libraryId: 'lib-electrovoice-zlx-12p-g2',
    template: {
      type: 'device',
      manufacturer: 'Electro-Voice',
      model: 'ZLX-12P-G2',
      category: 'loudspeaker',
      ports: [
        { id: 'in', label: 'IN', direction: 'input', connectorType: 'XLR' },
        { id: 'link-out', label: 'LINK', direction: 'output', connectorType: 'XLR' },
      ],
    },
  },
  {
    libraryId: 'lib-yamaha-dxr12mkii',
    template: {
      type: 'device',
      manufacturer: 'Yamaha',
      model: 'DXR12mkII',
      category: 'loudspeaker',
      ports: [
        { id: 'in', label: 'IN', direction: 'input', connectorType: 'XLR' },
        { id: 'link-out', label: 'LINK', direction: 'output', connectorType: 'XLR' },
      ],
    },
  },
  {
    libraryId: 'lib-bose-designmax-dm6se',
    template: {
      type: 'device',
      manufacturer: 'Bose Professional',
      model: 'DesignMax DM6SE',
      category: 'loudspeaker',
      ports: [{ id: 'in', label: 'IN', direction: 'input', connectorType: 'Phoenix' }],
    },
  },
  {
    libraryId: 'lib-sony-fw-55bz40l',
    template: {
      type: 'device',
      manufacturer: 'Sony',
      model: 'FW-55BZ40L',
      category: 'display',
      ports: [
        { id: 'hdmi-in-1', label: 'HDMI 1', direction: 'input', connectorType: 'HDMI' },
        { id: 'hdmi-in-2', label: 'HDMI 2', direction: 'input', connectorType: 'HDMI' },
        { id: 'lan', label: 'LAN', direction: 'input', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-panasonic-th-65sq2h',
    template: {
      type: 'device',
      manufacturer: 'Panasonic',
      model: 'TH-65SQ2H',
      category: 'display',
      ports: [
        { id: 'hdmi-in-1', label: 'HDMI 1', direction: 'input', connectorType: 'HDMI' },
        { id: 'hdmi-in-2', label: 'HDMI 2', direction: 'input', connectorType: 'HDMI' },
        { id: 'dp-in', label: 'DP', direction: 'input', connectorType: 'DisplayPort' },
        { id: 'lan', label: 'LAN', direction: 'input', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-viewsonic-cde6530',
    template: {
      type: 'device',
      manufacturer: 'ViewSonic',
      model: 'CDE6530',
      category: 'display',
      ports: [
        { id: 'hdmi-in-1', label: 'HDMI 1', direction: 'input', connectorType: 'HDMI' },
        { id: 'hdmi-in-2', label: 'HDMI 2', direction: 'input', connectorType: 'HDMI' },
        { id: 'usb-c-in', label: 'USB-C', direction: 'input', connectorType: 'USB-C' },
        { id: 'lan', label: 'LAN', direction: 'input', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-panasonic-aw-ue50',
    template: {
      type: 'device',
      manufacturer: 'Panasonic',
      model: 'AW-UE50',
      category: 'camera',
      ports: [
        { id: 'hdmi-out', label: 'HDMI', direction: 'output', connectorType: 'HDMI' },
        { id: 'sdi-out', label: 'SDI', direction: 'output', connectorType: 'BNC' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
        { id: 'usb', label: 'USB', direction: 'output', connectorType: 'USB' },
      ],
    },
  },
  {
    libraryId: 'lib-canon-cr-n300',
    template: {
      type: 'device',
      manufacturer: 'Canon',
      model: 'CR-N300',
      category: 'camera',
      ports: [
        { id: 'hdmi-out', label: 'HDMI', direction: 'output', connectorType: 'HDMI' },
        { id: 'sdi-out', label: 'SDI', direction: 'output', connectorType: 'BNC' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
        { id: 'usb', label: 'USB', direction: 'output', connectorType: 'USB' },
      ],
    },
  },
  {
    libraryId: 'lib-vaddio-roboshot-12e',
    template: {
      type: 'device',
      manufacturer: 'Vaddio',
      model: 'RoboSHOT 12E',
      category: 'camera',
      ports: [
        { id: 'hdmi-out', label: 'HDMI', direction: 'output', connectorType: 'HDMI' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-blackmagic-atem-mini-extreme-iso',
    template: {
      type: 'device',
      manufacturer: 'Blackmagic Design',
      model: 'ATEM Mini Extreme ISO',
      category: 'switcher',
      ports: [
        { id: 'in-1', label: 'IN 1', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-2', label: 'IN 2', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-3', label: 'IN 3', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-4', label: 'IN 4', direction: 'input', connectorType: 'HDMI' },
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'HDMI' },
        { id: 'mic-1', label: 'MIC 1', direction: 'input', connectorType: '3.5mm' },
        { id: 'mic-2', label: 'MIC 2', direction: 'input', connectorType: '3.5mm' },
        { id: 'usb-c', label: 'USB-C', direction: 'output', connectorType: 'USB-C' },
        { id: 'lan', label: 'LAN', direction: 'output', connectorType: 'RJ45' },
      ],
    },
  },
  {
    libraryId: 'lib-roland-v-8hd',
    template: {
      type: 'device',
      manufacturer: 'Roland',
      model: 'V-8HD',
      category: 'switcher',
      ports: [
        { id: 'in-1', label: 'IN 1', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-2', label: 'IN 2', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-3', label: 'IN 3', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-4', label: 'IN 4', direction: 'input', connectorType: 'HDMI' },
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-3', label: 'OUT 3', direction: 'output', connectorType: 'HDMI' },
        { id: 'audio-in', label: 'AUDIO IN', direction: 'input', connectorType: 'RCA' },
      ],
    },
  },
  {
    libraryId: 'lib-kramer-vs-44h2',
    template: {
      type: 'device',
      manufacturer: 'Kramer',
      model: 'VS-44H2',
      category: 'switcher',
      ports: [
        { id: 'in-1', label: 'IN 1', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-2', label: 'IN 2', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-3', label: 'IN 3', direction: 'input', connectorType: 'HDMI' },
        { id: 'in-4', label: 'IN 4', direction: 'input', connectorType: 'HDMI' },
        { id: 'out-1', label: 'OUT 1', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-2', label: 'OUT 2', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-3', label: 'OUT 3', direction: 'output', connectorType: 'HDMI' },
        { id: 'out-4', label: 'OUT 4', direction: 'output', connectorType: 'HDMI' },
        { id: 'lan', label: 'LAN', direction: 'input', connectorType: 'RJ45' },
      ],
    },
  },
];
