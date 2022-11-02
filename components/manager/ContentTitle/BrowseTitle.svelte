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

    .form-change-holder {
        position: absolute;
        top: 40px;
        right: 25px;
        width: 80px;
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
        font-size: 10px;
    }
</style>

<script>
    import { Route } from 'tinro';
    import { createEventDispatcher } from 'svelte';

    export let form = 0;
    let view = 'box';

    var dispatch = createEventDispatcher()

    function viewChange(template) {
        if (template == 'list') {
            view = 'list'
            dispatch('viewChange', {
                view: 'list'
            })
        } else if (template == 'box') {
            view = 'box'
            dispatch('viewChange', {
                view: 'box'
            })
        } else {
            console.log('Error on browse content view change')
        }
    }

    function formChange(form) {
        if (form in [0, 1, 2]) {
            dispatch('formChange', {
                form: form
            })
        }
    }
</script>

    <div class="browse-content-title">
        <h3>기록물 조회</h3>
        <div class="svg-holder">
            <svg on:click={() => viewChange('list')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="{(view == 'list') ? 'rgb(4,145,173)' : 'white'}" width="18" height="18" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <svg on:click={() => viewChange('box')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="{(view == 'box') ? 'rgb(4,145,173)' : 'white'}">
                <path fill="none" d="M0 0h24v24H0z"/><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/>
            </svg>
        </div>
        <div class="form-change-holder">
            <svg on:click={() => formChange(1)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="18" fill="{(form == 1) ? 'rgb(4,145,173)' : 'white'}">
                <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/>
            </svg>
            <svg on:click={() => formChange(0)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" fill="{(form == 0) ? 'rgb(4,145,173)' : 'white'}">
                <path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/>
            </svg>
            <svg on:click={() => formChange(2)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="{(form == 2) ? 'rgb(4,145,173)' : 'white'}">
                <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/>
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

