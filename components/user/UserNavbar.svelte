<style>

    .navbar-wrap {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;
    }
    
    .navbar {
        width: 100%;
        height: 98%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        background-color: white;
        padding-left: 30px;
        padding-right: 7px;
    }
    
    .logo-wrap {
        width: fit-content;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    
    .menu-wrap {
        width: 100px;
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
            <a class="menu-select" href="/user/accounts">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#15133C" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </a>
            <a class="menu-select" href="/user/notices">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#15133C" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </a>
        </div>
    </div>
</div>