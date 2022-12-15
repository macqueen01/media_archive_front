<style>
    .category {
        width: 100%;
        height: 40px;
        position: relative;
        z-index: 7;
        background-color: rgb(31, 32, 88);
    }
    
    .category > h3 {
        font-size: 14px;
        font-family: 'goth';
        position: absolute;
        left: 65px;
        bottom: 8px;
        width: 80px;
        height: 20px;
        color: white;
    }
    
    .category > svg {
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: rgb(92, 92, 92)
    }
    
    .sub-category-container {
        width: 100%;
        height: fit-content;
        background-color: #ebebeb;
        z-index: 6;
        box-shadow: inset 3px 3px 6px 0 rgb(197 197 197 / 70%);
    }
    
    .sub-category {
        width: 100%;
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

    .icon {
        position: absolute;
        left: 25px;
        top: 10px;
    }
    
    
</style>

<script>
    
    export let category = {
        name: '이름없음',
        img: 'public/icons/chart.svg',
        sub_category: []
    };
    export let selected_index = null;
    export let index = 0;
    
    let sub_categories = category.sub_category;
    
    import { createEventDispatcher } from "svelte";
    import { fly, slide } from 'svelte/transition';
    import { quintIn, quintOut, quadIn } from 'svelte/easing';
    
    var dispatch = createEventDispatcher()

    function categoryNavigate(sub_index) {
        dispatch('navigate', {
            path: sub_categories[sub_index].path
        })
    }
    
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
    <img class="icon" src={category.img} height="18" />
    <h3>{category.name}</h3>
    {#if selected_index == index}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" class="w-6 h-6" width="15" height="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" class="w-6 h-6" width="15" height="15">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
    {/if}
</div>
{#if selected_index == index}
    <div class="sub-category-container" in:slide={{duration:400, easing: quintOut}} out:slide={{duration:10, easing: quadIn}}>
        {#each sub_categories as sub_category, sub_index}
            <div class="sub-category" on:click={() => categoryNavigate(sub_index)}>
                <h3>{sub_category.name}</h3>
            </div>
        {/each}
    </div>
{/if}