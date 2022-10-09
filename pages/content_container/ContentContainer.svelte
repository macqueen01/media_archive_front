<style>
    .browse-content-container {
        width: 960px;
        height: 550px;
        background-color: whitesmoke;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: inset 3px 3px 6px 0 rgb(197 197 197 / 50%);        
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

</style>

<script>
    import { Route, meta, router } from 'tinro';
    import { draw, fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    import ContentItem from "./ContentItem.svelte";
    import ContentView from "./ContentView.svelte";
    import ContentItemList from './ContentItemList.svelte';


    /* Page starts from 1.
       Each page contains maximum 12 number of items.
       When clicked, the item is focused and container displays
       FOCUS container which shows a detailed view of selected item.
       
       ContentContainer, when first mounted, fetches twelve or less number of items.
       It then is triggered to fetch twelve more and save them in FETCHED_ITEMS when GO-FORTH button
       in "../sidebar/BrowseNavbar.svelte" is clicked.
    */

    export let page = 1;
    export let view = 'box';

    var dispatch = createEventDispatcher();

    let focus = null;
    
    let fetched_items = [];


    $: curr_page_items = fetched_items.slice((page - 1) * 12, page * 12);


    function passFocus(e) {
        focus = e.detail.item;
        dispatch('focus', {
            focus: true
        })
        router.goto(`/manage/cases/browse/${focus._id}`)
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

    /* ITEM object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */

    for (let i = 0; i < 40; i++) {
        fetched_items = [...fetched_items, 
        {
            type: '사진',
            _id: i,
            uploader_id: 2,
            associate: "김재우",
            location: "학술정보원",
            collected: true,
            private: false,
            attendee: ["교장", "부교장", "대통령", "국방부장관", "생도"],
            created_at: "22년 2월 3일",
            title: "이인호 동상 앞에서",
            src: [
                "/public/main_page_bg.JPG",
                "/public/nama_logo.png",
                "/public/navy-logo.JPG"
            ],
            content: "<h4>This is sample content of the post.<h4>"
        }]
    }

    
</script>            
           

<div class="browse-content-container">
    {#if view == 'box'}
        <div class="browse-contents-list-view">
            {#each curr_page_items as item, index}
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
                    {#each curr_page_items as item, index}
                        <ContentItemList item={item} on:click={passFocus} />
                    {/each}
                </div>
            </div>
        </div>
    {/if}
    <Route path="/:_id">
        <ContentView file={focus} on:escape={undoFocus}/>
    </Route>
</div>
