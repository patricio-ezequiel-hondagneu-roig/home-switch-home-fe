<template>
	<div>Perfil del usuario {{ $route.params.id }} se cargó</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({ })
export default class Perfil extends Vue { }
</script>

<style lang="stylus" scoped></style>
