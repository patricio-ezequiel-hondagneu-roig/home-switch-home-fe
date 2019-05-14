<template>
	<v-dialog max-width="40rem">
		<v-btn flat slot="activator" class="success">Cargar residencia</v-btn>
		<CargarResidencia/>
	</v-dialog>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import CargarResidencia from '@/components/CargarResidencia.vue';

	@Component({
		components: {
			CargarResidencia,
		},
	})
	export default class VistaAdministrador extends Vue {

	}
</script>