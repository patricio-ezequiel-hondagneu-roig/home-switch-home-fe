import HelloWorld from '@/components/HelloWorld.vue';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use( Vuetify );

describe('HelloWorld.vue', () => {
	it('renders props.msg when passed', () => {
		const msg: string = 'new message';
		const wrapper = shallowMount(HelloWorld, {
			propsData: { msg },
		});
		expect(wrapper.text()).toMatch(msg);
	});
});