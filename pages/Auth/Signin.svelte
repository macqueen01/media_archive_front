<script>
    import { Route, router } from "tinro";
    import axios from "axios";

    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { crossfade, draw, fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { linear, quadIn, quadOut } from "svelte/easing";

    import SignInTitle from "../../components/manager/ContentTitle/SignInTitle.svelte";
    import InputSingleValue from "../../components/manager/Input/InputSingleValue.svelte";
    import InputMultiValue from "../../components/manager/Input/InputMultiValue.svelte";
    import InputCheckboxValue from "../../components/manager/Input/InputCheckboxValue.svelte";
    import InputDateValue from "../../components/manager/Input/InputDateValue.svelte";
    import InputSelectValue from "../../components/manager/Input/InputSelectValue.svelte";

    import { condition_set } from "../../utilities/inputConditions.js";
    import { address } from "../../utilities/settings";
    import SimpleButton from "../sidebar/SimpleButton.svelte";

    let fetching = false;
    let fetched;
    let stage = 1;
    let name = "";
    let affiliation = "";
    let standing = "";
    let position = "";
    let registered_id = "";
    let password = "";
    let authority = 1;
    let ip_address = "";
    let user = {};
    let pass_list = {
        length: () => {
            let length = 0;
            for (var item in this) {
                length += 1;
            }
            return length;
        },
        name: false,
        affiliation: false,
        standing: false,
        position: false,
        registered_id: false,
        authority: true,
        password: false,
    };

    var dispatch = createEventDispatcher();

    // Handler is received from components

    function passHandle(e) {
        let input_name = e.detail.name;
        pass_list[input_name] = e.detail.pass;
    }

    function changeHandle(e, variable_name) {
        if (variable_name == "name") {
            name = e.detail.value;
            pass_list.name = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "password") {
            password = e.detail.value;
            pass_list.password = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "affiliation") {
            affiliation = e.detail.value;
            pass_list.affiliation = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "standing") {
            standing = e.detail.value;
            pass_list.standing = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "position") {
            position = e.detail.value;
            pass_list.position = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "registered_id") {
            registered_id = e.detail.value;
            pass_list.registered_id = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "authority") {
            // DON'T REMOVE THE CONSOLE LOG BELOW!
            console.log(e.detail.key);

            authority = e.detail.key;
            pass_list.authority = e.detail.pass;
            pass_list = pass_list;
        } else {
            console.log("Change Error Occurred");
        }
    }

    function initialize() {
        if (fetching) {
            // initializes when fetching
            name = "";
            affiliation = "";
            standing = "";
            position = "";
            registered_id = "";
            password = "";
            authority = 1;
        }
    }

    function passCheck(lst) {
        // passCheck checks if lst (will be given passlist)
        // has any false condition for all variables.
        // so lst should have length method implemented for itself.
        if (lst.length() == 1) {
            return false;
        }

        for (var item in lst) {
            // this ignores .length of lst
            if (!lst[item]) {
                return false;
            }
        }

        return true;
    }

    async function postUser() {
        //if (isValid(user)) {
        fetching = true;
        let result = await axios({
            url: `http://${address}/drf/user/signin`,
            method: "post",
            data: {
                username: registered_id,
                name: name,
                password: password,
                standing: standing,
                position: position,
                authority: authority,
                affiliation: affiliation,
            },
        });

        fetching = false;
        console.log(result)
        fetched = result;
        return fetched;

        //}
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
            postUser();
        } else if (stage == 3) {
            
        }
    }
</script>

<div class="signin-container">
    <div class="signin-wrap" in:fade>
        <SignInTitle />
        <div class="browse-content-container">
            {#if stage == 1}
                <div class="body">
                    <div class="body-content-wrap">
                        <!-- awaits until file is fetched from the server -->
                        <div class="single-input-wrap">
                            <div class="input-category-title">
                                <h3>기본 등록 정보</h3>
                            </div>
                            <InputSingleValue
                                placeholder="이름"
                                init={name}
                                on:change={(e) => changeHandle(e, "name")}
                                conditions={condition_set.default_conditions}
                                on:pass={passHandle}
                            />
                            <InputSingleValue
                                placeholder="소속"
                                init={affiliation}
                                on:change={(e) =>
                                    changeHandle(e, "affiliation")}
                                conditions={condition_set.default_conditions}
                                on:pass={passHandle}
                            />
                        </div>
                        <div class="single-input-wrap">
                            <div class="padding" />
                            <InputSingleValue
                                placeholder="계급"
                                init={standing}
                                on:change={(e) => changeHandle(e, "standing")}
                                conditions={condition_set.default_conditions}
                                on:pass={passHandle}
                            />
                            <InputSingleValue
                                placeholder="직별 혹은 직책"
                                init={position}
                                on:change={(e) => changeHandle(e, "position")}
                                conditions={condition_set.default_conditions}
                                on:pass={passHandle}
                            />
                        </div>
                        <div class="single-input-wrap">
                            <div class="padding" />
                            <InputSingleValue
                                placeholder="아이디"
                                init={registered_id}
                                on:change={(e) =>
                                    changeHandle(e, "registered_id")}
                                conditions={condition_set.registered_id_conditions}
                                on:pass={passHandle}
                            />
                            <InputSingleValue
                                placeholder="비밀번호"
                                init={password}
                                on:change={(e) => changeHandle(e, "password")}
                                conditions={condition_set.default_conditions}
                                on:pass={passHandle}
                            />
                        </div>

                        <div class="buffer" />

                        <div class="single-input-wrap">
                            <div class="input-category-title">
                                <h3>권한 정보</h3>
                            </div>
                            <InputSelectValue
                                placeholder="권한 종류"
                                init={authority}
                                on:change={(e) => changeHandle(e, "authority")}
                                conditions={condition_set.select_conditions}
                                on:pass={passHandle}
                                option_list={["비인가", "일반 유저", "관리자"]}
                            />
                            <div class="btn-wrap">
                                <div class="btn-container">
                                    <SimpleButton
                                        placeholder="돌아가기"
                                        on:click={() => {
                                            router.goto("/auth/login");
                                        }}
                                    />
                                    <SimpleButton
                                        placeholder="제출하기"
                                        inactive={!passCheck(pass_list)}
                                        on:click={() => {
                                            stage += 1;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if stage == 2}
                {#if fetching}
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
                {:else if fetched && fetched.data}
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
                        <a href="/manage/accounts/browse">
                            <h3>돌아가기</h3>
                        </a>
                        <a
                            on:click={() => {
                                stage -= 1;
                            }}
                        >
                            <h3>등록 계속하기</h3>
                        </a>
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
                        <div class="btn-wrap failed-page">
                            <div class="btn-container">
                                <SimpleButton
                                    placeholder="다시입력"
                                    on:click={() => {
                                        stage -= 1;
                                    }}
                                />
                                <SimpleButton
                                    placeholder="로그인 창"
                                    on:click={() => {
                                        router.goto("/auth/login");
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

<style>
    .signin-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .signin-wrap {
        width: 960px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .browse-content-container {
        width: 960px;
        height: 520px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: -4px 5px 14px 0 rgb(197 197 197 / 50%);
        overflow-x: hidden;
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
        padding-top: 55px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .body-content-wrap {
        position: absolute;
        top: 55px;
        height: fit-content;
        width: 100%;
        background: white;
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

    .btn-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 92px;
        width: 300px;
        margin-right: 30px;
        margin-left: 30px;
        position: relative;
    }

    .btn-container {
        display: flex;
        position: absolute;
        top: 25px;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
    }

    .failed-page {
        position: absolute;
        right: 17px;
        bottom: 15px;
    }
</style>
