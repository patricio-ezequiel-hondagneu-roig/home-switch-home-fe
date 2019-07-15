<template>
	<v-container fluid>
		<v-flex align-center>
			<v-layout align-center justify-center>
				<p class="display-1">
					<span class="font-weight-black"> Hot Sales activos: </span>
				</p>
			</v-layout>

			<br>
			<hr>
		</v-flex>
		<v-layout column wrap>
			<v-flex ma-2>
				<v-btn flat class="primary" :to="{ name: 'administracion de posibles hot sales' }">
					Agregar hotsales
				</v-btn>
			</v-flex>
			<v-flex>
				<TablaDeHotsales></TablaDeHotsales>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import { server } from '@/utils/helper';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';
	import TablaDeHotsales from '@/components/TablaDeHotsales.vue';
	import router from '@/router';
	@Component({
		components: {
			TablaDeHotsales,
		},
	})
	export default class AdministracionDeHotsalesActivos extends Vue {
	}
</script>