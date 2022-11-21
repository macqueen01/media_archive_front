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
        width: 100px;
        height: fit-content;
        padding-top: 2px;
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 11px;
    }


</style>

<script>
    export let subtitle = '';
</script>


<div class="browse-content-title">
    <h3>권한 요청</h3>
    <div class="keyword-holder-wrap">
        <div class="keyword-holder-label">
            <h3>{subtitle}</h3>
        </div>
    </div>
</div>