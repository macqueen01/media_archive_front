<style>
    .search-main {
        width: 550px;
        height: 100px;
        background-color: whitesmoke;
        border: 1px solid #011284;
        padding: 10px;
        box-shadow: 5px 10px #011284;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 2f 1f;
    }
    
    .search-panel {
        grid-column: 2 / 9;
        grid-row: 1 / 2;
        position: relative;
    }
    
    .select {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: 5px;
    }
    
    h3 {
        font-family: "goth";
        font-size: 15px;
    }
    
    .select-all-or-reset {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .search-icon-wrap {
        position: absolute;
        margin-left: 5px;
        width: 40px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .search-bar {
        position: relative;
        margin-left: 5px;
        width: 97%;
        height: 100%;
        border: 1px solid #011284;
    }
    
    .search-input {
        z-input: -1;
        position: absolute;
        bottom: 0;
        right: 10px;
        height: 98%;
        width: 420px;
        border: none;
        outline: none;
        background: transparent;
        font-size: 20px;
        font-family: 'goth';
    }
    
    .btn-clicked, .search-btn {
        height: 85%;
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #011284;
        color: white;
    }
    
    .btn {
        height: 85%;
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<script></script>


<div class="search-main">
        <div class="select-all-or-reset">
            <h3>
                전체선택
            </h3>
        </div>
        <div class="search-panel">
            <div class="search-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" height="25px" width="25px">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <div class="search-bar">
                <input class="search-input">
            </div>
        </div>
        
        <div class="select">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="30px" width="30px" fill="none">
                  <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </div>
        
        <div class="select">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="30px" width="30px" fill="none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        </div>
        
        <div class="select">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="30px" width="30px" fill="none">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        </div>
        
        <div class="select">
            <div class="btn">
                <h3>인물</h3>
            </div>
        </div>
        <div class="select">
            <div class="btn">
                <h3>제목</h3>
            </div>
        </div>
        <div class="select">
            <div class="btn">
                <h3>장소</h3>
            </div>
        </div>
        <div class="select">
            <div class="btn">
                <h3>최근순</h3>
            </div>
        </div>
        <div class="select">
            <div class="search-btn">
                <h3>검색</h3>
            </div>
        </div>
    </div>