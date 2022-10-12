<script>
    import ContentContainer from "../content_container/ContentContainer.svelte";
    import BrowseNavbar from "../sidebar/BrowseNavbar.svelte";
    import ManageSidebar from "../../components/manager/ManageSidebar.svelte";
    import BrowseTitle from "../../components/manager/BrowseTitle.svelte";
    import ManageCreateView from "../../components/manager/CreateViews/ManageCreateView.svelte";
    import UserInfo from "../../components/user/UserInfo.svelte";
    import NotReadyView from "../DevViews/NotReadyView.svelte";

    import { meta, Route } from "tinro";
    import { fly, fade } from 'svelte/transition';

    let selected_index = null;

    let page = 1;
    let stage = 1;
    let focus = false;
    let view = "box";

    let categories = [
        {
            name: "기록물 관리",
            sub_category: [
                {
                    name: "기록물 관리",
                    path: "/manage/cases/browse",
                },
                {
                    name: "기록물 생성",
                    path: "/manage/cases/create",
                },
            ],
        },
        {
            name: "홈페이지",
            sub_category: [
                {
                    name: "관리자 메인",
                    path: "/manage",
                },
                {
                    name: "유저 메인",
                    path: "/user",
                },
            ],
        },
        {
            name: "통계",
            sub_category: [
                {
                    name: "나의 통계",
                    path: "/manage/cases/stats/user",
                },
                {
                    name: "기록물 생성",
                    path: "/manage/cases/stats/",
                },
            ],
        },
    ];

    function categorySelect(e) {
        selected_index = e.detail.index;
    }

    function pageHandle(e) {
        page = e.detail.page;
    }

    function focusHandle(e) {
        focus = e.detail.focus;
    }

    function viewHandle(e) {
        view = e.detail.view;
    }
</script>

<Route path="/*">
    <div class="sidebar-wrap" in:fly={{duration: 200, x: -400, y: 0}} out:fade={{duration: 10}}>
        <ManageSidebar categories={categories} />
    </div>
    <div class="manage-content-main">
        <div class="browse-content-wrap">
            <Route path="/" redirect="/manage/cases/browse" />

            <Route path="/browse/*">
                <BrowseTitle on:viewChange={viewHandle} />
                <ContentContainer
                    {page}
                    on:pageChange={pageHandle}
                    on:focus={focusHandle}
                    {view}
                />
                <div class="bottom-bar">
                    <BrowseNavbar {page} on:pageChange={pageHandle} {focus} />
                </div>
            </Route>

            <Route path="/create">
                <ManageCreateView />
            </Route>

            <Route path="/stats/*">
                <div class="stats-content-wrap">
                    <NotReadyView />
                </div>
            </Route>
        </div>
    </div>
    <div class="user-info-wrap" in:fly={{duration: 200, x: +400, y: 0}} out:fade={{duration: 10}}>
        <UserInfo />
    </div>
</Route>

<style>
    .stats-content-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manage-content-main {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow-y: auto;
    }

    .browse-content-wrap {
        width: fit-content;
        height: fit-content;
    }

    .bottom-bar {
        margin-top: 20px;
    }

    @media (max-width: 1555px) {
        :global(.sidebar-wrap) {
            visibility: hidden;
            width: 300px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgb(31, 32, 88);
            z-index: 4;
        }
    }

    @media (min-width: 1555px) {
        :global(.sidebar-wrap) {
            visibility: visible;
            width: 300px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgb(31, 32, 88);
            z-index: 4;
        }
    }

    @media (max-width: 1625px) {
        :global(.user-info-wrap) {
            visibility: hidden;
            position: absolute;
            top: 160px;
            right: 60px;
            width: 200px;
            padding: 10px;
        }
    }

    @media (min-width: 1625px) {
        :global(.user-info-wrap) {
            visibility: visible;
            position: absolute;
            top: 160px;
            right: 60px;
            width: 200px;
            padding: 10px;
        }
    }
</style>
