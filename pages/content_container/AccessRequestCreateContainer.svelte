<script>
  import SimpleButton from '../sidebar/SimpleButton.svelte';

    import { Route, router } from "tinro";
    import axios from "axios";

    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { crossfade, draw } from "svelte/transition";
    import { flip } from "svelte/animate";

    import AccessRequestContainer from "./AccessRequestContainer.svelte";
    import InputSingleValue from "../../components/manager/Input/InputSingleValue.svelte";
    import InputMultiValue from "../../components/manager/Input/InputMultiValue.svelte";
    import InputCheckboxValue from "../../components/manager/Input/InputCheckboxValue.svelte";
    import InputDateValue from "../../components/manager/Input/InputDateValue.svelte";
    import InputSelectValue from "../../components/manager/Input/InputSelectValue.svelte";

    import { condition_set } from "../../utilities/inputConditions.js";

    export let stage = 1;

    let user = {};
    let fetching = false;
    let focus = null;
    let request_type = null;
    let submit_data = null;

    var dispatch = createEventDispatcher();

    // Handler is received from components

    function passHandle(e) {
        let input_name = e.detail.name;
        pass_list[input_name] = e.detail.pass;
    }

    function changeHandle(e, variable) {
        variable = e.detail.value;
    }

    function changeOptionHandle(e, variable) {
        variable = e.detail.key;
    }

    function initialize() {
        if (fetching) {
            // initializes when fetching
            // first, initialize all the inputs
            user.name = "";
            user.affiliation = "";
            user.standing = "";
            user.position = "";
            user.registered_id = "";
            user.password = "";
            user.authority = 1;
            user.ip_address = "";
            // then blank the user object for housekeeping.
            user = {};
        }
    }

    function selectRequestType() {
        request_type = focus - 1;
        stage += 1;
    }

    function stageChange(e) {
        stage = e.detail.stage;
        focus = null;
        request_type = null;
    }

    function submitData(e) {
        (stage = e.detail.stage), (submit_data = e.detail.data);
    }

    // stage manager
    // stage manager manages the logic behind navigation within account create container

    $: {
        if (stage == 1) {
            dispatch("stageChange", {
                stage: stage,
            });
        } else if (stage == 2) {
            dispatch("stageChange", {
                stage: stage,
            });
        } else if (stage == 3) {
        }
    }
</script>

<div class="browse-content-container">
    {#if stage == 1}
        <div class="body">
            <div class="choice-wrap">
                <div
                    class="choice"
                    on:click={selectRequestType}
                    on:mouseenter={() => (focus = 1)}
                    on:mouseleave={() => (focus = null)}
                >
                    <div
                        class={focus == 1
                            ? "background-container-focus"
                            : "background-container"}
                    >
                        <div class="svg-holder">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke={focus == 1
                                    ? "white"
                                    : "rgb(31, 32, 88)"}
                                height="120px"
                                width="120px"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div class="title-container">
                        <div class="title-holder">
                            <h3>기록물 접근 권한 요청</h3>
                        </div>
                    </div>
                </div>
                <div
                    class="choice"
                    on:click={selectRequestType}
                    on:mouseenter={() => (focus = 2)}
                    on:mouseleave={() => (focus = null)}
                >
                    <div
                        class={focus == 2
                            ? "background-container-focus"
                            : "background-container"}
                    >
                        <div class="svg-holder">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke={focus == 2
                                    ? "white"
                                    : "rgb(31, 32, 88)"}
                                height="120px"
                                width="120px"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div class="title-container">
                        <div class="title-holder">
                            <h3>계정 권한 요청</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else if stage == 2}
        {#if request_type == 0}
            <AccessRequestContainer
                on:stageChange={stageChange}
                on:submit={submitData}
            />
        {:else}
            <div class="authority-request" />
        {/if}
    {:else if stage == 3}
        {#if !submit_data}
            <div class="uploading-landing-page">
                <div class="svg-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.8"
                        stroke="rgb(31, 32, 88)"
                        height="100"
                        width="100"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
                        />
                    </svg>
                </div>
                <h4>등록 중 입니다</h4>
            </div>
        {:else if submit_data.status == 200}
            <div class="upload-success-page">
                <div class="svg-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="rgb(99, 228, 99)"
                        height="100"
                        width="100"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </div>
                <h4>등록이 끝났습니다!</h4>
                <div class="btn-container-2">
                    <a class="btn" href="/manage/accounts/browse">
                        <h3>돌아가기</h3>
                    </a>
                </div>
            </div>
        {:else}
            <div class="upload-fail-page">
                <div class="svg-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.8"
                        stroke="rgb(226, 41, 41)"
                        height="100"
                        width="100"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
                <h4>등록에 실패했습니다</h4>
                <h5>입력 내용을 다시 한번 확인해 주세요</h5>
                <div class="btn-container">
                    <a
                        class="btn"
                        on:click={() => {
                            stage -= 1;
                        }}
                    >
                        <h3>다시 입력</h3>
                    </a>
                <SimpleButton placeholder="돌아가기" on:click={(e) => {router.goto("/manage/cases")}}/>
                </div>
            </div>
        {/if}
    {/if}
</div>

<style>
    .browse-content-container {
        width: 960px;
        height: 550px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: -4px 5px 14px 0 rgb(197 197 197 / 50%);
    }

    .single-input-wrap {
        margin-top: 8px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .padding {
        width: 140px;
        height: 40px;
    }

    .input-category-title {
        position: relative;
        width: 140px;
        height: 92px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .input-category-title > h3 {
        position: absolute;
        font-size: 17px;
        font-family: "goth";
        color: rgb(30, 42, 95);
        width: 100%;
        height: 20px;
        padding-left: 12px;
        padding-top: 5px;
        left: 15px;
        top: -37px;
    }

    .buffer {
        width: 100%;
        height: 50px;
    }

    .body {
        background-color: white;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 3;
        overflow-y: auto;
    }

    .body {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        z-index: 3;
    }

    .uploading-landing-page,
    .upload-success-page,
    .upload-fail-page {
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .uploading-landing-page > h4 {
        font-family: "goth";
        font-size: 30px;
        width: 400px;
        color: rgb(31, 32, 88);
        text-align: center;
    }

    .upload-success-page > h4 {
        font-family: "goth";
        font-size: 30px;
        width: 400px;
        color: rgb(99, 228, 99);
        text-align: center;
    }

    .upload-fail-page > h4 {
        font-family: "goth";
        font-size: 30px;
        width: 400px;
        color: rgb(226, 41, 41);
        text-align: center;
    }

    .upload-fail-page > h5 {
        font-family: "goth";
        font-size: 23px;
        width: 500px;
        color: rgb(214 39 39);
        text-align: center;
    }

    .choice-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .choice {
        width: 300px;
        height: 300px;
        background: rgb(2, 0, 36);
        background: linear-gradient(
            -65deg,
            rgba(2, 0, 36, 1) 0%,
            rgba(9, 9, 121, 1) 0%,
            rgba(9, 18, 127, 1) 0%,
            rgba(4, 145, 173, 1) 100%
        );
        box-shadow: rgba(197, 197, 197, 0.5) -4px 5px 14px 0px;
        border-radius: 20px;
    }

    .background-container {
        width: 300px;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    .background-container-focus {
        width: 300px;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        animation-duration: 0.7s;
        animation-name: slideup;
    }

    @keyframes slideup {
        from {
            background: white;
        }

        to {
            background: transparent;
        }
    }

    .title-container {
        width: 300px;
        height: 80px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background: transparent;
    }

    .title-holder {
        width: 100%;
        height: 100%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title-holder > h3 {
        width: fit-content;
        font-family: "goth";
        font-size: 18px;
        color: white;
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

    .btn-container {
        width: 300px;
        display: flex;
        height: fit-content;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin-right: 15px;
        position: absolute;
        right: -15px;
        bottom: 40px;
    }

    .btn-container-2 {
        width: 190px;
        display: flex;
        height: fit-content;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin-right: 15px;
        position: absolute;
        right: -15px;
        bottom: 40px;
    }
</style>
