
<style>
    .bottom-bar {
        margin-top: 20px;
    }

    .navbar-placeholder {
        height: 40px;
    }
</style>

<script>

    import AccessRequestCreateContainer from '../../../pages/content_container/AccessRequestCreateContainer.svelte';
    import ManageCreateNavbar from '../../../pages/sidebar/ManageCreateNavbar.svelte';
    import AccessRequestCreateTitle from '../ContentTitle/AccessRequestCreateTitle.svelte';

    let subtitle = '';
    let stage = 1;

    function stageHandle(e) {
        stage = e.detail.stage;
    }

    function titleChange(stage) {
        if (stage == 1) {
            return '요청 선택'
        } else if (stage == 2) {
            return '요청 세부사항'
        } else if (stage == 3) {
            return '요청 전송 중'
        }
        return '허가되지 않은 창'
    }


    $: {
        subtitle = titleChange(stage);
    }
</script>

<AccessRequestCreateTitle subtitle={subtitle}/>
<AccessRequestCreateContainer stage={stage} on:stageChange={stageHandle}/>
<div class="bottom-bar">
    <div class="navbar-placeholder"></div>
</div>