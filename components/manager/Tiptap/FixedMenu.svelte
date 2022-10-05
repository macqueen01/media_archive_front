<script>
	import { toggleFunctions } from './buttonActions.js';
	import Button from './Button.svelte';
	
    export let editor;
</script>

{#if editor}
	<div class="fixed-menu">
		<!--
		{#each toggleFunctions as toggleFunction, index}
			<Button editor={editor} toggleFunction={toggleFunction.function} name={toggleFunction.name} svg={toggleFunction.svg} />
		{/each}
		-->
		<Button editor={editor} toggleFunction={() => toggleFunctions[0].function} name="bold" svg={toggleFunctions[0].svg}/>
	</div>
{/if}

<style>
	.fixed-menu {
    	background: #ccc;
		padding: 2px;
		min-height: 36px;
	}
</style>