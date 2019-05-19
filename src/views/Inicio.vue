<template>
	<div class="pa-5">
		<div class="text-md-center display-3">
			Bienvenid@ a
			<span class="font-weight-light darken-2 primary--text text--lighten-1">
				Home<span class="font-weight-bold">Switch</span> Home
			</span>
		</div>
		<img src="https://i.imgur.com/3ZY7s2y.png" class="center"/>
		<br>
		<hr>
		<br>
		<p class="text-xs-center display-2">Subastas:</p>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component
	export default class Inicio extends Vue {

	}
</script>

<style>
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 20%;
	}
</style>