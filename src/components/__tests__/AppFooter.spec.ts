import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppFooter from '../AppFooter.vue';

describe('AppFooter', () => {
  it('renders a footer with copyright and current year', () => {
    const wrapper = mount(AppFooter);
    const year = new Date().getFullYear();

    expect(wrapper.find('footer').exists()).toBe(true);
    expect(wrapper.text()).toContain(String(year));
  });
});
