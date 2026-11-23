import {VisuallyJsModel} from "@visuallyjs/browser-ui";

export const DEVICE_TYPES: readonly { name: string; prefix: string }[] = [
    { name: 'microphone', prefix: 'MIC' },
    { name: 'wireless-mic', prefix: 'WMIC' },
    { name: 'media-player', prefix: 'MEDIA' },
    { name: 'mixer', prefix: 'MIXER' },
    { name: 'amplifier', prefix: 'AMP' },
    { name: 'loudspeaker', prefix: 'SPK' },
    { name: 'display', prefix: 'DISPLAY' },
    { name: 'camera', prefix: 'CAM' },
    { name: 'switcher', prefix: 'SW' },
];

export const DEFAULT_DEVICE_PREFIX = 'DEV';

export const SIGNAL_TYPES: readonly string[] = [
    'audio', 'video', 'speaker', 'ethernet', 'power', 'control', 'usb', 'fiber',
];

export const CONNECTOR_TYPES: readonly string[] = [ '3.5mm', 'BNC', 'DisplayPort', 'HDMI', 'Optical', 'Phoenix', 'RCA', 'RJ45', 'Speakon', 'TRS', 'USB', 'USB-C', 'VGA', 'XLR' ];

export type PortDirection = 'input' | 'output';

export interface DevicePort {
    id: string;
    label: string;
    direction: PortDirection;
    connectorType?: string;
}

export type DeviceNode = {data:{deviceId:string}}

export interface DeviceNodeData {
    type: 'device';
    deviceId: string;
    manufacturer: string;
    model: string;
    category?: string;
    location?: string;
    ports: DevicePort[];
}

export interface CableEdgeData {
    type: 'cable';
    cableId: string;
    cableType?: string;
}

export const generateDeviceId = (
    category: string | undefined,
    model: VisuallyJsModel,
): string => {
    const name = category?.trim().toLowerCase();
    const prefix = DEVICE_TYPES.find(type => type.name === name)?.prefix ?? DEFAULT_DEVICE_PREFIX;
    const pattern = new RegExp(`^${prefix}-(\\d+)$`);
    const used = new Set<number>();
    const existingNodes = model.getNodes() as unknown as Array<DeviceNode>

    for (const node of existingNodes) {
        const match = node.data.deviceId.match(pattern);
        if (match) used.add(Number.parseInt(match[1], 10));
    }

    let n = 1;
    while (used.has(n)) n++;
    return `${prefix}-${n}`;
};
