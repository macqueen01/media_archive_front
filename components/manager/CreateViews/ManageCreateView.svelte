
<style>
    .bottom-bar {
        margin-top: 20px;
    }
</style>

<script>

    import ManageCreateContainer from '../../../pages/content_container/ManageCreateContainer.svelte';
    import ManageCreateNavbar from '../../../pages/sidebar/ManageCreateNavbar.svelte';
    import StageManageBtn from '../../../pages/sidebar/stageManageBtn.svelte';
    import ManageCreateTitle from '../ContentTitle/ManageCreateTitle.svelte';

    let subtitle = '';
    let stage = 1;

    let data = {
        stages: [
            {
                stage: 1,
                name: '메타데이터 등록'
            }, {
                stage: 2,
                name: '기록물 파일 등록'
            }, {
                stage: 3,
                name: '내용 등록'
            }, {
                stage: 4,
                name: '미리보기'
            }, {
                stage: 5,
                name: '저장하기'
            }
        ],
        unclear_list: [2,3,4,5],
    }

    function stageHandle(e) {
        stage = e.detail.stage;
    }

    function titleChange(stage) {
        if (stage == 1) {
            return '메타데이터 등록'
        } else if (stage == 2) {
            return '기록물 파일 등록'
        } else if (stage == 3) {
            return '내용 등록'
        } else if (stage == 4) {
            return '미리보기'
        } else if (stage == 5) {
            return '저장하기'
        }
        return '허가되지 않은 창'
    }

    function dataRefresh(e) {
        data.unclear_list = e.detail.uncleared;
    }


    $: {
        subtitle = titleChange(stage);
    }
</script>

<ManageCreateTitle subtitle={subtitle}/>
<ManageCreateContainer stage={stage} on:data={dataRefresh}/>
<div class="bottom-bar">
    <!--<ManageCreateNavbar stage={stage} on:stageChange={stageHandle}/>-->
    <StageManageBtn stage={stage} data={data} on:stageChange={stageHandle}/>
</div>