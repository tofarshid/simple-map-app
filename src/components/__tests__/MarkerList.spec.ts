import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MarkerList from '../MarkerList.vue';

const sampleMarkers = [
  { id: 1, lat: -33.81, long: 151.0, address: 'Test Street' },
  { id: 2, lat: -33.82, long: 151.01, address: 'Other Road' },
];

describe('MarkerList', () => {
  it('shows count and marker rows', () => {
    const wrapper = mount(MarkerList, {
      props: {
        markers: sampleMarkers,
        markerCount: 2,
        loading: false,
        error: null,
      },
    });

    expect(wrapper.get('h2').text()).toContain('Marker History | Count: 2');
    const links = wrapper.findAll('a');
    expect(links).toHaveLength(2);
    expect(links[0]!.text()).toContain('1: ');
    expect(links[0]!.text()).toContain('Test Street');
  });

  it('emits select with the clicked marker', async () => {
    const wrapper = mount(MarkerList, {
      props: {
        markers: sampleMarkers,
        markerCount: 2,
        loading: false,
        error: null,
      },
    });

    await wrapper.findAll('a')[0]!.trigger('click');

    expect(wrapper.emitted('select')).toHaveLength(1);
    expect(wrapper.emitted('select')![0]).toEqual([sampleMarkers[0]]);
  });
});
