<style>
    .not-ready-page {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .icon-wrap {
        width: 250px;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-wrap {
        width: 100%;
        height: fit-content;
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .notification-wrap > h1 {
        font-family: 'goth';
        font-size: 35px;
        width: 250px;
        color: rgb(31, 32, 88);
        text-align: center;
    }

    .details-1 {
        font-family: 'goth';
        font-size: 25px;
        width: 500px;
        color: rgb(106 107 163);
        text-align: center;
    }

    .details-2 {
        font-family: 'goth';
        font-size: 25px;
        width: 500px;
        color: rgb(106 107 163);
        text-align: center;
    }


</style>


<div class="not-ready-page">
    <div class="icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.8" stroke="rgb(31, 32, 88)" height="200" width="200">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
        </svg>
    </div>
    <div class="notification-wrap">
        <h1>준비중입니다!</h1>
        <h2 class="details-1">찾아오신 페이지는 아직 준비중입니다.</h2>
        <h2 class="details-2">곧 좋은 서비스로 뵙겠습니다!</h2>
    </div>
</div>