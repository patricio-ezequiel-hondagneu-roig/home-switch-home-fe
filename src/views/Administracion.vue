<template>
	<v-container fluid fill-height>
		<v-layout justify-center row wrap>
			<table>
			<h1 class="display-2">Acciones</h1>
				<tr>
				<v-btn flat class="success display-1" :to="{ name: 'administracion de residencias' }">
					> Administrar Residencias
				</v-btn>
				</tr>
				<tr>
				<v-btn flat class="success display-1" :to="{ name: 'administracion de subastas' }">
					> Administrar Subastas
				</v-btn>
				</tr>
			</table>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Administracion extends Vue {

}
</script>