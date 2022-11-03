<style>
    .browse-contents-list-item {
        width: 237px;
        height: 183px;
        display: flex;
        justify-content: center;
        align-items: center;            
    }
    
    .content-item-folder {
        background: rgb(2,0,36);
        background: linear-gradient(-65deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(9,18,127,1) 0%, rgba(4,145,173,1) 100%);
        height: 160px;
        width: 220px;
        position: relative;
        display: flex;
        justify-content: center;
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
    }
    
    .title-container {
        position: absolute;
        bottom: 25px;
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
        bottom: 4px;
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
        bottom: 4px;
        left: 8px;
    }
    
    .creater-container > h3 {
        font-size: 10px;
        font-family: 'goth';
        color: white;
        font-weight: 200;
    }
</style>

<script>
    import { createEventDispatcher } from 'svelte';

    var dispatch = createEventDispatcher();

    export let item;

    let src;
    let thumbnail;

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

</script>


<div class="browse-contents-list-item" on:click={clickHandle}>
    <div class="content-item-folder">
        <div class="img-container">
            {#if item.form == 0}
                <img src="http://localhost:8000{src}" width="100%">
            {:else}
                <img src="http://localhost:8000{thumbnail}" width="100%">
            {/if}
        </div>    
        <div class="title-container">
            <h3>{title}</h3>
        </div>
        <div class="date-container">
            <h3>{created_at}</h3>
        </div>
        <div class="creater-container">
            <h3>촬영자: {associate}</h3>
        </div>
    </div>
</div>