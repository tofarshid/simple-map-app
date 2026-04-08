import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('leaflet', () => {
  class MockMarker {
    lat: number;
    lng: number;

    constructor(lat: number, lng: number) {
      this.lat = lat;
      this.lng = lng;
    }

    addTo = vi.fn((group: { layers: MockMarker[] }) => {
      group.layers.push(this);
      return this;
    });

    bindPopup = vi.fn().mockReturnThis();
    getLatLng = () => ({ lat: this.lat, lng: this.lng });
    openPopup = vi.fn();
  }

  const markersLayer = {
    layers: [] as MockMarker[],
    addTo: vi.fn(function (this: typeof markersLayer) {
      return this;
    }),
    clearLayers: vi.fn(function (this: typeof markersLayer) {
      this.layers.length = 0;
    }),
    eachLayer: vi.fn(function (this: typeof markersLayer, cb: (layer: MockMarker) => void) {
      this.layers.forEach(cb);
    }),
  };

  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    on: vi.fn(),
    off: vi.fn(),
    remove: vi.fn(),
    flyTo: vi.fn(),
  };

  return {
    default: {
      map: vi.fn(() => mockMap),
      layerGroup: vi.fn(() => markersLayer),
      marker: vi.fn((latlng: [number, number]) => new MockMarker(latlng[0], latlng[1])),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      Marker: MockMarker,
    },
  };
});

import L from 'leaflet';
import MapCard from '../MapCard.vue';

describe('MapCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders map title and container', async () => {
    const wrapper = mount(MapCard, {
      props: { markers: [] },
    });
    await flushPromises();

    expect(wrapper.get('h2').text()).toBe('Map');
    expect(wrapper.find('#map-leaflet').exists()).toBe(true);
    expect(L.map).toHaveBeenCalledWith('map-leaflet');
  });

  it('emits map-click when the map fires click', async () => {
    const wrapper = mount(MapCard, {
      props: { markers: [] },
    });
    await flushPromises();

    const map = (L.map as ReturnType<typeof vi.fn>).mock.results[0]?.value as {
      on: ReturnType<typeof vi.fn>;
    };
    const clickCall = map.on.mock.calls.find((c: unknown[]) => c[0] === 'click');
    expect(clickCall).toBeDefined();

    const handler = clickCall![1] as (e: { latlng: { lat: number; lng: number } }) => void;
    handler({ latlng: { lat: -33.812345, lng: 151.007456 } });

    expect(wrapper.emitted('map-click')).toEqual([[{ lat: -33.812345, long: 151.007456 }]]);
  });

  it('renders markers from props', async () => {
    const markers = [
      { id: 1, lat: -33.81, long: 151.0, address: 'A' },
      { id: 2, lat: -33.82, long: 151.01, address: 'B' },
    ];

    const wrapper = mount(MapCard, {
      props: { markers },
    });
    await flushPromises();

    expect(L.marker).toHaveBeenCalledTimes(2);
    expect(L.marker).toHaveBeenNthCalledWith(1, [-33.81, 151.0]);
    expect(L.marker).toHaveBeenNthCalledWith(2, [-33.82, 151.01]);
    expect(wrapper.props('markers')).toHaveLength(2);
  });
});
