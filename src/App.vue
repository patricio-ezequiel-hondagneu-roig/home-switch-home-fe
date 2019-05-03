<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title class="headline text-uppercase">
				<span>Vuetify</span>
				<span class="font-weight-light">MATERIAL DESIGN</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn flat href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
				<span class="mr-2">Latest Release</span>
				<v-icon>open_in_new</v-icon>
			</v-btn>
		</v-toolbar>

		<v-content>
			<HelloWorld/>
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