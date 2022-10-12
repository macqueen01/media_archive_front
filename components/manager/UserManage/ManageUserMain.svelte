<script>
    import ManageSidebar from "../../manager/ManageSidebar.svelte";
    import BrowseAccountTitle from "../../../components/manager/UserManage/BrowseAccountTitle.svelte";
    import AccountListContainer from "../../../pages/content_container/AccountListContainer.svelte";
    import BrowseNavbar from "../../../pages/sidebar/BrowseNavbar.svelte";
    import UserInfo from "../../user/UserInfo.svelte";
    import NotReadyView from "../../../pages/DevViews/NotReadyView.svelte";

    import { meta, Route } from "tinro";
    import { fly, fade } from 'svelte/transition';

    let keywords = ['#사용자_전체'];

    let categories = [
        {
            name: "회원관리",
            sub_category: [
                {
                    name: "회원 조회",
                    path: "/manage/accounts/browse",
                },
                {
                    name: "회원 생성",
                    path: "/manage/accounts/create",
                },
            ],
        },
        {
            name: "소속관리",
            sub_category: [
                {
                    name: "소속 조회",
                    path: "/manage/accounts/affiliations",
                },
                {
                    name: "소속 생성",
                    path: "/user/accounts/affiliations/revise",
                },
            ],
        },
    ];

    let selected_index = null;

    let page = 1;
    let stage = 1;
    let focus = false;
    let view = "box";

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

    function keywordSet(e) {
        keywords = e.detail.keywords;
    }
</script>

<Route path="/*">

    <div class="sidebar-wrap" in:fly={{duration: 200, x: -400, y: 0}} out:fade={{duration: 10}}>
        <ManageSidebar categories={categories} />
    </div>

    <div class="manage-content-main">
        <div class="browse-content-wrap">
            <Route path="/" redirect="/manage/accounts/browse" />

            <Route path="/browse/*">
                <BrowseAccountTitle {keywords} on:keyword={keywordSet}/>
                <AccountListContainer
                    {page}
                    on:pageChange={pageHandle}
                    on:focus={focusHandle}
                    {keywords}
                />
                <div class="bottom-bar">
                    <BrowseNavbar {page} on:pageChange={pageHandle} {focus} />
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
</style>
