<style>
    .browse-content-title {
        width: 100%;
        padding-top: 15px;
        padding-bottom: 15px;
        height: 45px;
        background-color: rgb(31, 32, 88);
        position: relative;
    }

    .browse-content-title > h3 {
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 14px;
        padding-left: 24px;
    }
    
    .svg-holder {
        position: absolute;
        top: 13px;
        right: 25px;
        width: 50px;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .keyword-holder-wrap {
        position: absolute;
        top: 37px;
        left: 23px;
        width: 70%;
        height: 25px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        overflow-x: auto;
    }

    .keyword-holder-label {
        width: fit-content;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .keyword-holder-label > h3 {
        width: 45px;
        height: fit-content;
        padding-top: 2px;
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 11px;
    }

    .keyword-holder {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: fit-content;
    }

    .keyword {
        margin-right: 3px;
        width: fit-content;
        height: fit-content;
        background: linear-gradient(-65deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgb(8 65 144) 0%, rgba(4,145,173,1) 100%);
        border-radius: 10px;
    }

    .keyword > h3 {
        padding-top: 3px;
        padding-bottom: 2px;
        padding-right: 7px;
        padding-left: 7px;
        width: fit-content;
        height: fit-content;
        color: rgb(245 245 245);
        font-family: 'goth';
        font-size: 4px;
    }
</style>

<script>
    import { Route } from 'tinro';
</script>


    <div class="browse-content-title">
        <h3>기록물 조회</h3>
        <div class="svg-holder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        </div>
        <div class="keyword-holder-wrap">
            <div class="keyword-holder-label">
                <h3>키워드:</h3>
            </div>
            <div class="keyword-holder">
                <div class="keyword"><h3>#이인호_동상</h3></div>
                <div class="keyword"><h3>#김재우</h3></div>
                <div class="keyword"><h3>#학정원_배경</h3></div>
                <div class="keyword"><h3>#2022</h3></div>
                <div class="keyword"><h3>#배경화면</h3></div>
            </div>
        </div>
    </div>

