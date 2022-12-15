<script>
    import { token } from "../../utilities/store";
    import axios from "axios";
    import { router } from "tinro";
    import { Circle } from "svelte-loading-spinners";
    import { scale, fade } from "svelte/transition";

    import InputDateValue from "../../components/manager/Input/InputDateValue.svelte";
    import InputSingleValue from "../../components/manager/Input/InputSingleValue.svelte";
    import DefaultModal from "../../components/modals/DefaultModal.svelte";
    import { condition_set } from "../../utilities/inputConditions";
    import { address } from "../../utilities/settings";

    let username = "";
    let password = "";
    let _username_initialize = "";
    let _password_initialize = "";
    let modalActive = false;
    let hover = false;

    function navToRegister() {
        router.goto("/auth/signin");
    }

    function hoverInHandle() {
        hover = true;
    }

    function hoverOutHandle() {
        hover = false;
    }

    async function loginCall() {
        try {
            let result = await axios({
                url: `http://${address}/drf/user/login`,
                method: "post",
                data: {
                    username: username,
                    password: password,
                },
                header: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            let recent_token = result.data.token;
            localStorage.setItem("token", recent_token);
            token.set(recent_token);
            router.goto("/manage/cases");
        } catch (e) {
            initialize();
            modalActive = true;
            console.log(e);
        }
    }

    async function check_status() {
        try {
            let result = await axios({
                url: `http://${address}/drf/user/check-status`,
                method: "get",
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
            setTimeout(() => {
                router.goto("/manage/cases");
            }, 1);
            return result;
        } catch (e) {
            throw e;
        }
    }

    function changeHandle(e, input) {
        if (input == "username") {
            username = e.detail.value;
            console.log(username);
        } else if (input == "password") {
            password = e.detail.value;
            console.log(password);
        }
    }

    function modalCloseHandle(e) {
        modalActive = e.detail.modalActive;
    }

    function initialize() {
        _username_initialize = "";
        _password_initialize = "";
        username = "";
        password = "";
    }
</script>

<div class="login-wrap">
    <div class="arrow-wrap">
        <button class="arrow-btn" on:click={() => router.goto("/user")}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                height="30"
                width="30"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
            </svg>
        </button>
    </div>
    {#await check_status()}
        <Circle size="60" color="rgb(31, 32, 88)" unit="px" duration="1s" />
    {:catch e}
        <div class="login-form-wrap" in:scale={{ start: 0.8 }}>
            <div class="title">
                <h3>로그인</h3>
                <h4>해사미디어아카이브에 오신 것을 환영합니다!</h4>
            </div>
            <form class="login-form">
                <div class="form-input">
                    <div class="username">
                        <InputSingleValue
                            on:change={(e) => changeHandle(e, "username")}
                            value={_username_initialize}
                            placeholder="아이디"
                            conditions={condition_set.registered_id_conditions}
                        />
                    </div>
                    <div class="password">
                        <InputSingleValue
                            on:change={(e) => changeHandle(e, "password")}
                            value={_password_initialize}
                            placeholder="비밀번호"
                            hidden={true}
                            conditions={condition_set.default_conditions}
                        />
                    </div>
                </div>
                <div class="form-btn">
                    <button on:click|preventDefault={loginCall}>
                        <svg
                            class="svg"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="white"
                            height="18"
                            width="18"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                        </svg>
                        <h3>로그인</h3>
                    </button>
                </div>
            </form>
            <div class="miscel-wrap">
                <div class="signin-wrap">
                    <button on:click|preventDefault={navToRegister}>
                        <svg
                            class="svg"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="white"
                            height="18"
                            width="18"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                            />
                        </svg>
                        <h3>회원가입</h3>
                    </button>
                </div>
                <div class="forgot-wrap">
                    <a href="/auth/recovery">
                        비밀번호가 기억이 나지 않나요 ?
                    </a>
                </div>
                <div class="license-wrap">
                    <h4>
                        미디어 아카이브 체계에 제공되는 개인정보는 1년의
                        유휴기간 이후 자동 소멸됩니다. 또한 미디어 아카이브
                        체계가 제공하는 모든 자료들은 비공개 자료로 특별한 허가
                        없이 타인에게 제공하는 등의 행위는 위법이므로 자료
                        활용에 주의를 바랍니다.
                    </h4>
                </div>
            </div>
        </div>
    {/await}
</div>

<DefaultModal {modalActive} on:close={modalCloseHandle}>
    <h3 class="modal-header" slot="header">계정이 없습니다!</h3>
    <h3 class="modal-content" slot="content">비활성화 상태일 수 있습니다</h3>
</DefaultModal>

<style>
    .arrow-wrap {
        height: 50px;
        width: 50px;
        position: absolute;
        left: 20px;
        top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .arrow-btn {
        outline: none;
        background: none;
        border: none;
        height: fit-content;
        width: fit-content;
    }

    .login-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        width: 100%;
        height: 75px;
        background-color: rgb(31, 32, 88);
        position: relative;
    }

    .title > h3 {
        color: rgb(247, 247, 247);
        font-family: "goth";
        font-size: 14px;
        padding-left: 24px;
        padding-top: 14px;
    }

    .title > h4 {
        position: absolute;
        top: 42px;
        font-size: 10px;
        color: white;
        left: 23px;
        font-family: "goth";
    }

    .login-form-wrap {
        width: 400px;
        height: 595px;
        background: white;
        display: flex;
        flex-direction: column;
    }

    .login-form {
        height: 295px;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 25px;
    }

    .username {
        height: 120px;
    }

    .password {
        height: 120px;
    }

    .form-btn {
        height: 55px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .miscel-wrap {
        width: 100%;
        height: 190px;
    }

    button {
        width: 75%;
        height: 44px;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;
        background: rgb(74 75 131);
        border-radius: 3px;
    }

    button > h3 {
        color: white;
        font-size: 15px;
        font-family: "goth";
    }

    .svg {
        position: absolute;
        left: 23px;
        bottom: 15px;
    }

    .forgot-wrap {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 15px;
    }

    .forgot-wrap > a {
        width: fit-content;
        height: fit-content;
        font-size: 12px;
        font-family: "goth";
    }

    .signin-wrap {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .license-wrap > h4 {
        font-size: 12px;
        font-family: "goth";
        color: #b3b3b3;
        width: 90%;
    }

    .license-wrap {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
