<style>

    .focus {
        width: 100%;
        height: 100%;
        z-index: 3;
        overflow-y: hidden;
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
        font-family: 'goth';
        font-size: 17px;
        color:#1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .body {
        background-color: white;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 3;
        overflow-y: auto;
    }


    .single-input-wrap {
        margin-top: 8px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: flex-start;
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

    .name-wrap > h3, .date-wrap > h3 {
        font-family: 'goth';
        font-weight: 900;
        font-size: 11px;
    }

    .space {
        width: 7px;
        height: 100%;
    }

    .body-content-wrap {
        position: absolute;
        top: 95px;
        height: 100%;
        width: 100%;
        background: white;
    }

    
  

    

</style>

<script>
    import { Route, meta, router } from 'tinro';
    import axios from 'axios';
    import { draw, fade } from 'svelte/transition';
    import { createEventDispatcher, onMount } from 'svelte';

    import { condition_set } from '../../utilities/inputConditions.js';
    
    import InputMultiValue from '../../components/manager/Input/InputMultiValue.svelte';
    import InputSingleValue from '../../components/manager/Input/InputSingleValue.svelte';
    import InputSelectValue from '../../components/manager/Input/InputSelectValue.svelte';




    /* 
        USER inherits FOCUS obj from AccountListContainer.
    */

    export let user;

    const route = meta();

    let user_id = route.params._id;
    let status = 0;
    let image;

    



    var dispatch = createEventDispatcher();
    


    function undoFocus() {
        dispatch('escape', {
            focus: null
        });
        router.goto('/manage/accounts/browse');
    }

    function changeHandle(e, variable) {
        variable = e.detail.value;
    }

    function changeOptionHandle(e, variable) {
        variable = e.detail.key;
    }

    function passHandle(e) {
        let input_name = e.detail.name;
        pass_list[input_name] = e.detail.pass;
    }


    async function getDataFromId(id) {
        user = await axios.get(`http://localhost:4000/account/${id}`);
        ({ name,
          registered_by,
          registered_id,
          affiliation,
          id,
          ip_address,
          date,
          authority,
          standing,
          position } = user);
        return user

        //if user is fetched:
        //  status = 1;
        //if user fetch fails:
        //  status = 0;
        //if waiting to be fetched:
        //  status = 2;
    }



    /* Test variables to be fetched from server when online */
    
    /* USER object:
            @redistered_id - Registered id used to login user
            @authority     - Show confidential contents to authorized personal only. 
                             Set 0 at default.
                             (0: waitlist
                              1: user
                              2: admin)
            @name          - Name of the logged in user.
            @standing      - String, set "" at default.
            @position      - String, set "" at default.
            @affiliation   - Location object, set blank at default.
            @created_at    - Date time object.
    */

    user = {
                _id: 2,
                registered_id: 'sampleId',
                name: "김재우",
                authority: 1,
                standing: "상병",
                position: "전산병",
                affiliation: "학술정보원 멀티미디어교실",
                created_at: "22년 2월 3일",
                ip_address: "192.168.0.101",
                registered_by: "김재우",
                date: "2022년 12월 12일"
            }
    
    let name = user.name
    let registered_by = user.registered_by
    let registered_id = user.registered_id
    let affiliation = user.affiliation
    let id = user._id
    let ip_address = user.ip_address
    let date = user.date
    let authority = user.authority
    let standing = user.standing
    let position = user.position

    
</script>            
           

<div class="focus">
    <div class="header">
        <div class="back-btn-wrap">
            <button class="back-btn" on:click={undoFocus}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                </svg>
            </button>
        </div>
        {#await getDataFromId(user_id)}
            <div class="approved-mark-wrap">
            </div>
            <h3>
                파일을 받아오는 중입니다
            </h3>
        {:then result}
            <div class="approved-mark-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(99, 228, 99)" height="18" width="18">
                    <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3>
                {result.name}
            </h3>
        {:catch error}
            <div class="approved-mark-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(226, 41, 41)" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h3>
                다시 시도 바랍니다
            </h3>
        {/await}


        {#if status == 1}
            <div class="info-wrap">
                <div class="date-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="11" width="11">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div class="space"></div>
                    <h3>{user.created_at}</h3>
                </div>
            </div>

            <div class="icons-wrap">
                <div class="fix-wrap icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <div class="bell-wrap icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                </div>
                <div class="download-wrap icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
            </div>
        {/if}
    </div>

    <div class="body">
        {#if user.authority}
            <div class="body-content-wrap">
                <!-- awaits until file is fetched from the server -->
                {#if status == 0}
                    <div class="single-input-wrap">
                        <div class="input-category-title">
                            <h3>기본 등록 정보</h3>
                        </div>
                        <InputSingleValue placeholder="이름" init={name} on:change={(e) => changeHandle(e, name)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                        <InputSingleValue placeholder="아이디" init={registered_id} on:change={(e) => changeHandle(e, registered_id)} conditions={condition_set.registered_id_conditions} on:pass={passHandle}  />
                    </div>
                    <div class="single-input-wrap">
                        <div class="padding"></div>
                        <InputSingleValue placeholder="계급" init={standing} on:change={(e) => changeHandle(e, standing)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                        <InputSingleValue placeholder="직별 혹은 직책" init={position} on:change={(e) => changeHandle(e, position)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                    </div>
                    <div class="single-input-wrap">
                        <div class="padding"></div>
                        <InputSingleValue placeholder="소속" init={affiliation} on:change={(e) => changeHandle(e, affiliation)} conditions={condition_set.default_conditions} on:pass={passHandle} />
                        <InputSingleValue placeholder="등록 번호" init={id} on:change={(e) => changeHandle(e, id)} conditions={condition_set.unchangable_conditions('등록 번호')} immutable={true} on:pass={passHandle} />
                    </div>
                    <div class="single-input-wrap">
                        <div class="padding"></div>
                        <InputSingleValue placeholder="등록 일자" init={date} on:change={(e) => changeHandle(e, date)} conditions={condition_set.unchangable_conditions('등록 일자')} immutable={true} on:pass={passHandle} />
                        <InputSingleValue placeholder="등록 IP" init={ip_address} on:change={(e) => changeHandle(e, ip_address)} conditions={condition_set.unchangable_conditions('등록 IP')} immutable={true} on:pass={passHandle} />
                    </div>
            
                    <div class="buffer"></div>
            
            
                    <div class="single-input-wrap">
                        <div class="input-category-title">
                            <h3>권한 정보</h3>
                        </div>
                        <InputSelectValue placeholder="권한 종류" init={authority} on:change={(e) => changeOptionHandle(e, authority)} conditions={condition_set.default_conditions} on:pass={passHandle} option_list={['비인가', '일반 유저', '관리자']} />
                        <InputSingleValue placeholder="권한 부여자" init={registered_by} on:change={(e) => changeHandle(e, registered_by)} conditions={condition_set.unchangable_conditions('권한 부여자')} immutable={true} on:pass={passHandle} />
                    </div>
                {:else if status == 2}
                    Error!
                {/if}
            </div>
        {:else}
            <div class="body-content-wrap-unauthorized"></div>
        {/if}
    </div>


</div>