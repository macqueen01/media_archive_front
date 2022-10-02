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

</style>

<script>

</script>

<div class="user-info-title">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(247, 247, 247)" width="17" height="17">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <h3>회원정보</h3>
</div>
<div class="user-info-container">
    <div class="user-name-wrap">
        <h3>안상철</h3>
        <h4>님</h4>
    </div>
    <div class="user-affiliation-wrap item">
        <h4>소속</h4>
        <h3>학술정보원 멀티미디어교실</h3>
    </div>
    <div class="user-ip-wrap item">
        <h4>접속 주소</h4>
        <h3>192.168.0.10</h3>
    </div>
    <div class="user-recent-wrap item">
        <h4>최근접속</h4>
        <h3>4시간 전</h3>
    </div>
    <div class="user-btn-control-wrap">
        <a class="logout-btn-wrap" href="/logout">
            <h3 href="/logout">
                로그아웃
            </h3>
        </a>
        <a class="change-account-btn-wrap" href="/user/change">
            <h3 href="/user/change">
                정보수정
            </h3>
        </a>
    </div>
</div>