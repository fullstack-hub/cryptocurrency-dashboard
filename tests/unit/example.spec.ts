import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import moment from 'moment'

describe('HelloWorld.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message'
        const wrapper = shallowMount(HelloWorld, {
            propsData: { msg },
        })
        expect(wrapper.text()).to.include(msg)
    })

    it('date', () => {
        console.log(new Date('2015-01-01 00:33:33.232'))
        console.log(new Date(1606537507.68 * 1000))
        console.log(moment(new Date(1606537507.68 * 1000)).format('HH:mm:ss'))
    })
})
