<style>
    .browse-main-wrap {
        width: 100%;
        height: 620px;
        position: absolute;
        top: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .browse-main-container {
        width: 1200px;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 5fr;
    }
    
    .browse-control-wrap {
        width: 200px;
        height: 100%;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .browse-control-container {
        width: 180px;
        height: 100%;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    
    .browse-content-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    } 
    
    
    
</style>

<script>
    import Category from "./sidebar/Category.svelte";
    import ContentContainer from "./content_container/ContentContainer.svelte";
    import BrowseNavbar from './sidebar/BrowseNavbar.svelte';

    import { meta, Route } from 'tinro';
    
    let categories = [
        "영상",
        "사진",
        "문서"
    ]
    
    let selected_index = null;

    let page = 1;
    let focus = false;
    
    function categorySelect(e) {
        selected_index = e.detail.index;
    }

    function pageHandle(e) {
        page = e.detail.page
    }

    function focusHandle(e) {
        focus = e.detail.focus
    } 

</script>

<div class="browse-main-wrap">
    <div class="browse-main-container">
        <div class="browse-control-wrap">
            <div class="browse-control-container">
                {#each categories as category, index}
                    <Category category={category} index={index} selected_index={selected_index} on:click={categorySelect}/>
                {:else}
                    <h3>비어있음</h3>
                {/each}
            </div>
        </div>
        
        <div class="browse-content-wrap">
            <ContentContainer page={page} on:pageChange={pageHandle} on:focus={focusHandle}/>
            <BrowseNavbar page={page} on:pageChange={pageHandle} focus={focus}/>
        </div>
    </div>
</div>