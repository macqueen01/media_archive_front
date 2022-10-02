<style>
    .manage-sidebar-wrap {
        width: 300px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgb(31, 32, 88);
        z-index: 4;
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

    @media (max-width: 1625px){
        .user-info-wrap {
            visibility: hidden;
            position: absolute;
            top: 160px;
            right: 60px;
            width: 200px;
            padding: 10px;
        }
    }

    @media (min-width: 1625px) {
        .user-info-wrap {
            visibility:visible;
            position: absolute;
            top: 160px;
            right: 60px;
            width: 200px;
            padding: 10px;
        }
    }




</style>

<script>
    import ContentContainer from "../content_container/ContentContainer.svelte";
    import ManageCreateContainer from '../content_container/ManageCreateContainer.svelte';

    import BrowseNavbar from '../sidebar/BrowseNavbar.svelte';
    import ManageCreateNavbar from '../sidebar/ManageCreateNavbar.svelte';

    import ManageSidebar from '../../components/manager/ManageSidebar.svelte';
    import BrowseTitle from '../../components/manager/BrowseTitle.svelte';
    import ManageCreateTitle from '../../components/manager/ManageCreateTitle.svelte';
    import UserInfo from "../../components/user/UserInfo.svelte";

    import { meta, Route } from 'tinro';
    
    let categories = [
        "기록물",
        "통계",
        "홈페이지로 가기"
    ]
    
    let selected_index = null;

    let page = 1;
    let stage = 1;
    let focus = false;
    let subtitle = '';
    
    function categorySelect(e) {
        selected_index = e.detail.index;
    }

    function stageHandle(e) {
        stage = e.detail.stage;
    }

    function pageHandle(e) {
        page = e.detail.page
    }

    function focusHandle(e) {
        focus = e.detail.focus
    }

    function titleChange(stage) {
        if (stage == 1) {
            return '메타데이터 등록'
        } else if (stage == 2) {
            return '기록물 파일 등록'
        } else if (stage == 3) {
            return '내용 등록'
        } else if (stage == 4) {
            return '미리보기'
        }
        return '허가되지 않은 창'
    }

    $: {
        subtitle = titleChange(stage);
    }
</script>

<Route path="/*">
    <div class="manage-sidebar-wrap">
        <ManageSidebar />
    </div>
    <div class="manage-content-main">
        <div class="browse-content-wrap">

            <Route path="/" redirect="/manage/cases/browse"></Route>

            <Route path="/browse/*">
                <BrowseTitle />
                <ContentContainer page={page} on:pageChange={pageHandle} on:focus={focusHandle}/>
                <div class="bottom-bar">
                    <BrowseNavbar page={page} on:pageChange={pageHandle} focus={focus}/>
                </div>
            </Route>

            <Route path="/create">
                <ManageCreateTitle subtitle={subtitle}/>
                <ManageCreateContainer stage={stage} />
                <div class="bottom-bar">
                    <ManageCreateNavbar stage={stage} on:stageChange={stageHandle}/>
                </div>
            </Route>

        </div>
    </div>
    <div class="user-info-wrap">
        <UserInfo />
    </div>
</Route>