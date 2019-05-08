import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
	theme: {
		primary: '#00A1E1',
		secondary: '#4C4D4F',
		accent: '#E91E63',
		error: '#FF5722',
		warning: '#FFC107',
		info: '#3F51B5',
		success: '#4CAF50'
	},
	options: {
		customProperties: true,
	},
	iconfont: 'md',
});