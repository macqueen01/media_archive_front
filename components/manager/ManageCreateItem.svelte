<style>
    .table-content {
        width: 100%;
        height: 100px;
        background-color: white;
        display: grid;
        grid-template-columns: 1fr 5fr 10fr 3fr 1fr;
    }

    .check-btn {
        border: thin solid rgb(31, 32, 88);
        border-radius: 0;
        height: 18px;
        width: 18px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
    }

    .check-btn-clicked {
        background: rgb(31, 32, 88);
        border: none;
        border-radius: 0;
        height: 18px;
        width: 18px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
    }

    .check-wrap {
        height: 100px;
        grid-column: 1 / 2;
    }

    .snapshot-wrap {
        height: 100px;
        grid-column: 2 / 3;
    }
    
    .title-wrap {
        height: 100px;
        grid-column: 3 / 4;
    }

    .download-wrap {
        height: 100px;
        grid-column: 4 / 5;
    }

    .delete-wrap {
        height: 100px;
        grid-column: 5 / 6;
    }

    .container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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

    .delete-container > button, .download-container > button {
        border: none;
        width: 20px;
        height: 20px;
        background-color: transparent;
    }


</style>

<script>

    import { createEventDispatcher, onDestroy, onMount } from 'svelte';

    export let checked = false;
    export let src = '/public/main_page_bg.JPG';
    export let file;
    export let index = 0;
    export let type = '사진';

    let element;
    let editor;
    let name = 'unknown';

    var dispatch = createEventDispatcher();

    
    function checkHandle() {
        if (checked) {
            checked = false;
        } else {
            checked = true;
        }

        dispatch('check', {
            index: index,
            checked: checked
        })
    }

    function downloadCall() {
        dispatch('download', {
            index: index
        })
    }

    function deleteCall() {
        dispatch('delete', {
            index: index
        })
    }

    $: {
        if (src) {
            name = file.name;
        } else {
            name = "알 수 없는 이름";
        }
    }
</script>


<div class="table-content">
    <div class="check-wrap wrap">
        <div class="check-container container">
            <button class="{(checked) ? 'check-btn-clicked' : 'check-btn'}" on:click={checkHandle}>
                {#if checked}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" height="17" width="17">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                {/if} 
            </button>
        </div>
    </div>
    <div class="snapshot-wrap">
        <div class="snapshot-container container">
            {#if type == 0}
                <img src="{src}" height="85px" alt="test-img">
            {:else if type == 1}
                <video height="85px" controls>
                    <source src={src} type="video/mp4"/>
                </video>
            {:else}
            {/if}
        </div>
    </div>
    <div class="title-wrap">
        <div class="title-container container">
            <h3>{name}</h3>
        </div>
    </div>
    <div class="download-wrap">
        <div class="download-container container">
            <button on:click={downloadCall}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </button>
        </div>
    </div>
    <div class="delete-wrap">
        <div class="delete-container container">
            <button on:click={deleteCall}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</div>