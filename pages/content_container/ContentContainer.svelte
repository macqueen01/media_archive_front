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

</style>

<script>
    import { Route, meta, router } from 'tinro';
    import { draw, fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    import ContentItem from "./ContentItem.svelte";
    import ContentView from "./ContentView.svelte";


    /* Page starts from 1.
       Each page contains maximum 12 number of items.
       When clicked, the item is focused and container displays
       FOCUS container which shows a detailed view of selected item.
       
       ContentContainer, when first mounted, fetches twelve or less number of items.
       It then is triggered to fetch twelve more and save them in FETCHED_ITEMS when GO-FORTH button
       in "../sidebar/BrowseNavbar.svelte" is clicked.
    */

    export let page = 1;

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

    for (let i = 0; i < 40; i++) {
        fetched_items = [...fetched_items, 
        {
            type: 'photos',
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
    <Route path="/:_id">
        <ContentView file={focus} on:escape={undoFocus}/>
    </Route>
    <div class="browse-contents-list-view">
        {#each curr_page_items as item, index}
            <ContentItem item={item} on:click={passFocus} />
        {/each}
    </div>
</div>
