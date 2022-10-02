<style>
    .browse-navbar-wrap {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .go-back-wrap {
        height: 40px;
        width: 40px;
        position: absolute;
        left: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .go-back {
        background: rgb(241, 28, 0);
        background: linear-gradient(-65deg, rgba(241,28,0,1) 0%, rgb(9 9 121 / 0%) 0%, rgb(189 64 64 / 88%) 0%, rgb(5 121 164) 100%);
        height: 100%;
        width: 100%;
        color: white;
        border: none;
        outline: none;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .go-forth-wrap {
        height: 40px;
        width: 40px;
        position: absolute;
        right: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .go-forth {
        background: rgb(241, 28, 0);
        background: linear-gradient(-65deg, rgb(5 123 165) 0%, rgb(5 116 162) 0%, rgb(6 114 162) 0%, rgb(9 29 131) 100%);
        height: 40px;
        width: 40px;
        color: white;
        border: none;
        outline: none;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }


    .left-svg {
        position: absolute;
        left: 9px;
    }

    .right-svg {
        position: absolute;
        right: 9px;
    }

    .search-panel-wrap {
        width: 400px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .search-panel {
        width: 370px;
        height: 95%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        right: 0;
    }

    .search-panel-focused {

    }

    .search-input > h3 {
        font-family: 'goth';
        font-size: 12px;
        color: rgb(92, 92, 92);
        
    }



</style>

<script>

    import { createEventDispatcher } from 'svelte';
    import UserSearch from '../../components/user/UserSearch.svelte';

    var dispatch = createEventDispatcher()

    export let page = 1;
    export let focus = false;

    function pageIncrease() {
        page += 1;
        dispatch('pageChange', {
            page: page
        })
    }

    function pageDecrease() {
        if (page != 1) {
            page -= 1;
            dispatch('pageChange', {
                page: page
            })
        }
    }


</script>

<div class="browse-navbar-wrap">
    {#if !focus}
        {#if page != 1}
            <div class="go-back-wrap">
                <button class="go-back" on:click={pageDecrease}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="left-svg" width="19" height="19">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>
        {/if}

        <div class="search-panel-wrap">
            <UserSearch />
        </div>

        <div class="go-forth-wrap">
            <button class="go-forth" on:click={pageIncrease}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="right-svg" width="19" height="19">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    {/if}
</div>