<script>
    import { Route, meta, router } from "tinro";
    import axios from "axios";
    import { draw, fade } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";
    import { token, wishList } from "../../utilities/store";
    import { Circle } from "svelte-loading-spinners";
    import { address } from "../../utilities/settings";

    /* 
        FILE inherits FOCUS obj from ContentContainer.
    */

    export let file;

    const route = meta();

    let file_id = route.params.id;
    let file_form = route.params.form;
    let media_hover = false;
    let curr;
    let status = 0;
    let fetched;
    let icon_focus;
    let wishlist_added = false;
    let wishlist_rejected = false;

    var dispatch = createEventDispatcher();

    function hoverHandle() {
        media_hover = true;
        setTimeout(() => {
            if (media_hover) {
                media_hover = false;
            }
        }, 4000);
    }

    function undoFocus() {
        dispatch("escape", {
            focus: null,
        });
        router.goto("/manage/cases");
    }

    /* copies file.src into fileLst */

    function getMediaFromFront() {
        if (fetched) {
            let result = fetched.data.include.shift();
            fetched.data.include = [...fetched.data.include, result];
            return result;
        } else {
            console.log("No file object detected");
        }
    }

    function getMediaFromBack() {
        if (fetched) {
            let result = fetched.data.include.pop();
            fetched.data.include = [result, ...fetched.data.include];
            return result;
        } else {
            console.log("No file object detected");
        }
    }

    function NavigateBack() {
        curr = getMediaFromBack();
    }

    function NavigateForth() {
        curr = getMediaFromFront();
    }

    async function getDataFromId(id, form) {
        console.log(id, form);
        fetched = await axios({
            url: `http://${address}/drf/cases/browse/detail?form=${form}&id=${id}`,
            method: "get",
            headers: {
                Authorization: `Token ${$token}`,
            },
        });
        curr = getMediaFromFront();
        return fetched.data;
    }

    function addToWishlist() {
        if (!$wishList[file_form].includes(file_id)) {
            wishList.update((wishList) => {
                wishList[file_form] = [...wishList[file_form], file_id];
                return wishList;
            });
            wishlist_added = true;
            console.log(true);
        }
        wishlist_rejected = true;
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

    let image;
    let video;
    let source;
    let name;

    $: {
        if (curr && image) {
            source = curr.url.split("/");
            name = source.pop();

            if (image.offsetHeight > image.offsetWidth) {
                image.height = 450;
            } else {
                image.width = 450;
            }
        }
    }

    $: {
        if (curr && video) {
            source = curr.url.split("/");
            name = source.pop();

            if (video.offsetHeight > video.offsetWidth) {
                vedio.height = 450;
            } else {
                video.width = 450;
            }
        }
    }
</script>

<div class="focus">
    <div class="header">
        <div class="back-btn-wrap">
            <button class="back-btn" on:click={undoFocus}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-6 h-6"
                    height="18"
                    width="18"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                    />
                </svg>
            </button>
        </div>
        {#await getDataFromId(file_id, file_form)}
            <div class="title-wrap">
                <h3>파일을 받아오는 중입니다</h3>
            </div>
        {:then result}
            <div class="title-wrap">
                <h3>
                    {result.title}
                </h3>
                <div class="approved-mark-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="rgb(99, 228, 99)"
                        height="18"
                        width="18"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>

            <div class="info-wrap">
                <div class="name-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        height="11"
                        width="11"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                    </svg>
                    <div class="space" />
                    <h3>{result.associate.title}</h3>
                </div>
                <div class="date-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        height="11"
                        width="11"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                    </svg>
                    <div class="space" />
                    <h3>{result.created_at.split("T")[0]}</h3>
                </div>
            </div>
        {:catch error}
            <div class="title-wrap">
                {#if error.response.status == 401}
                    <h3>기록물 접근 권한이 없습니다</h3>
                {:else}
                    <h3>다시 시도 바랍니다</h3>
                {/if}
                <div class="approved-mark-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="rgb(226, 41, 41)"
                        height="18"
                        width="18"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
            </div>
        {/await}

        <div class="icons-wrap">
            <div
                class={icon_focus == 0 ? "icon-focus" : "fix-wrap icon"}
                on:mouseenter={() => (icon_focus = 0)}
                on:mouseleave={() => (icon_focus = null)}
                on:click={addToWishlist}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke={icon_focus == 0 ? "white" : "currentColor"}
                    height="18"
                    width="18"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </div>
            <div
                class={icon_focus == 1 ? "icon-focus" : "bell-wrap icon"}
                on:mouseenter={() => (icon_focus = 1)}
                on:mouseleave={() => (icon_focus = null)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke={icon_focus == 1 ? "white" : "currentColor"}
                    height="18"
                    width="18"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                </svg>
            </div>
            <div
                class={icon_focus == 2 ? "icon-focus" : "download-wrap icon"}
                on:mouseenter={() => (icon_focus = 2)}
                on:mouseleave={() => (icon_focus = null)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke={icon_focus == 2 ? "white" : "currentColor"}
                    height="18"
                    width="18"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                </svg>
            </div>
        </div>
    </div>

    <div class="body">
        <div class="body-content-wrap">
            <!-- awaits until file is fetched from the server -->
            {#if fetched && fetched.data}
                <div class="media-wrap">
                    <div class="photo-container">
                        {#if media_hover}
                            <div class="facad">
                                <button
                                    class="left-arrow-wrap"
                                    on:click={NavigateBack}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="white"
                                        height="60"
                                        width="60"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15.75 19.5L8.25 12l7.5-7.5"
                                        />
                                    </svg>
                                </button>
                                <button
                                    class="right-arrow-wrap"
                                    on:click={NavigateForth}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="white"
                                        height="60"
                                        width="60"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        {/if}
                        {#if file_form == 1}
                            {#key curr.src}
                                <video
                                    controls
                                    bind:this={video}
                                    on:mouseover={hoverHandle}
                                >
                                    <source
                                        src="http://{address}{curr.url}"
                                        type="video/mp4"
                                    />
                                </video>
                            {/key}
                        {:else if file_form == 0}
                            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                            {#if curr}
                                <img
                                    src="http://{address}{curr.url}"
                                    alt="main_pg_bg"
                                    bind:this={image}
                                    on:mouseover={hoverHandle}
                                />
                            {/if}
                        {:else if file_form == 2}
                            <h1>아직 문서지원 준비중입니다</h1>
                        {/if}
                        {#if media_hover}
                            <div class="caption">
                                <h4>{name}</h4>
                            </div>
                        {:else}
                            <div class="caption-placeholder" />
                        {/if}
                    </div>
                </div>

                <div class="details-wrap">
                    <div class="info-header">
                        <h5>세부사항</h5>
                    </div>
                    <div class="detail-wrap-info">
                        <div class="location-wrap info-item">
                            <div class="label">
                                <h5>대표장소:</h5>
                            </div>
                            <div class="location info-item-content">
                                <h5>@{fetched.data.location.title}</h5>
                            </div>
                        </div>
                        <div class="assosiate-wrap info-item">
                            <div class="label">
                                <h5>촬영자:</h5>
                            </div>
                            <div class="associate info-item-content">
                                <h5>#{fetched.data.associate.title}</h5>
                            </div>
                        </div>
                        <div class="attendee-wrap info-item">
                            <div class="label">
                                <h5>주요참석자:</h5>
                            </div>
                            <div class="attendees info-item-content">
                                {#each fetched.data.attendee as attendee, index}
                                    <h5>#{attendee.title}</h5>
                                {:else}
                                    <h4>주요 참석자가 없습니다.</h4>
                                {/each}
                            </div>
                        </div>
                        <div class="collected-wrap info-item">
                            {#if !fetched.data.produced}
                                <h5>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="black"
                                        width="14"
                                        height="14"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                        />
                                    </svg>
                                    본 기록물은 수집되었습니다.
                                </h5>
                            {:else}
                                <h5>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="black"
                                        width="14"
                                        height="14"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                        />
                                    </svg>
                                    본 기록물은 생산되었습니다.
                                </h5>
                            {/if}
                        </div>
                        <div class="private-wrap info-item">
                            {#if fetched.data.private}
                                <h5>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="black"
                                        width="14"
                                        height="14"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                        />
                                    </svg>
                                    본 기록물은 또한 비공개 기록물입니다.
                                </h5>
                            {:else}
                                <h5>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="black"
                                        width="14"
                                        height="14"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                        />
                                    </svg>
                                    본 기록물은 또한 공개 기록물입니다.
                                </h5>
                            {/if}
                        </div>
                    </div>
                    <div class="content-header">
                        <h5>설명</h5>
                    </div>
                    <div
                        class="detail-wrap-content"
                        contenteditable="false"
                        bind:innerHTML={fetched.data.content}
                    />
                </div>
            {:else if status == 2}
                Error!
            {/if}
        </div>
    </div>
</div>

<style>
    .focus {
        width: 100%;
        height: 100%;
        z-index: 2;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .header {
        height: 55px;
        width: 100%;
        background: white;
        position: absolute;
        top: 0;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        z-index: 4;
    }

    .title-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .title-wrap > h3 {
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
        font-weight: 900;
    }

    .body {
        background-color: white;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 3;
    }

    .back-btn-wrap {
        height: 40px;
        width: 40px;
        position: absolute;
        left: 8px;
        bottom: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .back-btn {
        outline: none;
        background: none;
        border: none;
        height: fit-content;
        width: fit-content;
    }

    .approved-mark-wrap {
        position: relative;
        width: fit-content;
        height: fit-content;
        left: 6px;
        bottom: -2px;
    }

    .icons-wrap {
        display: flex;
        width: 145px;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        bottom: 0;
        right: 25px;
    }

    .icon {
        background: transparent;
        height: 30px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 30px;
        position: relative;
    }

    .icon-focus {
        background: rgb(137, 137, 213);
        height: 30px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 30px;
        position: relative;
        animation: icon-focus;
        animation-duration: 0.6s;
    }

    .info-wrap {
        position: absolute;
        width: 180px;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        bottom: 12px;
        left: 330px;
    }

    .name-wrap {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: 100%;
        margin-left: 10px;
    }

    .date-wrap {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: 100%;
    }

    .name-wrap > h3,
    .date-wrap > h3 {
        font-family: "goth";
        font-weight: 900;
        font-size: 11px;
    }

    .space {
        width: 7px;
        height: 100%;
    }

    .body-content-wrap {
        position: absolute;
        top: 55px;
        height: 495px;
        width: 100%;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
    }

    .media-wrap {
        height: 100%;
        width: 560px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
        overflow-y: hidden;
        flex-direction: column;
    }

    .details-wrap {
        height: 100%;
        width: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .photo-container {
        height: fit-content;
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .photo-container > h1,
    .photo-container > h2 {
        font-family: "goth";
    }

    .photo-container > h1 {
        font-size: 35px;
    }

    .photo-container > h2 {
        font-size: 20px;
    }

    .caption {
        display: flex;
        justify-content: end;
        align-items: center;
        background-color: rgba(12, 12, 12, 0.856);
        height: 25px;
        width: 100%;
        position: relative;
    }

    .caption > h4 {
        color: white;
        font-family: "goth";
        font-weight: 400;
        font-size: 12px;
        position: absolute;
        right: 13px;
    }

    .caption-placeholder {
        height: 25px;
        width: 100%;
    }

    .facad {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .left-arrow-wrap,
    .right-arrow-wrap {
        z-index: 10;
        border: none;
        outline: none;
        background: transparent;
    }

    .info-header,
    .content-header {
        padding-top: 25px;
    }

    .info-header > h5,
    .content-header > h5 {
        font-family: "goth";
        font-size: 18px;
    }

    .info-item {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: fit-content;
        padding: 2px;
        font-family: "goth";
        font-size: 14.5px;
        position: relative;
    }

    .detail-wrap-info {
        padding-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .info-item-content {
        padding-left: 5px;
        display: flex;
        flex-direction: column;
        color: rgb(31, 31, 184);
    }

    h5 > svg {
        position: relative;
        top: 3px;
    }

    .detail-wrap-content {
        padding-top: 10px;
        font-family: "goth";
        padding-right: 15px;
        padding-bottom: 20px;
    }

    :global(.detail-wrap-content > p) {
        min-height: 15px;
        font-family: "goth";
        font-size: 14px;
    }

    :global(.detail-wrap-content > h1) {
        font-size: 17px;
    }

    :global(.detail-wrap-content > h2) {
        font-size: 16px;
    }

    :global(.detail-wrap-content > h3) {
        font-size: 15px;
    }

    @keyframes icon-focus {
        from {
            background: transparent;
        }

        to {
            background: rgb(137, 137, 213);
        }
    }
</style>
