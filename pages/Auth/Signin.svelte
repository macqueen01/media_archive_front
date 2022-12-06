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
        font-family: 'goth';
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

    .uploading-landing-page, .upload-success-page, .upload-fail-page {
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .uploading-landing-page > h4 {
        font-family: 'goth';
        font-size: 30px;
        width: 400px;
        color: rgb(31, 32, 88);
        text-align: center;
    }

    .upload-success-page > h4 {
        font-family: 'goth';
        font-size: 30px;
        width: 400px;
        color: rgb(99, 228, 99);
        text-align: center;
    }

    .upload-fail-page > h4 {
        font-family: 'goth';
        font-size: 30px;
        width: 400px;
        color: rgb(226, 41, 41);
        text-align: center;
    }

    .upload-fail-page > h5 {
        font-family: 'goth';
        font-size: 23px;
        width: 500px;
        color: rgb(214 39 39);
        text-align: center;
    }


</style>


<script>
    import { Route, router } from 'tinro';
    import axios from 'axios';

    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { crossfade, draw } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { linear, quadIn, quadOut } from 'svelte/easing';
    
    import SignInTitle from "../../components/manager/ContentTitle/SignInTitle.svelte";
    import InputSingleValue from '../../components/manager/Input/InputSingleValue.svelte';
    import InputMultiValue from '../../components/manager/Input/InputMultiValue.svelte';
    import InputCheckboxValue from '../../components/manager/Input/InputCheckboxValue.svelte';
    import InputDateValue from '../../components/manager/Input/InputDateValue.svelte';
    import InputSelectValue from '../../components/manager/Input/InputSelectValue.svelte';


    import { condition_set } from "../../utilities/inputConditions.js";

    let user = {}
    let fetching = false;
    let stage = 1;

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
            user.name = '';
            user.affiliation = '';
            user.standing = '';
            user.position = '';
            user.registered_id = '';
            user.password = '';
            user.authority = 1;
            user.ip_address = '';
            // then blank the user object for housekeeping.
            user = {};
        }
    }

    async function postUser(user) {
        //if (isValid(user)) {
            fetching = true;
            let result = await axios({
                url: 'http://localhost:8000/drf/user/create',
                method: 'post',
                data: {
                    username: user.registered_id,
                    password: user.password,
                    standing: user.standing,
                    position: user.position,
                    authority: user.authority
                }
            })
            initialize()
            setTimeout(() => {
                router.goto('/manage/accounts/browse')
            }, 2000)
            fetching = false;
            return result
        //}
    }

    function loginToSignIn(node, {
    delay = 0,
    duration = 400,
    easing: easing$1 = linear
    } = {}) {
        const w = +getComputedStyle(node).width;
        return {
            delay,
            duration,
            easing: easing$1,
            css: t => `width: ${400 + t * 560}px`
        }
    }

    


    // stage manager
    // stage manager manages the logic behind navigation within account create container

    $: {
        if (stage == 1) {
            dispatch('stageChange', {
                stage: stage
            })
        }
        
        else if (stage == 2) {
            dispatch('stageChange', {
                stage: stage
            })

        }
        
        else if (stage == 3) {
        }
    }



</script>

<div class="signin-container">
    <div class="signin-wrap" transition:loginToSignIn={{easing: linear, duration: 100}}>
        <SignInTitle />
        <div class="browse-content-container" transition:loginToSignIn={{easing: linear, duration: 100}}>
            {#if stage == 1}
                <div class="body">
                        <div class="body-content-wrap">
                            <!-- awaits until file is fetched from the server -->
                                <div class="single-input-wrap">
                                    <div class="input-category-title">
                                        <h3>기본 등록 정보</h3>
                                    </div>
                                    <InputSingleValue placeholder="이름" on:change={(e) => changeHandle(e, user.name)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                                    <InputSingleValue placeholder="소속" on:change={(e) => changeHandle(e, user.affiliation)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                                </div>
                                <div class="single-input-wrap">
                                    <div class="padding"></div>
                                    <InputSingleValue placeholder="계급" on:change={(e) => changeHandle(e, user.standing)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                                    <InputSingleValue placeholder="직별 혹은 직책" on:change={(e) => changeHandle(e, user.position)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                                </div>
                                <div class="single-input-wrap">
                                    <div class="padding"></div>
                                    <InputSingleValue placeholder="아이디" on:change={(e) => changeHandle(e, user.registered_id)} conditions={condition_set.registered_id_conditions} on:pass={passHandle}  />
                                    <InputSingleValue placeholder="비밀번호" on:change={(e) => changeHandle(e, user.password)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                                </div>

                                <div class="buffer"></div>
                        
                                <div class="single-input-wrap">
                                    <div class="input-category-title">
                                        <h3>권한 정보</h3>
                                    </div>
                                    <InputSelectValue placeholder="권한 종류" on:change={(e) => changeOptionHandle(e, user.authority)} conditions={condition_set.select_conditions} on:pass={passHandle} option_list={['비인가', '일반 유저', '관리자']} />
                                    <InputSingleValue placeholder="등록 IP" on:change={(e) => changeHandle(e, user.ip_address)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                                </div>
                        </div>
                </div>
            {:else if stage == 2}
                {#await postUser(user)}
                <div class="uploading-landing-page">
                    <div class="svg-wrap">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(31, 32, 88)" height="100" width="100">
                            <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
                        </svg>
                    </div>
                    <h4>등록 중 입니다</h4>
                </div>
                {:then result}
                    <div class="upload-success-page">
                        <div class="svg-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(99, 228, 99)" height="100" width="100">
                                <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h4>등록이 끝났습니다!</h4>
                        <a href="/manage/accounts/browse">
                            <h3>
                                돌아가기
                            </h3>
                        </a>
                        <a on:click={() => {stage -= 1}}>
                            <h3>
                                등록 계속하기
                            </h3>
                        </a>
                    </div>
                {:catch error}
                    <div class="upload-fail-page">
                        <div class="svg-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(226, 41, 41)" height="100" width="100">
                                <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h4>등록에 실패했습니다</h4>
                        <h5>입력 내용을 다시 한번 확인해 주세요</h5>
                        <a on:click={() => {stage -= 1}}>
                            <h3>
                                다시 입력하기
                            </h3>  
                        </a>
                        <a href="/manage/accounts/browse">
                            <h3>
                                돌아가기
                            </h3>
                        </a>
                    </div>
                {/await}
            {/if}
        </div>
    </div>
</div>