<script>
  import CaseCountBar from './sidebar/CaseCountBar.svelte';

    import UserSearch from "../components/user/UserSearch.svelte";
    import { fade, scale, fly } from "svelte/transition";


    let image_src_lst = [
        // add more images in the following format
        {img: "/public/5.jpg", title: "벛꽃 핀 생도대", detail: "해사 전경"},
        {img: "/public/6.jpg", title: "새병관에서 본 옥포만 노을", detail: "해사 전경"},
        {img: "/public/2.jpg", title: "사관생도들의 벛꽃길 학과 출장", detail: "해사 전경"},
        {img: "/public/8.jpg", title: "옥포만 갯바위와 해무", detail: "해사 전경"},
        {img: "/public/10.JPG", title: "해사 반도와 저녁 노을", detail: "해사 전경"},
        {img: "/public/11.jpg", title: "백두산함 마스트와 북극성", detail: "해사 전경"},
        {img: "/public/main_page_bg.JPG", title: "해사 인의 표상 이인호 소령상", detail: "해사 전경"},
    ];
    let height;
    let width;
    let fit_width = true;
    let viewport;
    // curr is the index of image_src_lst
    let curr = 0;

    function bgChangeCall(index) {
        if (index < image_src_lst.length && 0 <= index) {
            curr = index;
        }
    }

    $: {
        if (viewport && height && width) {
            if (width / height >= 1.5) {
                fit_width = true;
            } else {
                console.log("fit-height");
                fit_width = false;
            }
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    setInterval(() => {
        // calls random index in image_src_lst and displays on screen
        curr = getRandomInt(0, image_src_lst.length);
    }, 5000);

</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="main-view-home" bind:this={viewport} out:fade>
    <div class="logo-main">
        <img class="logo" src="/public/main_header_logo.png" alt="Media Archive" height="48" />
    </div>
    <div class="background-img">
        {#if fit_width}
            {#key curr}
                <img transition:fade class="bg" src={image_src_lst[curr].img} width="100%" />
            {/key}
        {:else}
            {#key curr}
                <img transition:fade class="bg" src={image_src_lst[curr].img} height="100%" />
            {/key}
        {/if}
        <div class="wheel-wrap">
            <div class="wheel-container">
                {#each image_src_lst as img, index}
                    {#if curr == index}
                        <div class="wheel-selected" />
                    {:else}
                        <div
                            class="wheel"
                            on:click={() => bgChangeCall(index)}
                        />
                    {/if}
                {/each}
            </div>
        </div>
        <div class="description-wrap">
            <div class="photo-title-container">
                <h3 class="photo-title">{image_src_lst[curr].title}</h3>
            </div>
            <div class="photo-detail-container">
                <h3 class="photo-detail">{image_src_lst[curr].detail}</h3>
            </div>
        </div>
    </div>
    <div class="user-panel-wrap">
        <div class="user-panel">
            <a href="/manage/cases" class="manage-nav">
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
    <CaseCountBar />
</div>

<style>
    @charset "utf-8";

    /* Font */
    @font-face {
        font-family: NotoSansB;
        src: url("/fonts/NotoSansKR-Bold.woff") format("woff");
    }

    @font-face {
        font-family: NotoSansM;
        src: url("/fonts/NotoSansCJKkr-Medium.woff") format("woff");
    }

    @font-face {
        font-family: NotoSansDL;
        src: url("/fonts/NotoSansKR-DemiLight.woff") format("woff");
    }

    @font-face {
        font-family: NotoSans;
        src: url("/fonts/NotoSansCJKkr-Regular.woff") format("woff");
    }

    @font-face {
        font-family: Roboto;
        src: url("/fonts/Roboto-Regular.woff") format("woff");
    }

    @font-face {
        font-family: RobotoM;
        src: url("/fonts/Roboto-Medium.woff") format("woff");
    }

    @font-face {
        font-family: RobotoB;
        src: url("/fonts/Roboto-Bold.woff") format("woff");
    }

    @font-face {
        font-family: PretendardSB;
        src: url("/fonts/Pretendard-SemiBold.woff") format("woff");
    }

    @font-face {
        font-family: rokafM;
        src: url("/fonts/ROKAF_Medium.woff") format("woff");
    }


    .logo-main {
        width: fit-content;
        height: fit-content;
        position: absolute;
        left: 40px;
        top: 22px;
        z-index:5;
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
        bottom: 200px;
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
        background: linear-gradient(
            rgba(2, 0, 36, 1) 0%,
            rgba(9, 9, 121, 1) 0%,
            rgb(0 0 0 / 28%) 0%,
            rgb(255 255 255 / 0%) 100%
        );
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
        min-width: 237px;
        width: fit-content;
        height: 80px;
        position: relative;
        padding: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .info-title {
        position: relative;
        height: fit-content;
        width: fit-content;
        min-width: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 8px;
        padding-right: 57px;
    }

    .statistics {
        width: fit-content;
        height: 90px;
        position: relative;
        right: 0;
        bottom: 0;
    }

    .number-container {
        position: relative;
        width: fit-content;
        height: 80px;
        bottom: 0;
        display: flex;
    }

    .number {
        position: relative;
        bottom: -4px;
        right: 5px;
        font-family: "goth";
        font-size: 55px;
        color: #011284;
    }

    .count {
        position: relative;
        top: 40px;
        font-family: "goth";
        height: fit-content;
    }

    .all {
        font-family: "goth";
        font-size: 20px;
        color: #293062;
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

    .wheel,
    .wheel-selected {
        width: 13px;
        height: 13px;
        background: rgba(255, 255, 255, 0.656);
        margin-bottom: 20px;
        border-radius: 15px;
    }

    .wheel-selected {
        background: white;
        animation-duration: 0.7s;
        animation-name: focus;
    }

    @keyframes focus {
        from {
            background: rgba(255, 255, 255, 0.656);
        }
        to {
            background: white;
        }
    }

    .description-wrap {
        z-index: 2;
        position: absolute;
        right: 70px;
        bottom: 265px;
        display: flex;
        flex-direction:  column;
        min-width: fit-content;
        height: fit-content;
    }

    h3.photo-title {
        font-family: 'goth';
        font-size: 28px;
        color: white;
    }

    h3.photo-detail {
        font-family: 'goth';
        font-size: 20px;
        color: #ffffffd9;
    }

    .photo-detail-container {
        display: flex;
        justify-content: flex-end;
    }

</style>
