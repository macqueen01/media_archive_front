<script>
    import ContentContainer from "../content_container/ContentContainer.svelte";
    import BrowseNavbar from "../sidebar/BrowseNavbar.svelte";
    import ManageSidebar from "../../components/manager/ManageSidebar.svelte";
    import BrowseTitle from "../../components/manager/ContentTitle/BrowseTitle.svelte";
    import ManageCreateView from "../../components/manager/CreateViews/ManageCreateView.svelte";
    import UserInfo from "../../components/user/UserInfo.svelte";
    import NotReadyView from "../DevViews/NotReadyView.svelte";

    import { meta, Route, router } from "tinro";
    import { fly, fade } from "svelte/transition";
    import { address } from "../../utilities/settings";
    import { token } from "../../utilities/store";
    import axios from "axios";
    import { Circle } from "svelte-loading-spinners";
    import { checkAuthority } from "../../utilities/authorityLevel";
    import { authenticateUserApi } from "../../service/api";
    import { categoryFilter } from "../../utilities/settings";

    let selected_index = null;

    let page = 1;
    let form = 0;
    let focus = false;
    let view = "box";
    let authority = 0;
    let categories = [];

    async function authenticateUser() {
        try {
            let result = await authenticateUserApi($token)
            authority = checkAuthority(
                result.data.user.is_staff,
                result.data.user.is_active
            );
            return result.data;
        } catch (e) {
            router.goto("/auth/login");
        }
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

    function formHandle(e) {
        if (form != e.detail.form) {
            form = e.detail.form;
            page = 1;
        }
    }
</script>

<Route path="/*">
    {#await authenticateUser() then result}
        <div
            class="sidebar-wrap"
            in:fly={{ duration: 200, x: -400, y: 0 }}
            out:fade={{ duration: 10 }}
        >
            <ManageSidebar categories = {categoryFilter(0, authority)}/>
        </div>
        <div class="manage-content-main">
            <div class="browse-content-wrap">
                <Route path="/" redirect="/manage/cases/browse" />

                <Route path="/browse/*">
                    <BrowseTitle
                        on:viewChange={viewHandle}
                        on:formChange={formHandle}
                        {form}
                        {view}
                    />
                    <ContentContainer
                        {page}
                        on:pageChange={pageHandle}
                        on:focus={focusHandle}
                        {view}
                        type={form}
                    />
                    <div class="bottom-bar">
                        <BrowseNavbar
                            {page}
                            on:pageChange={pageHandle}
                            {focus}
                        />
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
        <div
            class="user-info-wrap"
            in:fly={{ duration: 200, x: +400, y: 0 }}
            out:fade={{ duration: 10 }}
        >
            <UserInfo />
        </div>
    {/await}
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
