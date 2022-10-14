<script>
    import { Route, meta, router } from "tinro";
    import axios from 'axios';
    import { draw, fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    import UserListItem from "../../components/manager/UserManage/UserListItem.svelte";
    import AccountView from "./AccountView.svelte";

    /* Page starts from 1.
       Each page contains maximum 12 number of items.
       When clicked, the item is focused and container displays
       FOCUS container which shows a detailed view of selected item.
       
       ContentContainer, when first mounted, fetches twelve or less number of items.
       It then is triggered to fetch twelve more and save them in FETCHED_ITEMS when GO-FORTH button
       in "../sidebar/BrowseNavbar.svelte" is clicked.
    */

    export let page = 1;
    export let keywords;

    let debug = true;

    var dispatch = createEventDispatcher();

    let focus = null;
    let fetching = false;
    let error = null;

    let fetched_items = [];
    let curr_page_items;

    $: {
        try {
            curr_page_items = fetched_items.slice((page - 1) * 12, page * 12);
        } catch (e) {
            curr_page_items = null;
        }
    }

    async function getUserFromKeywords(keywords) {
        if (!fetching) {
            fetched_items = [];
            error = null;
            fetching = true;
            try {
                fetched_items = await axios.get('http://localhost:4000');
                fetching = false;
            } catch (e) {
                error = 1;
                fetching = false;
            }
        }

        console.log('fetch')
    }

    function passFocus(e) {
        focus = e.detail.item;
        dispatch("focus", {
            focus: true,
        });
        router.goto(`/manage/accounts/browse/${focus._id}`);
    }

    function undoFocus() {
        focus = null;
        dispatch("focus", {
            focus: false,
        });
    }

    /* Test variables to be fetched from server when online */

    /* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */
    let user = {
        authority: true,
        name: "Kim",
    };

    /* ITEM object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */

    for (let i = 0; i < 40; i++) {
        fetched_items = [
            ...fetched_items,
            {
                _id: i,
                name: "김재우",
                authority: "관리자",
                standing: "상병",
                position: "전산병",
                affiliation: "학술정보원 멀티미디어교실",
                created_at: "22년 2월 3일",
            },
        ];
    }

    $: {
        getUserFromKeywords(keywords);
    }


</script>

<div class="browse-content-container">
    <div class="upload-view">
        <div class="table-header">
            <div class="header-id-container">
                <div class="header-container">
                    <h3>ID</h3>
                </div>
            </div>
            <div class="header-authority-container">
                <div class="header-container">
                    <h3>권한</h3>
                </div>
            </div>
            <div class="header-name-container">
                <div class="header-container">
                    <h3>실명</h3>
                </div>
            </div>
            <div class="header-standing-container">
                <div class="header-container">
                    <h3>계급</h3>
                </div>
            </div>
            <div class="header-date-container">
                <div class="header-container">
                    <h3>가입일</h3>
                </div>
            </div>
            <div class="header-affiliation-container">
                <div class="header-container">
                    <h3>소속</h3>
                </div>
            </div>
            <div class="header-position-container">
                <div class="header-container">
                    <h3>직책</h3>
                </div>
            </div>
        </div>
        <div class="list-frame">
            {#if debug == true}
                <div class="table">
                    {#each curr_page_items as item, index}
                        <UserListItem {item} on:click={passFocus} />
                    {/each}
                </div>
            {:else}
                {#if fetching}
                    <div class="user-fetch-spinner-page">
                        <div class="svg-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(31, 32, 88)" height="100" width="100">
                                <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
                            </svg>
                        </div>
                        <h4>정보를 받아오고 있습니다</h4>
                    </div>
                {:else if !error && !fetching}
                    <div class="table">
                        {#each curr_page_items as item, index}
                            <UserListItem {item} on:click={passFocus} />
                        {/each}
                    </div>
                {:else if !fetching && error == 1}
                    <div class="user-fetch-error-page">
                        <div class="svg-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(226, 41, 41)" height="100" width="100">
                                <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h4>연결이 끊겼습니다</h4>
                        <h5>다시 한번 시도해보세요</h5>
                    </div>
                {/if}
            {/if}

        </div>
    </div>
    <Route path="/:_id">
        <AccountView user={focus} on:escape={undoFocus} />
    </Route>
</div>

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
        grid-template-columns: 1fr 3fr 3fr 3fr 5fr 5fr 3fr;
        z-index: 4;
    }

    .header-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header-authority-container {
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

    .header-name-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 3 / 4;
    }

    .header-standing-container {
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

    .header-affiliation-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 6 / 7;
    }

    .header-position-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 7 / 8;
    }

    .header-container > h3 {
        font-family: "goth";
        font-size: 14px;
        color: #1e1c3b;
    }

    .user-fetch-error-page, .user-fetch-spinner-page {
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .user-fetch-error-page > h4, .user-fetch-spinner-page > h4 {
        font-family: 'goth';
        font-size: 30px;
        width: 400px;
        color: rgb(31, 32, 88);
        text-align: center;
    }

    .user-fetch-error-page > h5 {
        font-family: 'goth';
        font-size: 25px;
        width: 500px;
        color: rgb(106 107 163);
        text-align: center;
    }
</style>
