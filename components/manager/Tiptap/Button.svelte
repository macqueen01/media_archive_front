<script>

    export let editor;
    export let name;
    export let toggleFunction;
    export let svg;
</script>

{#if editor}
    {#if name == 'h-1'}
        <button class:active={editor.isActive('heading', { level: 1 })} on:click={toggleFunction}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </button>
    {:else if name == 'h-2'}
        <button class:active={editor.isActive('heading', { level: 2 })} on:click={toggleFunction}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </button>
    {:else if name == 'text'}
        <button on:click={toggleFunction}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </button>
    {:else if name == 'paragraph'}
        <button on:click={toggleFunction}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </button>
    {:else}
        <button class:active={editor.isActive({name})} on:click={toggleFunction}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </button>
    {/if}
{/if}
  
<style>

    button {
        margin: 0;
    }
      
    button.active {
        background: black;
        color: white;
    }

</style>