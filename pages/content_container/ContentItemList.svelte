<style>
    .table-content {
        width: 100%;
        height: 100px;
        background-color: white;
        display: grid;
        grid-template-columns: 1fr 5fr 5fr 3fr 3fr;
    }

    .id-wrap {
        height: 100px;
        grid-column: 1 / 2;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .snapshot-wrap {
        height: 100px;
        grid-column: 2 / 3;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    
    .title-wrap {
        height: 100px;
        grid-column: 3 / 4;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .associate-wrap {
        height: 100px;
        grid-column: 4 / 5;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .date-wrap {
        height: 100px;
        grid-column: 5 / 6;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .container {
        font-family: 'goth';
        font-size: 13px;
        color: #1e1c3b;
        width: 100%;
        height: fit-content;
        text-align: center;
    }

    .snapshot-container {
        width: 240px;
        overflow-y: hidden;
        overflow-x: hidden;
    }

    .container > h3 {
        font-family: 'goth';
        font-size: 13px;
        color:#1e1c3b;
        width: 100%;
        height: fit-content;
    }



</style>

<script>

    import { createEventDispatcher, onDestroy, onMount } from 'svelte';

    export let item = item;

    var dispatch = createEventDispatcher();

    function clickCall() {
        dispatch('click', {
            item: item
        })
    }

</script>


<div class="table-content" on:click={clickCall}>
    <div class="id-wrap wrap">
        <div class="id-container container">
            <h3>{item._id}</h3>
        </div>
    </div>
    <div class="snapshot-wrap">
        <div class="snapshot-container container">
            {#if item.type == 0}
                <img src="{item.src[0]}" height="85px" alt="test-img">
            {:else if item.type == 1}
                <video height="85px" controls>
                    <source src={item.src[0]} type="video/mp4"/>
                </video>
            {:else}
            {/if}
        </div>
    </div>
    <div class="title-wrap">
        <div class="title-container container">
            <h3>{item.title}</h3>
        </div>
    </div>
    <div class="associate-wrap">
        <div class="associate-container container">
            <h3>{item.associate}</h3>
        </div>
    </div>
    <div class="date-wrap">
        <div class="date-container container">
            <h3>{item.date}</h3>
        </div>
    </div>
</div>