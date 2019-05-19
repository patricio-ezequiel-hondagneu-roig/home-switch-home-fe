<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<h1>Acciones</h1>
				<v-btn flat class="success" @click.stop=" AdministracionResidencias()">
					Admin. Residencias
				</v-btn>
				<v-btn flat class="success" @click.stop=" AdministracionSubastas()">
					Admin. Subastas
				</v-btn>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router from '@/router';
@Component
export default class VistaAdministrador extends Vue {
	public AdministracionResidencias() {
		router.push({ name: 'adminResidencias' });
	}
	public AdministracionSubastas() {
		router.push({ name: 'adminSubastas' });
	}
}
</script>