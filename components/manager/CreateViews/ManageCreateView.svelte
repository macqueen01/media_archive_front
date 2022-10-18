
<style>
    .bottom-bar {
        margin-top: 20px;
    }
</style>

<script>

    import ManageCreateContainer from '../../../pages/content_container/ManageCreateContainer.svelte';
    import ManageCreateNavbar from '../../../pages/sidebar/ManageCreateNavbar.svelte';
    import ManageCreateTitle from '../ContentTitle/ManageCreateTitle.svelte';

    let subtitle = '';
    let stage = 1;
    let view = 'box';

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
        }
        return '허가되지 않은 창'
    }


    $: {
        subtitle = titleChange(stage);
    }
</script>

<ManageCreateTitle subtitle={subtitle}/>
<ManageCreateContainer stage={stage} />
<div class="bottom-bar">
    <ManageCreateNavbar stage={stage} on:stageChange={stageHandle}/>
</div>