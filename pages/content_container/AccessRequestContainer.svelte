<script>
    import { Route, meta, router } from "tinro";
    import axios from "axios";
    import { draw, fade } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";

    import DefaultModal from "../../components/modals/DefaultModal.svelte";
    import { wishList, token } from "../../utilities/store";
    import { address } from "../../utilities/settings";

    /* 
        FILE inherits FOCUS obj from ContentContainer.
    */
    let content = "";
    let check_input = false;

    var dispatch = createEventDispatcher();

    function undoFocus() {
        dispatch("stageChange", {
            stage: 1,
        });
    }

    async function requestSubmit() {
        let result = await axios({
            url: `http://${address}/drf/request/open`,
            method: "post",
            data: {
                image_cases: $wishList[0],
                video_cases: $wishList[1],
                doc_cases: $wishList[2],
                request_form: 0,
                title: "기록물 접근 권한신청",
                comments: content,
            },
            headers: {
                Authorization: `Token ${$token}`,
            },
        });
        return result;
    }

    function deleteCall(i) {
        let form = access_to[i].form;
        let id = access_to[i].id;
        let index = $wishList[form].indexOf(id);
        $wishList[form].splice(index, 1);
        access_to = wishListWrapper($wishList);
    }

    function withdrawCall() {
        dispatch("stageChange", {
            stage: 1,
        });
    }

    async function submitCall() {
        if ((!$wishList[0] && !$wishList[1] && !$wishList[2]) || !content) {
            check_input = true;
        } else {
            let data = await requestSubmit();
            // this resets the wishlist
            wishList.update((wishList) => {
                return { 0: [], 1: [], 2: [] };
            });
            dispatch("submit", {
                data: data,
                stage: 3,
            });
        }
    }

    function modalCloseHandle(e, type) {
        if (type == 0) {
            check_input = e.detail.modalActive;
        }
    }

    /* Test variables to be fetched from server when online */

    /* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */

    let access_to = wishListWrapper($wishList);
    let hover = null;

    function wishListWrapper(lst) {
        let result = [];

        for (var i = 0; i < 3; i++) {
            lst[i].forEach((case_id) => {
                result.push({ form: i, id: case_id });
            });
        }
        return result;
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
        <h3>기록물 접근 권한 요청</h3>
    </div>

    <div class="body">
        <div class="body-content-wrap">
            <div class="single-input-wrap">
                <div class="input-category-title">
                    <h3>접근 요청할 기록물</h3>
                </div>
                <div class="browsing-request-wrap ">
                    {#each access_to as case_info, index}
                        <div class="browsing-request-container">
                            <div class="request-content-container">
                                <h3>등록 번호</h3>
                                <div class="whitespace" />
                                <h4>{case_info.id}</h4>
                                <div class="whitespace" />
                                <h3>의 기록물</h3>
                                <div class="whitespace" />
                                <h4>#이인호_동상_앞</h4>
                                <h5>(눌러서 이동)</h5>
                                <div class="whitespace" />
                                <h3>에 대한 열람 권한</h3>
                            </div>
                            <div class="select-wrap">
                                <div
                                    class={access_to.includes(case_info)
                                        ? "accept-container-clicked container"
                                        : "accept-container container"}
                                >
                                    <div class="accept-svg">
                                        {#if access_to.includes(index)}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                height="18"
                                                width="18"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                        {:else}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="white"
                                                height="18"
                                                width="18"
                                            >
                                                <path
                                                    stroke-linecapF="round"
                                                    stroke-linejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                        {/if}
                                    </div>
                                    <h3
                                        class={access_to.includes(case_info)
                                            ? "clicked"
                                            : "unclicked"}
                                    >
                                        선택
                                    </h3>
                                </div>
                                <div
                                    class={hover == index
                                        ? "decline-container-clicked container"
                                        : "decline-container container"}
                                    on:click={() => deleteCall(index)}
                                    on:mouseenter={() => (hover = index)}
                                    on:mouseleave={() => (hover = null)}
                                >
                                    <div class="decline-svg">
                                        {#if !(hover == index)}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                height="18"
                                                width="18"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        {:else}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="white"
                                                height="18"
                                                width="18"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        {/if}
                                    </div>
                                    <h3
                                        class={hover == index
                                            ? "clicked"
                                            : "unclicked"}
                                    >
                                        보류
                                    </h3>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="no-case-id">
                            <h3>요청이 비어있습니다</h3>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="buffer" />

            <div class="single-input-wrap">
                <div class="input-category-title">
                    <h3>사유</h3>
                </div>
                <div class="text-wrap">
                    <div class="input-wrap">
                        <textarea
                            class="content-input"
                            bind:value={content}
                            placeholder="사유를 입력해 주세요"
                        />
                    </div>
                </div>
            </div>
            <div class="btn-control-wrap">
                <div class="btn-container">
                    <button class="withdraw-btn btn" on:click={withdrawCall}>
                        <h3>취소하기</h3>
                    </button>
                    <button class="accept-btn btn" on:click={submitCall}>
                        <h3>확인하기</h3>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<DefaultModal
    modalActive={check_input}
    on:close={(e) => modalCloseHandle(e, 0)}
>
    <h3 class="modal-header" slot="header">빠진 정보가 있습니다</h3>
    <h3 class="modal-content" slot="content">입력 정보를 다시 확인해주세요</h3>
</DefaultModal>

<style>
    .focus {
        width: 100%;
        height: 100%;
        z-index: 3;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
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

    .header > h3 {
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
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
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 235px;
        bottom: 16px;
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
        height: fit-content;
        width: fit-content;
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
        position: relative;
        top: 95px;
        height: fit-content;
        width: 100%;
        background: white;
    }

    .single-input-wrap {
        margin-top: 8px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        position: relative;
    }

    .padding {
        width: 140px;
        height: 40px;
    }

    .input-category-title {
        width: 140px;
        min-height: 92px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .input-category-title > h3 {
        position: absolute;
        font-size: 17px;
        font-family: "goth";
        color: rgb(30, 42, 95);
        width: 200px;
        height: 20px;
        padding-left: 12px;
        padding-top: 5px;
        left: 40px;
        top: -37px;
    }

    .buffer {
        width: 100%;
        height: 50px;
    }

    .header {
        height: 55px;
        width: 100%;
        background: white;
        position: absolute;
        top: 0;
        z-index: 5;
    }

    .header > h3 {
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .body {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        z-index: 3;
        background-color: white;
    }

    .browsing-request-wrap {
        width: 720px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .browsing-request-container {
        width: 90%;
        height: 45px;
        padding-right: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background: whitesmoke;
        padding-left: 15px;
        margin-bottom: 14px;
        border-radius: 5px;
        position: relative;
    }

    .request-content-container {
        height: fit-content;
        width: 100%;
        justify-content: flex-start;
        align-items: baseline;
        display: flex;
        flex-direction: row;
    }

    .request-content-container > h3 {
        font-family: "goth";
        font-size: 15px;
        color: rgb(15, 21, 46);
    }

    .request-content-container > h4 {
        font-family: "goth";
        font-size: 16px;
        color: rgb(31, 31, 184);
    }

    .request-content-container > h5 {
        font-family: "goth";
        font-size: 8px;
        color: rgb(26, 26, 128);
    }

    .decline-container-clicked {
        background-color: rgb(226, 41, 41);
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .accept-container-clicked {
        background-color: rgb(99, 228, 99);
    }

    .clicked {
        color: white;
    }

    .unclicked {
        color: currentColor;
    }

    .container {
        width: 50px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .container > h3 {
        font-size: 11px;
        font-family: "goth";
    }

    .select-wrap {
        width: 100px;
        height: 100%;
        position: absolute;
        right: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        display: flex;
        flex-direction: row;
    }

    .whitespace {
        width: 10px;
    }

    .authority-request-wrap {
        width: 720px;
        height: 100%;
        padding-right: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-bottom: 10px;
    }

    .label {
        font-size: 10px;
        font-family: "goth";
        color: rgb(26, 26, 128);
    }

    .authority-wrap > h3 {
        font-size: 16px;
        font-family: "goth";
    }

    .rest-text > h3 {
        font-size: 15px;
        font-family: "goth";
    }

    .text-wrap {
        width: 720px;
        min-height: 93px;
    }

    .text-wrap > h5 {
        font-size: 14.5px;
        font-family: "goth";
        width: 95%;
    }

    .btn-control-wrap {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        bottom: 0;
        right: 0;
    }

    .btn-container {
        width: 350px;
        display: flex;
        height: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin-right: 15px;
    }

    .btn {
        width: 85px;
        height: 37px;
        border: none;
        outline: none;
        display: flex;
        background: #1f2058;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            -65deg,
            rgb(5 123 165) 0%,
            rgb(5 116 162) 0%,
            rgb(6 114 162) 0%,
            rgb(9 29 131) 100%
        );
        border-radius: 2px;
    }

    .btn > h3 {
        color: white;
        font-size: 13px;
        width: fit-content;
        font-family: "goth";
        padding-top: 3px;
    }

    .input-wrap {
        width: 90%;
        height: fit-content;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background: whitesmoke;
        padding-left: 15px;
        margin-bottom: 14px;
        border-radius: 5px;
        position: relative;
    }

    .content-input {
        height: 100px;
        width: 98%;
        font-family: "goth";
        font-size: 14.5px;
        resize: none;
        border: none;
        background-color: transparent;
        outline: none;
    }
</style>
