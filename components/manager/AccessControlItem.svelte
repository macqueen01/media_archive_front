<style>
    .table-content {
        width: 100%;
        height: 60px;
        background-color: white;
        display: grid;
        grid-template-columns: 1fr 1fr 3fr 5fr 2fr 2fr;
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
        height: 60px;
        grid-column: 1 / 2;
    }

    .id-wrap {
        height: 60px;
        grid-column: 2 / 3;
    }
    
    .name-wrap {
        height: 60px;
        grid-column: 3 / 4;
    }

    .detail-wrap {
        height: 60px;
        grid-column: 4 / 5;
    }

    .accept-wrap {
        height: 60px;
        grid-column: 5 / 6;
    }

    .decline-wrap {
        height: 60px;
        grid-column: 6 / 7;
    }

    .container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    .container > h3 {
        font-family: 'goth';
        font-size: 13px;
        color:#1e1c3b;
        width: 100%;
        height: fit-content;
        text-align: center;
    }

    .decline-container > button, .accept-container > button {
        border: none;
        width: 20px;
        height: 20px;
        background-color: transparent;
    }


</style>

<script>

    import { createEventDispatcher, onDestroy, onMount } from 'svelte';

    export let checked = false;
    export let data;
    export let index;



    var dispatch = createEventDispatcher();

    let user_id = '';
    let user_name = '';
    let title = '';
    
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

    function acceptCall() {
        dispatch('accept', {
            index: index
        })
    }

    function declineCall() {
        dispatch('decline', {
            index: index
        })
    }

    function focusCall() {
        dispatch('click', {
            index: index
        })
    }

    if (data) {
        if (data.request_form == 0) {
            user_id = data.request_form0_requested_by.id;
            user_name = data.request_form0_requested_by.name;
        } else if (data.request_form == 1) {
            user_id = data.request_form1_requested_by.id;
            user_name = data.request_form1_requested_by.name;
        }
        title = data.title;
    }

</script>


<div class="table-content" on:click={focusCall}>
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
    <div class="id-wrap">
        <div class="container">
            <h3>{user_id}</h3>
        </div>
    </div>
    <div class="name-wrap">
        <div class="container">
            <h3>{user_name}</h3>
        </div>
    </div>
    <div class="detail-wrap">
        <div class="container">
            <h3>{title}</h3>
        </div>
    </div>
    <div class="accept-wrap">
        <div class="accept-container container">
            <button on:click={acceptCall}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </button>
        </div>
    </div>
    <div class="decline-wrap">
        <div class="decline-container container">
            <button on:click={declineCall}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</div>