<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title class="headline text-uppercase">
				<span>Vuetify</span>
				<span class="font-weight-light">MATERIAL DESIGN</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn flat to="/">Home</v-btn>
				<v-btn flat to="/about">About</v-btn>
				<v-btn flat to="/perfil">Perfil</v-btn>
			</v-toolbar-items>
		</v-toolbar>

		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script lang="ts">
	import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
	import { Component, Vue } from 'vue-property-decorator';

	@Component({
		components: {
			HelloWorld,
		},
	})
	export default class App extends Vue { }
</script>