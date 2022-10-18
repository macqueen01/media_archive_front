<style>
    .browse-control-container {
        width: 100%;
        height: fit-content;
        z-index: 7
    }

    .block {
        height: 160px;
        width: 100%;
        z-index: 1;
        background-color: rgb(31, 32, 88);
    }

</style>

<script>
    import ManageCategory from "../../pages/sidebar/ManageCategory.svelte";

    import { meta, Route, router } from 'tinro';

    export let categories;
    
    let selected_index = null;
    
    function categorySelect(e) {
        selected_index = e.detail.index;
    }

    function categoryNavigate(e) {
        router.goto(e.detail.path)
    }

</script>


<div class="browse-control-container">
    <div class="block">
    </div>
    {#each categories as category, index}
        <ManageCategory category={category} index={index} selected_index={selected_index} on:click={categorySelect} on:navigate={categoryNavigate}/>
    {:else}
        <h3>비어있음</h3>
    {/each}
</div>