<style>

    @charset "utf-8";

    /* Font */
    @font-face{
        font-family:NotoSansB;
        src:url('/fonts/NotoSansKR-Bold.woff') format('woff');
    }

    @font-face{
        font-family:NotoSansM;
        src:url('/fonts/NotoSansCJKkr-Medium.woff') format('woff');
    }

    @font-face{
        font-family:NotoSansDL;
        src:url('/fonts/NotoSansKR-DemiLight.woff') format('woff');
    }

    @font-face{
        font-family:NotoSans;
        src:url('/fonts/NotoSansCJKkr-Regular.woff') format('woff');
    }

    @font-face{
        font-family:Roboto;
        src:url('/fonts/Roboto-Regular.woff') format('woff');
    }

    @font-face{
        font-family:RobotoM;
        src:url('/fonts/Roboto-Medium.woff') format('woff');
    }

    @font-face{
        font-family:RobotoB;
        src:url('/fonts/Roboto-Bold.woff') format('woff');
    }

    @font-face{
        font-family:PretendardSB;
        src:url('/fonts/Pretendard-SemiBold.woff') format('woff');
    }

    @font-face{
        font-family:rokafM;
        src:url('/fonts/ROKAF_Medium.woff') format('woff');
    }

    .main-view-home {
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
        bottom: 100px;
    }

    .user-panel-wrap {
        position: absolute;
        width: 100%;
        height: 50px;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 100px;
        background: linear-gradient( rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgb(0 0 0 / 28%) 0%, rgb(255 255 255 / 0%) 100%);
    }

    .user-panel {
        height: 100%;
        width: 130px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-right: 15px;
    }

    a {
        width: 60px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    a > h3 {
        font-family: NotoSans;
        font-size: 13px;
        color: rgb(231, 231, 231);
    }



    
    
    
    
</style>

<script>
    import UserSearch from '../components/user/UserSearch.svelte';
</script>

<div class="main-view-home">
    <div class="user-panel-wrap">
        <div class="user-panel">
            <a href="/manage" class="manage-nav">
                <h3>관리자</h3>
            </a>
            <a href="/login" class="login-nav">
                <h3>로그인</h3>
            </a>
        </div>
    </div>
    <div class="search-wrap">
        <UserSearch />
    </div>
</div>
