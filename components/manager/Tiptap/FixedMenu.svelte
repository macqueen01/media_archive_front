<script>
	import { toggleFunctions } from './buttonActions.js';
	import Button from './Button.svelte';
	
    export let editor;
</script>

{#if editor}
	<div class="fixed-menu">
		<div class="btn-wrap">
			{#each toggleFunctions as toggleFunction, index}
				<Button editor={editor} toggleFunction={toggleFunction.function} name={toggleFunction.name} svg={toggleFunction.svg} />
			{/each}	
		</div>
	</div>
{/if}

<style>

	.btn-wrap {
		position: absolute;
		left: 5px;
		width: 100%;
		height: fit-content;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.fixed-menu {
    	height: 55px;
        width: 100%;
        background: white;
        position: relative;
        top: 0;
        z-index: 3;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
	}
	
</style>