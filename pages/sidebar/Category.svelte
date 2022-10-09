<style>
    .category {
        width: 180px;
        height: 40px;
        position: relative;
        z-index: 1;
        background-color: white;
    }
    
    .category > h3 {
        font-size: 14px;
        font-family: 'goth';
        position: absolute;
        left: 40px;
        bottom: 8px;
        width: 50px;
        height: 20px;
    }
    
    .category > svg {
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: rgb(92, 92, 92)
    }
    
    .sub-category-container {
        width: 180px;
        height: fit-content;
        background-color: #ebebeb;
        z-index: 0;
        box-shadow: inset 3px 3px 6px 0 rgb(197 197 197 / 50%);
    }
    
    .sub-category {
        width: 180px;
        height: 35px;
        position: relative;
    }
    
    .sub-category > h3 {
        font-family: 'goth';
        font-size: 11px;
        position: absolute;
        right: 30px;
        bottom: 8px;
        color: rgb(82, 82, 82);
    }
    
    
</style>

<script>
    
    export let category = "이름없음";
    export let selected_index = null;
    export let index = 0;
    
    let sub_categories = [
        "행사",
        "훈련",
        "교육",
        "교장"
    ]
    
    import { createEventDispatcher } from "svelte";
    import { fly } from 'svelte/transition';
    import { quintIn, quintOut, quadIn } from 'svelte/easing';
    
    var dispatch = createEventDispatcher()
    
    function categorySelect() {
        if (index == selected_index) {
            dispatch('click', {
                index: null
            })
        } else {
            dispatch('click', {
                index: index
            })
        }
    }
    

    
</script>


<div class="category" on:click={categorySelect}>
    <h3>{category}</h3>
    {#if selected_index == index}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6" width="15" height="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6" width="15" height="15">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
    {/if}
</div>
{#if selected_index == index}
    <div class="sub-category-container" in:fly={{duration:400, x:0, y:-200, easing: quintOut}} out:fly={{duration:10, x:0, y:-200, easing: quadIn}}>
        {#each sub_categories as sub_category, sub_index}
        <div class="sub-category">
            <h3>{sub_category}</h3>
        </div>
        {/each}
    </div>
{/if}