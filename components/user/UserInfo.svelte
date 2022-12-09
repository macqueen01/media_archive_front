<style>

    .user-info-title {
        width: 100%;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: left;
        background-color: rgb(31, 32, 88);
        padding: 20px;
        position: relative;
    }

    .user-info-title > svg {
        position: absolute;
        top: 21.5px;
        left: 17.5px;
    }

    .user-info-title > h3 {
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 14px;
        padding-left: 24px;
    }

    .user-info-container {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 20px;
        box-shadow: inset 0px 5px 6px 0 rgb(197 197 197 / 50%);
    }

    .user-name-wrap {
        width: 90%;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: left;
        margin: 4px;
    }

    .user-name-wrap > h3 {
        color: rgb(42, 42, 124);
        font-family: 'goth';
        font-size: 17.5px;
    }

    .user-name-wrap > h4 {
        color: rgb(33, 33, 44);
        font-family: 'goth';
        font-size: 12px;
    }

    .item > h3 {
        color: rgb(42, 42, 124);
        font-family: 'goth';
        font-size: 14px;
    }

    .item > h4 {
        color: rgb(33, 33, 44);
        font-family: 'goth';
        font-size: 11.5px;
    }

    .user-affiliation-wrap, .user-ip-wrap, .user-recent-wrap {
        width: 90%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: baseline;
        justify-content: left;
        margin: 4px;
    }

    .user-btn-control-wrap {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        justify-content: center;
        margin-top: 5px;
    }

    .logout-btn-wrap {
        width: 100%;
        height: 35px;
        background-color: rgb(42, 42, 124);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .change-account-btn-wrap {
        margin-top: 10px;
        width: 100%;
        height: 35px;
        background-color: rgb(165 165 195);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logout-btn-wrap > h3 {
        color: rgb(236, 236, 236);
        font-family: 'goth';
        font-size: 13px;
    }

    .change-account-btn-wrap > h3 {
        color: rgb(236, 236, 236);
        font-family: 'goth';
        font-size: 13px;
    }

    .fetch-fail-page {
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .fetch-fail-page > h4 {
        font-family: 'goth';
        font-size: 18px;
        width: fit-content;
        color: rgb(226, 41, 41);
        text-align: center;
    }

    .fetch-fail-page > h5 {
        font-family: 'goth';
        font-size: 16px;
        width: fit-content;
        color: rgb(214 39 39);
        text-align: center;
    }

</style>

<script>
    import axios from "axios";
    import { router } from "tinro";
    import { token } from "../../utilities/store";
    import { address } from "../../utilities/settings";
    import { Circle } from 'svelte-loading-spinners';
    import { draw } from "svelte/transition";

    async function fetch_user() {
        let fetched_items = await axios({
            url: `http://${address}/drf/user/info`,
            method: 'get',
            headers: {
                "Authorization": `Token ${$token}`
            }
        })
        console.log(fetched_items.data)
        return fetched_items.data
    }

    async function logout() {
        let result = await axios({
            url: `http://${address}/drf/user/logout`,
            method: "post",
            headers: {
                'Authorization': `Token ${$token}`
            }
        })

        router.goto("/user");
    }

</script>

<div class="user-info-title">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(247, 247, 247)" width="17" height="17">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <h3>회원정보</h3>
</div>
<div class="user-info-container">
    {#await fetch_user()}
        <Circle size="60" color="rgb(31, 32, 88)" unit="px" duration="1s" />
    {:then result}
    <div class="user-name-wrap">
        <h3>{result.user.name}</h3>
        <h4>님</h4>
    </div>
    <div class="user-affiliation-wrap item">
        <h4>소속</h4>
        <h3>{result.user.affiliation}</h3>
    </div>
    <div class="user-ip-wrap item">
        <h4>접속 주소</h4>
        <h3>192.168.0.11</h3>
    </div>
    <div class="user-recent-wrap item">
        <h4>최근접속</h4>
        <h3>{result.recent_visit.split('T')[0]}</h3>
    </div>
    <div class="user-btn-control-wrap">
        <a class="logout-btn-wrap" on:click={logout}>
            <h3>
                로그아웃
            </h3>
        </a>
        <a class="change-account-btn-wrap" href="/user/change">
            <h3 href="/user/change">
                정보수정
            </h3>
        </a>
    </div>
    {:catch e}
        <div class="fetch-fail-page">
            <div class="svg-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(226, 41, 41)" height="100" width="100">
                    <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h4>회원정보가 없습니다</h4>
            <h5>로그인이 필요합니다</h5>
        </div>
    {/await}
</div>