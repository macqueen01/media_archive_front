<style>
    .manage-main-view {
        background-image: url("main_page_bg.JPG");
        background-size: cover;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    

    .search-wrap {
        position: relative;
        bottom: 40px;
    }

    .recent-works-bend {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 150px;
        width: 100%;
        height: 215px;
        background-color: rgba(206, 206, 206, 0.349);
        flex-direction: row;
    }

    .recent-works-label {
        width: 300px;
        height: 70px;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
    }

    .recent-works-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 1000px;
        height: fit-content;
        position: relative;
        align-items: center;
    }

    .user-name-wrap {
        display: flex;
        flex-direction: row;
        justify-content: start;
        width: 100%;
        height: fit-content;
        align-items: flex-end;
        padding: 5px;
    }

    .user-name-wrap > h1 {
        font-family: 'goth';
        font-size: 23px;
        color: #011284;
    }

    .user-name-wrap > h3 {
        font-family: 'goth';
        font-size: 18px;
        color: #1f1f1f;
    }

    .paragraph-wrap > h3 {
        width: 150px;
        font-family: 'goth';
        font-size: 18px;
        color: #1f1f1f;
    }

    .paragraph-wrap {
        padding: 5px;
        width: 100%;
        height: fit-content;
        align-items: baseline;
        display: flex;
        flex-direction: row;
        justify-content: start;
    }

    .go-back-wrap {
        height: 40px;
        width: 40px;
        display: flex;
        padding: 10px;
        justify-content: center;
        align-items: center;
    }

    .go-back-placeholder {
        width: 40px;
        height: 40px;
        padding: 10px;
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
        padding: 10px;
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

    
</style>

<script>
    import { Route, router, meta } from 'tinro';
    import Search from '../components/Search.svelte';
    import ContentItem from "./content_container/ContentItem.svelte";

    import axios from 'axios';


    let fetched_items = [];
    let page = 1;
    $: curr_page_items = fetched_items.slice((page - 1) * 3, page * 3);
    $: console.log(page, curr_page_items)


    function pageIncrease() {
        page += 1;
    }

    function pageDecrease() {
        if (page != 1) {
            page -= 1;
        }
    }

    function passFocus(item) {
        router.goto(`/browse/${item._id}`)
    }

    let user = {
        name: "김재우",
    }

    for (let i = 0; i < 14; i++) {
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

<div class="manage-main-view">
    <div class="search-wrap">
        <Search />
    </div>
    <div class="recent-works-bend">
        <div class="recent-works-label">
            <div class="user-name-wrap">
                <h1>{user.name}</h1>
                <h3>의</h3>
            </div>
            <div class="paragraph-wrap">
                <h3>최근 작업한 기록물</h3>
            </div>
        </div>
        <div class="recent-works-wrap">
            {#if page != 1}
                <div class="go-back-wrap">
                    <button class="go-back" on:click={pageDecrease}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="left-svg" width="19" height="19">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>
            {:else}
                <div class="go-back-placeholder">
                </div>
            {/if}

            {#each curr_page_items as item, index}
                    <ContentItem item={item} on:click={() => passFocus(item)}/>
            {:else}
                <h4>아직 작업한 기록물이 없습니다.</h4>
            {/each}

            {#if page < fetched_items.length / 3 }
                <div class="go-forth-wrap">
                    <button class="go-forth" on:click={pageIncrease}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="right-svg" width="19" height="19">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>