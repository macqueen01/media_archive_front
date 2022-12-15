<style>
    .browse-contents-list-item {
        width: 237px;
        height: 183px;
        display: flex;
        justify-content: center;
        align-items: center; 
        transition: all 0.3s;           
    }
    
    .content-item-folder {
        background: rgb(2,0,36);
        background: linear-gradient(-65deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(9,18,127,1) 0%, rgba(4,145,173,1) 100%);
        height: 160px;
        width: 220px;
        position: relative;
        display: flex;
        justify-content: center;
        border-radius: 8px;
    }
    
    .img-container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        top: 0;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        transition: all 0.3s; 
    }
    
    .title-container {
        position: relative;
        bottom: -10px;
        width: 93%;
        height: 25px;
        left: 8px;
    }
    
    .title-container > h3 {
        font-size: 11.5px;
        font-family: 'goth';
        color: white;
        font-weight: 300;
    }
    
    .date-container {
        position: absolute;
        bottom: 8px;
        right: 8px;    
    }
    
    .date-container > h3 {
        font-size: 10px;
        font-family: 'goth';
        color: white;
        font-weight: 200;
    }
    
    .creater-container {
        position: absolute;
        bottom: 8px;
        left: 8px;
    }
    
    .creater-container > h3 {
        font-size: 10px;
        font-family: 'goth';
        color: white;
        font-weight: 200;
    }

    .item-hover {
        filter: grayscale(0.75);
    }

    .img-hover {
        height: 0;
    }

    .text-container {
        height: 60px;
        width: 100%;
        position: absolute;
        bottom: 0;
        transition: all 0.3s;
    }

    .text-hover {
        height: 100%;
        width: 100%;
    }

    .text-content-container {
        height: 100px;
        width: 100%;
        position: absolute;
        top: 35px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .text-content-container > h3 {
        font-size: 11.5px;
        font-family: 'goth';
        color: white;
        font-weight: 300;
        width: 90%;
        height: fit-content;
    }


</style>

<script>
    import { createEventDispatcher } from 'svelte';
    import { address } from "../../utilities/settings";
    import { fade } from "svelte/transition";
    

    var dispatch = createEventDispatcher();

    export let item;

    let hover = false;
    let src;
    let thumbnail;
    let content = trimContent(item.content);

    if (!item.include[0]) {
        src = null;
        thumbnail = null;
    } else {
        src = item.include[0].url;
        thumbnail = item.include[0].thumbnail;
    }

    let title = item.title;
    let created_at = item.created_at.split('T')[0];
    let associate = item.associate.title;


    function clickHandle() {
        dispatch('click', {
            item: item
        })
    }

    function hoverIn() {
        hover = true;
    }

    function hoverOut() {
        hover = false;
    }

    function trimContent(content) {
        let strippedHtml = content.replace(/<[^>]+>/g, '');
        strippedHtml = strippedHtml.slice(0, 150)
        return strippedHtml
    }


</script>


<div class={hover ? "browse-contents-list-item item-hover" : "browse-contents-list-item"} on:click={clickHandle} on:mouseover={hoverIn} on:mouseleave={hoverOut}>
    <div class="content-item-folder">
        <div class={hover ? "img-container img-hover" : "img-container"}>
            {#if item.form == 0}
                <img src="http://{address}{src}" width="100%">
            {:else}
                <img src="http://{address}{thumbnail}" width="100%">
            {/if}
        </div>
        <div class={hover ? "text-container text-hover" : "text-container"}>
            <div class="title-container">
                <h3>{title}</h3>
            </div>

            {#if hover}
                <div class="text-content-container" transition:fade={{duration: 100}}>
                    <h3>{content}</h3>
                </div>
            {/if}

            <div class="date-container">
                <h3>{created_at}</h3>
            </div>

            <div class="creater-container">
                <h3>촬영자: {associate}</h3>
            </div>
        </div> 
    </div>
</div>

