<style>
    .browse-content-container {
        width: 960px;
        height: 550px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: -4px 5px 14px 0 rgb(197 197 197 / 50%);       
    }    
    
    .browse-contents-list-view {
        height: 549px;
        width: 948px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        position: absolute;
    }

    
    .upload-view {
        width: 100%;
        height: 100%;
        z-index: 1;
        position: relative;
    }


    .list-frame {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        z-index: 3;
    }

    .table {
        width: 100%;
        height: fit-content;
        position: absolute;
        top: 45px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .table-header {
        position: absolute;
        width: 100%;
        height: 45px;
        background-color: white;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        display: grid;
        grid-template-columns: 1fr 5fr 5fr 3fr 3fr;
        z-index: 4;
    }

    .header-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header-snapshot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 2 / 3;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .header-id-container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        padding-left: 13px;
        padding-right: 8px;
        grid-column: 1 / 2;
    }

    .header-title-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 3 / 4;
    }

    .header-associate-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 4 / 5;
    }

    .header-date-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 5 / 6;
    }

    .header-container > h3 {
        font-family: 'goth';
        font-size: 14px;
        color:#1e1c3b;
    }

    .fetch-fail-page {
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .fetch-fail-page > h4 {
        font-family: 'goth';
        font-size: 30px;
        width: 400px;
        color: rgb(226, 41, 41);
        text-align: center;
    }

    .fetch-fail-page > h5 {
        font-family: 'goth';
        font-size: 23px;
        width: 500px;
        color: rgb(214 39 39);
        text-align: center;
    }

</style>

<script>
    import { Route, meta, router } from 'tinro';
    import { draw, fade } from 'svelte/transition';
    import { createEventDispatcher, onMount } from 'svelte';
    import { Circle } from 'svelte-loading-spinners';


    import ContentItem from "./ContentItem.svelte";
    import ContentView from "./ContentView.svelte";
    import ContentItemList from './ContentItemList.svelte';
    import axios from 'axios';


    /* Page starts from 1.
       Each page contains maximum 12 number of items.
       When clicked, the item is focused and container displays
       FOCUS container which shows a detailed view of selected item.
       
       ContentContainer, when first mounted, fetches twelve or less number of items.
       It then is triggered to fetch twelve more and save them in FETCHED_ITEMS when GO-FORTH button
       in "../sidebar/BrowseNavbar.svelte" is clicked.
    */

    export let page = 1;
    export let type = 0;
    export let view = 'box';


    var dispatch = createEventDispatcher();

    let focus = null;
    
    let fetched_items = [];

    async function fetch_items(page, type) {
        fetched_items = await axios({
            // Weirdly, query with two keys: ?page=1&type=1 malfunctions svelte... 
            url: `http://localhost:8000/drf/cases/browse/${type}?page=${page}`,
            method: 'get',
        })
        return fetched_items.data.results
    }


    function passFocus(e) {
        focus = e.detail.item;
        dispatch('focus', {
            focus: true
        })
        router.goto(`/manage/cases/browse/${focus.form}/${focus.id}`)
    }

    function undoFocus() {
        focus = null;
        dispatch('focus', {
            focus: false
        })
    }

    /* Test variables to be fetched from server when online */
    
    /* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */
    let user = {
        authority: true,
        name: "Kim"
    }




    
</script>
           

<div class="browse-content-container">
    <Route path="/">
    {#await fetch_items(page, type)}
        <Circle size="60" color="rgb(31, 32, 88)" unit="px" duration="1s" />
    {:then result}
    {#if view == 'box'}
        <div class="browse-contents-list-view">
            {#each result as item, index}
                <ContentItem item={item} on:click={passFocus} />
            {/each}
        </div>
    {:else if view == 'list'}
        <div class="upload-view">
            <div class="table-header">
                <div class="header-id-container">
                    <div class="header-container">
                        <h3>ID</h3>
                    </div>
                </div>
                <div class="header-snapshot-container">
                    <div class="header-container">
                        <h3>스냅샷</h3>
                    </div>
                </div>
                <div class="header-title-container">
                    <div class="header-container">
                        <h3>행사명</h3>
                    </div>
                </div>
                <div class="header-associate-container">
                    <div class="header-container">
                        <h3>제작자</h3>
                    </div>
                </div>
                <div class="header-date-container">
                    <div class="header-container">
                        <h3>제작일자</h3>
                    </div>
                </div>
            </div>
            <div class="list-frame">
                <div class="table">
                    {#each result as item, index}
                        <ContentItemList item={item} on:click={passFocus} />
                    {/each}
                </div>
            </div>
        </div>
    {/if}
    {:catch error}
    <div class="fetch-fail-page">
        <div class="svg-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(226, 41, 41)" height="100" width="100">
                <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        </div>
        <h4>조회에 실패했습니다</h4>
        <h5>인터넷 연결을 확인해주세요</h5>
    </div>
    {/await}
    </Route>
    <Route path="/:form/:id">
        <ContentView file={focus} on:escape={undoFocus}/>
    </Route>
</div>
