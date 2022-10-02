<style>
    .info-wrap {
        width: 1000px;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .info-container {
        width: 200px;
        height: 80px;
        position: relative;
        padding: 10px;
        border: 1px solid #011284;
        padding: 10px;
        box-shadow: 5px 10px #011284;
        background-color: whitesmoke;
    }
    
    .info-title {
        position: absolute;
        height: fit-content;
        width: fit-content;
    }
    
    .statistics {
        width: 90px;
        height: 90px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
    
    .number-container {
        position: relative;
        width: 55px;
        height: 80px;
        bottom: 0;
        
    }
    
    .number {
        position: absolute;
        bottom: -4px;
        right: 5px;
        font-family: "goth";
        font-size: 55px;
        color: #011284;
    }
    
    .count {
        position: absolute;
        bottom: 9px;
        right: 10px;
        font-family: "goth";
        
    }
    
</style>

<script>
</script>

<div class="info-wrap">

    <div class="info-container">
        <div class="info-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="25px" width="25px" fill="none">
                  <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </div>
        <div class="statistics">
            <div class="number-container">
                <h3 class="number">
                    3
                </h3>
            </div>
            <h3 class="count">개</h3>
        </div>
    </div>
    
    <div class="info-container">
        <div class="info-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="25px" width="25px" fill="none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        </div>
        <div class="statistics">
            <div class="number-container">
                <h3 class="number">
                    3
                </h3>
            </div>
            <h3 class="count">개</h3>
        </div>
    </div>
    
    <div class="info-container">
        <div class="info-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#011284" class="w-6 h-6" height="25px" width="25px" fill="none">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        </div>
        <div class="statistics">
            <div class="number-container">
                <h3 class="number">
                    3
                </h3>
            </div>
            <h3 class="count">개</h3>
        </div>
    </div>
    
</div>