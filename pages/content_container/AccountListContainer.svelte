<script>
    import { Route, meta, router } from "tinro";
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

    var dispatch = createEventDispatcher();

    let focus = null;

    let fetched_items = [];

    $: curr_page_items = fetched_items.slice((page - 1) * 12, page * 12);

    function passFocus(e) {
        focus = e.detail.item;
        dispatch("focus", {
            focus: true,
        });
        router.goto(`/manage/account/browse/${focus._id}`);
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
            <div class="table">
                {#each curr_page_items as item, index}
                    <UserListItem {item} on:click={passFocus} />
                {/each}
            </div>
        </div>
    </div>
    <Route path="/:_id">
        <AccountView file={focus} on:escape={undoFocus} />
    </Route>
</div>

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
</style>
