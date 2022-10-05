<script>

    export let editor;
    export let name;
    export let toggleFunction;
    export let svg;
</script>

{#if editor}
    {#if name == 'h-1'}
        <div id="tool-item" class:active={editor.isActive('heading', { level: 1 })} on:click={() => toggleFunction(editor)}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </div>
    {:else if name == 'h-2'}
        <div id="tool-item" class:active={editor.isActive('heading', { level: 2 })} on:click={() => toggleFunction(editor)}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </div>
    {:else if name == 'text'}
        <div id="tool-item" on:click={() => toggleFunction(editor)}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </div>
    {:else if name == 'paragraph'}
        <div id="tool-item" on:click={() => toggleFunction(editor)}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </div>
    {:else}
        <div id="tool-item" class:active={editor.isActive({name})} on:click={() => toggleFunction(editor)}>
            <div contenteditable="true" bind:innerHTML={svg}></div>
        </div>
    {/if}
{/if}
  
<style>

    #tool-item {
        margin: 0;
        border: none;
        outline: none;
        background: transparent;
        width: 25px;
        height: 25px;
        margin-left: 15px;
    }

      
    #tool-item.active {
        background: rgb(31, 32, 88);


    }
    
    div.active >div > svg {
        color: white;
    }

</style>