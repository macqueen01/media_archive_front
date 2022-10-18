
<style>
    .bottom-bar {
        margin-top: 20px;
    }
</style>

<script>

    import AccessControlContainer from './AccessControlContainer.svelte';
    import ManageCreateNavbar from '../sidebar/ManageCreateNavbar.svelte';
    import AccessControlTitle from '../../components/manager/ContentTitle/AccessControlTitle.svelte';

    let subtitle = '';
    let stage = 1;
    let view = 'box';

    function stageHandle(e) {
        stage = e.detail.stage;
    }

    function titleChange(stage) {
        if (stage == 1) {
            return '받은 요청'
        } else if (stage == 2) {
            return '권한 수정'
        }
        return '허가되지 않은 창'
    }

    $: {
        subtitle = titleChange(stage);
    }
</script>

<AccessControlTitle subtitle={subtitle}/>
<AccessControlContainer stage={stage} />
<div class="bottom-bar">
    <ManageCreateNavbar stage={stage} on:stageChange={stageHandle}/>
</div>