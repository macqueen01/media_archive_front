<style>

    .navbar-wrap {
        position: absolute;
        top: 0;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    
    .navbar {
        width: 100%;
        height: 98%;
        min-width: 500px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        background-color: white;
        padding: 8px;
        padding-left: 40px;
        padding-right: 30px;
        z-index: 3;
    }
    
    .logo-wrap {
        width: fit-content;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    
    .menu-wrap {
        width: 550px;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    
    .menu-select {
        color: #15133C;
        font-family: "goth";
        font-weight: 900;
        font-size: 14px;
        padding-bottom: 9px;
        padding-top: 9px;
    }

    .menu-select-hover {
        color: #15133C;
        font-family: "goth";
        font-weight: 900;
        font-size: 14px;
        padding-bottom: 9px;
        padding-top: 9px;
        border-bottom: solid #15133C;
        position: relative;
        top: 1px;
    }

    .detail-menu {
        position: absolute;
        left: 0;
        height: 130px;
        width: 100vw;
        background-color: white;
        z-index:-1;
        box-shadow: 3px 3px 6px 0 rgb(197 197 197 / 50%);
    }
    
    
    
</style>

<script>

    import { Route } from 'tinro';
    import { fly } from 'svelte/transition';

    let hover = null;

    function overHandle(item) {
        hover = item;
    }

    function outHandle() {
        if (hover) {
            hover = null;
        }
    }
    
</script>

<div class="navbar-wrap">
    <div class="navbar" transition:fly={{duration: 200, x: 0, y: -100}}>
        <div class="logo-wrap">
            <a href="/">
                <img src="/public/navy-logo.JPG" alt="navy" height="40">
            </a>
        </div>
        <div class="menu-wrap">
            <a class="{(hover == 2) ? 'menu-select-hover' : 'menu-select'}" href="/manage/cases" on:mouseover={() => overHandle(2)} on:mouseout={outHandle}>
                기록물 관리
            </a>
            <a class="{(hover == 3) ? 'menu-select-hover' : 'menu-select'}" href="/manage/help" on:mouseover={() => overHandle(3)} on:mouseout={outHandle}>
                헬프데스크
            </a>
            <a class="{(hover == 5) ? 'menu-select-hover' : 'menu-select'}" href="/manage/accounts" on:mouseover={() => overHandle(5)} on:mouseout={outHandle}>
                회원관리
            </a>
        </div>
    </div>
</div>