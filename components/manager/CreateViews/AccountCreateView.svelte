
<style>
    .bottom-bar {
        margin-top: 20px;
    }
</style>

<script>

    import AccountCreateContainer from '../../../pages/content_container/AccountCreateContainer.svelte';
    import ManageCreateNavbar from '../../../pages/sidebar/ManageCreateNavbar.svelte';
    import AccountCreateTitle from '../ContentTitle/AccountCreateTitle.svelte';

    let subtitle = '';
    let stage = 1;

    function stageHandle(e) {
        stage = e.detail.stage;
    }

    function titleChange(stage) {
        if (stage == 1) {
            return '회원정보 등록'
        } else if (stage == 2) {
            return '저장'
        }
        return '허가되지 않은 창'
    }


    $: {
        subtitle = titleChange(stage);
    }
</script>

<AccountCreateTitle subtitle={subtitle}/>
<AccountCreateContainer stage={stage} on:stageChange={stageHandle}/>
<div class="bottom-bar">
    <ManageCreateNavbar stage={stage} on:stageChange={stageHandle}/>
</div>