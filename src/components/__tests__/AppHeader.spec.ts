import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppHeader from '../AppHeader.vue';

describe('AppHeader', () => {
  it('renders the app title', () => {
    const wrapper = mount(AppHeader);
    expect(wrapper.text()).toContain('Simple Map App');
  });
});
