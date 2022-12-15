<script>
    import ManageSidebar from "../../manager/ManageSidebar.svelte";
    import BrowseAccountTitle from "../ContentTitle/BrowseAccountTitle.svelte";
    import AccountListContainer from "../../../pages/content_container/AccountListContainer.svelte";
    import BrowseNavbar from "../../../pages/sidebar/BrowseNavbar.svelte";
    import UserInfo from "../../user/UserInfo.svelte";
    import NotReadyView from "../../../pages/DevViews/NotReadyView.svelte";
    import AccessControlView from "../../../pages/content_container/AccessControlView.svelte";
    import AccountCreateView from "../CreateViews/AccountCreateView.svelte";
    import AccessRequestCreateView from "../CreateViews/AccessRequestCreateView.svelte";

    import { meta, Route, router } from "tinro";
    import { fly, fade } from "svelte/transition";
    import { authenticateUserApi } from "../../../service/api";
    import { checkAuthority } from "../../../utilities/authorityLevel";
    import { token } from "../../../utilities/store";
    import { categoryFilter } from "../../../utilities/settings";

    let keywords = ["#사용자_전체"];

    let selected_index = null;

    let page = 1;
    let stage = 1;
    let focus = false;
    let view = "box";
    let authority = 0;

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

    async function authenticateUser() {
        try {
            let result = await authenticateUserApi($token);
            authority = checkAuthority(
                result.data.user.is_staff,
                result.data.user.is_active
            );
            return result.data;
        } catch (e) {
            router.goto("/auth/login");
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
            <ManageSidebar categories={categoryFilter(1, authority)} />
        </div>

        <div class="manage-content-main">
            <div class="browse-content-wrap">
                {#if authority == 2}
                    <Route path="/" redirect="/manage/accounts/browse" />
                {:else}
                    <Route path="/" redirect="/manage/accounts/request" />
                {/if}

                <Route path="/browse/*">
                    <BrowseAccountTitle on:keyword={keywordSet} />
                    <AccountListContainer
                        {page}
                        on:pageChange={pageHandle}
                        on:focus={focusHandle}
                        {keywords}
                    />
                    <div class="bottom-bar">
                        <BrowseNavbar
                            {page}
                            on:pageChange={pageHandle}
                            {focus}
                        />
                    </div>
                </Route>

                <Route path="/access-control/*">
                    <AccessControlView />
                </Route>

                <Route path="/create/*">
                    <AccountCreateView />
                </Route>

                <Route path="/request/*">
                    <AccessRequestCreateView />
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
</style>
