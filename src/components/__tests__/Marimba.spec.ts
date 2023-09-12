import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Marimba from '../MarimbaComponent.vue'

describe('Marimba', () => {
  it('renders properly', () => {
    const wrapper = mount(Marimba, { props: { currentNotes: ['C3', 'D3', 'E3', 'F3'] } })
    expect(wrapper.find('.layer').exists())
  })
})
