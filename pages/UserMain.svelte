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

    .info-wrap {
        position: absolute;
        width: 100%;
        height: 190px;
        background-color: white;
        bottom: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info-container {
        width: 1445px;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .background-img {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .bg {
        bottom: 30px;
        position: absolute;
    }

    
    .info-item {
        width: 200px;
        height: 80px;
        position: relative;
        padding: 10px;
        padding: 10px;
    }
    
    .info-title {
        position: absolute;
        height: fit-content;
        width: fit-content;
    }
    
    .statistics {
        width: 90px;
        height: 90px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
    
    .number-container {
        position: relative;
        width: 55px;
        height: 80px;
        bottom: 0;
        
    }
    
    .number {
        position: absolute;
        bottom: -4px;
        right: 5px;
        font-family: "goth";
        font-size: 55px;
        color: #011284;
    }
    
    .count {
        position: absolute;
        bottom: 9px;
        right: 10px;
        font-family: "goth";
    }

    .all {
        font-family: 'goth';
        font-size: 20px;
        color: #151d55;;
    }

    .wall {
        height: 35px;
        border-right: solid 2px #6770ad;
    }

    .wheel-wrap {
        width: 30px;
        height: fit-content;
        display: flex;
        z-index: 2;
        position: absolute;
        right: 20px;
        bottom: 290px;
    }

    .wheel-container {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .wheel {
        width: 13px;
        height: 13px;
        background: white;
        margin-bottom: 20px;
        border-radius: 15px;
    }







    
    
    
    
</style>

<script>
    import UserSearch from '../components/user/UserSearch.svelte';

    let image_src_lst = [
        "/public/1.jpg",
        "/public/2.jpg",
        "/public/3.jpg",
        "/public/4.JPG",
        "/public/5.jpg"
    ];
    let height;
    let width;
    let fit_width = true;
    let viewport;
    let background;
    // curr is the index of image_src_lst
    let curr = 0;

    $: {
        if (viewport && background) {
            if ((width / height) >= (background.offsetWidth / background.offsetHeight)) {
                fit_width = true;
            } else {
                fit_width = false;
            }
        }
    }

    
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="main-view-home" bind:this={viewport}>
    <div class="background-img">
        {#if fit_width}
            <img class="bg" src={image_src_lst[curr]} width="100%" bind:this={background}/>
        {:else}
            <img class="bg" src={image_src_lst[curr]} height="100%" bind:this={background}/>
        {/if}
        <div class="wheel-wrap">
            <div class="wheel-container">
                {#each image_src_lst as img, index}
                    <div class="wheel"></div>
                {/each}
            </div>
        </div>
    </div>
    <div class="user-panel-wrap">
        <div class="user-panel">
            <a href="/manage" class="manage-nav">
                <h3>관리자</h3>
            </a>
            <a href="/auth/login" class="login-nav">
                <h3>로그인</h3>
            </a>
        </div>
    </div>
    <div class="search-wrap">
        <UserSearch />
    </div>
    <div class="info-wrap">
        <div class="info-container">
            <div class="info-item">
                <div class="info-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="32px" width="32px" fill="none">
                          <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>
                <div class="statistics">
                    <div class="number-container">
                        <h3 class="number">
                            3
                        </h3>
                    </div>
                    <h3 class="count">개</h3>
                </div>
            </div>

            <div class="wall"></div>
            
            <div class="info-item">
                <div class="info-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="32px" width="32px" fill="none">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <div class="statistics">
                    <div class="number-container">
                        <h3 class="number">
                            3
                        </h3>
                    </div>
                    <h3 class="count">개</h3>
                </div>
            </div>

            <div class="wall"></div>
            
            <div class="info-item">
                <div class="info-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="32px" width="32px" fill="none">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <div class="statistics">
                    <div class="number-container">
                        <h3 class="number">
                            3
                        </h3>
                    </div>
                    <h3 class="count">개</h3>
                </div>
            </div>

            <div class="wall"></div>

            <div class="info-item">
                <div class="info-title">
                    <h3 class="all">총</h3>
                </div>
                <div class="statistics">
                    <div class="number-container">
                        <h3 class="number">
                            3
                        </h3>
                    </div>
                    <h3 class="count">개</h3>
                </div>
            </div>
        </div>
    </div>
</div>
