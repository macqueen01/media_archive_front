<style>

    .navbar-wrap {
        position: absolute;
        top: 0;
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    
    .navbar {
        width: 100%;
        height: 98%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
        background-color: white;
        padding: 8px;
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
        padding: 9px;
    }

    .menu-select-hover {
        color: white;
        font-family: "goth";
        font-weight: 600;
        font-size: 14px;
        background: rgb(2,0,36);
        background: linear-gradient(-65deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(9,18,127,1) 0%, rgba(4,145,173,1) 100%);
        padding: 9px;
    }
    
    
    
</style>

<script>

    import { Route } from 'tinro';

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
    <div class="navbar">
        <div class="logo-wrap">
            <a href="/">
                <img src="/public/nama_logo.png" alt="navy" height="60">
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