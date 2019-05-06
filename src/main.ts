import Vue from 'vue';
import Component from 'vue-class-component';
import App from './App.vue';
import './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Disponibiliza los guardas de navegación dentro de los componentes
Component.registerHooks([
	'beforeRouteEnter',
	'beforeRouteLeave',
	'beforeRouteUpdate',
]);

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');