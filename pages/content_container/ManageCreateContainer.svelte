<style>
    .browse-content-container {
        width: 960px;
        height: 550px;
        background-color: whitesmoke;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: inset 3px 3px 6px 0 rgb(197 197 197 / 50%);        
    }

    .single-input-wrap {
        margin-top: 8px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .padding {
        width: 140px;
        height: 40px;
    }

    .input-category-title {
        position: relative;
        width: 140px;
        height: 92px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .input-category-title > h3 {
        position: absolute;
        font-size: 17px;
        font-family: 'goth';
        color: rgb(30, 42, 95);
        width: 100%;
        height: 20px;
        padding-left: 12px;
        padding-top: 5px;
        left: 15px;
        top: -37px;
    }

    .buffer {
        width: 100%;
        height: 50px;
    }

    .upload-view {
        width: 100%;
        height: 100%;
        z-index: 2;
        position: relative;
    }

    .header {
        height: 55px;
        width: 100%;
        background: white;
        position: absolute;
        top: 0;
        z-index: 5;
    }

    .header > h3 {
        font-family: 'goth';
        font-size: 17px;
        color:#1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .control-panel {
        position: absolute;
        right: 18px;
        bottom: 10px;
        display: flex;
        width: 200px;
        height: fit-content;
        justify-content: space-around;
        flex-direction: row;
        align-items: center;
    }

    .control-panel > button, .file-input-label {
        background: rgb(31, 32, 88);
        border: none;
        border-radius: 0;
        height: 26px;
        width: 55px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .control-panel > button > h3, .file-input-label > h3 {
        font-family: 'goth';
        font-size: 11px;
        color: whitesmoke;
    }

    .file-input {
        display: none;
    }

    .body {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        z-index: 3;
    }

    .table {
        width: 100%;
        height: fit-content;
        position: absolute;
        top: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .table-header {
        position: absolute;
        top: 55px;
        width: 100%;
        height: 45px;
        background-color: white;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        display: grid;
        grid-template-columns: 1fr 5fr 10fr 3fr 1fr;
        z-index: 4;
    }

    .header-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header-snapshot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 2 / 3;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .header-checkbox-container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        padding-left: 13px;
        padding-right: 8px;
        grid-column: 1 / 2;
    }

    .check-btn {
        border: thin solid rgb(31, 32, 88);
        border-radius: 0;
        height: 18px;
        width: 18px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
    }

    .check-btn-clicked {
        background: rgb(31, 32, 88);
        border: none;
        border-radius: 0;
        height: 18px;
        width: 18px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
    }

    .header-title-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 3 / 4;
    }

    .header-download-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 4 / 5;
    }

    .header-delete-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 5 / 6;
    }

    .header-container > h3 {
        font-family: 'goth';
        font-size: 14px;
        color:#1e1c3b;
    }
</style>


<script>
    import { Route, router } from 'tinro';
    import axios from 'axios';

    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    
    import InputSingleValue from '../../components/manager/Input/InputSingleValue.svelte';
    import InputMultiValue from '../../components/manager/Input/InputMultiValue.svelte';
    import InputCheckboxValue from '../../components/manager/Input/InputCheckboxValue.svelte';
    import InputDateValue from '../../components/manager/Input/InputDateValue.svelte';
    import InputSelectValue from '../../components/manager/Input/InputSelectValue.svelte';
    import Tiptap from '../../components/manager/Tiptap/Tiptap.svelte';
    import ManageCreateItem from '../../components/manager/ManageCreateItem.svelte';
    import Preview from '../../components/manager/CreateViews/Preview.svelte';

    import { condition_set } from "../../utilities/inputConditions.js";

    export let stage = 1;


    let title;
    let location;
    let affiliation;
    let associate;
    let attendee;
    let attendee_list=[];
    let date;
    let produced = true;
    let type = '사진';
    let source;
    let pass_list = {};
    // FILE_UPLOADING is a flag for which to track if file is being 
    // transfered in that moment of time
    let file_uploading = false;
    let all_checked = false;
    let received_file = false;
    let content = "<h3>Hello to this world!</h3>";
    let item_objs = []


    function downloader(item) {
        if (!item) {
            console.log('cannot find item')
        }

        console.log("downloading from...",item.src)
    }

    function titleChange(e) {
        title = e.detail.value;
    }

    function locationChange(e) {
        location = e.detail.value;
    }

    function affiliationChange(e) {
        affiliation = e.detail.value;
    }

    function associateChange(e) {
        associate = e.detail.value;
    }

    function attendeeChange(e) {
        attendee = e.detail.value;
    }

    function producedChange(e) {
        produced = e.detail.value;
    }

    function typeChange(e) {
        type = e.detail.value;
    }

    function dateChange(e) {
        date = e.detail.value;
    }

    function categoryChange(e) {
        category = e.detail.value;
    }

    function sourceChange(e) {
        source = e.detail.value;
    }

    // Handler is received from components

    function passHandle(e) {
        let input_name = e.detail.name;
        pass_list[input_name] = e.detail.pass;
    }

    function allCheckHandle(e) {
        if (all_checked) {
            all_checked = false;
            item_objs.forEach((item) => {
                item.checked = false;
            })
        } else {
            all_checked = true;
            item_objs.forEach((item) => {
                item.checked = true;
            })
        }

        item_objs = item_objs;
    }

    function downloadHandle(e) {
        let index = e.detail.index;
        downloader(item_objs[index]);
    }

    function deleteHandle(e) {
        let index = e.detail.index;
        if (item_objs[index]) {
            let pop_obj = item_objs.splice(index, 1);
            console.log(pop_obj[0].src);
            console.log(item_objs);
            if (pop_obj[0].src) {
                console.log('revoking Url')
                URL.revokeObjectURL(pop_obj[0].src);
            } else {
                console.log('Url revoking error');
            }
            item_objs = item_objs;
        } else {
            console.log(`item_objs[${index}] doesn't exist`)
        }
    }

    function checkHandle(e) {
        let index = e.detail.index;
        let checked = e.detail.checked;
        if (item_objs[index]) {
            item_objs[index].checked = checked;
        } else {
            console.log(`item_objs[${index}] doesn't exist`);
        }

        item_objs = item_objs;
    }

    function contentHandle(e) {
        content = e.detail.html
    }
    
    // Call is received directly from buttons

    function downloadCall() {
        item_objs.forEach((item) => {
            if (item.checked) {
                downloader(item);
                item.checked = false;
            } 
        })

        item_objs = item_objs;
    }

    function deleteCall() {
        let result = getItemList();
        console.log(result.length)
        for (let i = 0; i < result.length; i++) {
            console.log(i)
            if (result[i].checked) {
                let pop_obj = result.splice(i, 1);
                if (pop_obj[0].src) {
                    console.log('revoking Url')
                    URL.revokeObjectURL(pop_obj[0].src);
                } else {
                    console.log('Url revoking error');
                }
                i = i - 1;
            }
        }

        item_objs = result;
    }

    function uploadCall() {
        console.log('uploading call received');
        let index = getItemListLength();
        waitFile(index);
    }

    function waitFile(index) {
        if (!received_file) {
            setTimeout(() => waitFile(index), 1000);
        } else {
            console.log('waitfile fired')
            let src = URL.createObjectURL(received_file[0]);
            let file = received_file[0]
            console.log('received the file:', received_file, src);
            
            let new_item = {
                checked: false,
                src: src,
                file: file
            }

            item_objs = [...item_objs, new_item];
            received_file = false;
        }
    }

    // Utility functions

    function getItemListLength() {
        return getItemList().length;
    }

    function getItemList() {
        // returns copied list of ITEM_OBJS
        return [...item_objs];
    }

    async function fileUpload() {
        if (item_objs && !file_uploading) {
            let files = [];
            item_objs.forEach((item) => {
                files = [...files, item.file]
            })
            file_uploading = true;
            try {
                let result = await axios.post('http://localhost:4000/post/file', {files: files})
            } catch(error) {
                console.log(error);
            }

            file_uploading = false;
            console.log('file_uploading procedure ended')

        }
    }

    function parseToList(str) {
        // str = "#a #b #c ..."
        let str_lst = str.split(' ');
        let result = [];
        
        str_lst.forEach((item) => {
            result.push(item.replace(/['#']*/, ''));
        })

        return result;
    }

    // stage manager
    // stage manager manages the logic behind navigation within create-container

    $: {
        if (stage == 1) {

            if (item_objs) {
                item_objs.forEach((item) => {
                    URL.revokeObjectURL(item.src)
                })
                item_objs = [];
            }

        } else if (stage == 2) {
            // parse ATTENDEE in form of list (ATTENDEE -> ATTENDEE_LIST)
            if (attendee) {
                attendee_list = parseToList(attendee);
            }
        }
        
        else if (stage == 3) {
            let result = fileUpload();
            console.log(result)
        }
    }











</script>


<div class="browse-content-container">
    {#if stage == 1}
        <div class="single-input-wrap">
            <div class="input-category-title">
                <h3>기본 등록 정보</h3>
            </div>
            <InputSingleValue placeholder="제목을 입력해주세요" on:change={titleChange} conditions={condition_set.default_conditions} on:pass={passHandle} value={title} />
            <InputMultiValue placeholder="주요 참석자들을 입력해주세요" on:change={attendeeChange} conditions={condition_set.attendee_conditions} on:pass={passHandle}  />
        </div>
        <div class="single-input-wrap">
            <div class="padding"></div>
            <InputSingleValue placeholder="행사 장소를 입력해주세요" on:change={locationChange} conditions={condition_set.default_conditions} on:pass={passHandle} />
            <InputSelectValue placeholder="기록 유형을 선택해주세요" on:change={typeChange} conditions={condition_set.attendee_conditions} on:pass={passHandle} option_list={['영상', '사진', '문서']} />
        </div>
        <div class="single-input-wrap">
            <div class="padding"></div>
            <InputSelectValue placeholder="생산물 여부를 선택해주세요" on:change={producedChange} conditions={condition_set.attendee_conditions} on:pass={passHandle} option_list={['생산', '수집']} />
            <InputSingleValue placeholder="생산 부대를 입력해주세요" on:change={affiliationChange} conditions={condition_set.default_conditions} on:pass={passHandle} />
        </div>

        <div class="buffer"></div>


        <div class="single-input-wrap">
            <div class="input-category-title">
                <h3>생산 정보</h3>
            </div>
            <InputSingleValue placeholder="촬영자를 입력해주세요" on:change={associateChange} conditions={condition_set.default_conditions} on:pass={passHandle} />
            <InputSingleValue placeholder="생산연도를 입력해주세요" on:change={dateChange} conditions={condition_set.default_conditions} on:pass={passHandle} />
        </div>

    {:else if stage == 2}
        <div class="upload-view">
            <div class="header">
                {#if type == '사진'}
                 <h3>사진 업로드</h3>
                {:else if type == '영상'}
                    <h3>영상 업로드</h3>
                {:else if type == '문서'}
                    <h3>문서 업로드</h3>
                {:else}
                    <h3>다시 시도해 주세요</h3>
                {/if}
                <div class="control-panel">
                    <label for="file-input" class="file-input-label" on:click={uploadCall}><h3>업로드</h3></label>
                        <input id="file-input" name="file-input" class="file-input" type="file" bind:files={received_file} />
                    <button on:click={downloadCall}><h3>저장</h3></button>
                    <button on:click={deleteCall}><h3>삭제</h3></button>
                </div>
            </div>
            <div class="table-header">
                <div class="header-checkbox-container">
                    <button class="{(all_checked) ? 'check-btn-clicked' : 'check-btn'}" on:click={allCheckHandle}>
                        {#if all_checked}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" height="17" width="17">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        {/if} 
                    </button>
                </div>
                <div class="header-snapshot-container">
                    <div class="header-container">
                        <h3>스냅샷</h3>
                    </div>
                </div>
                <div class="header-title-container">
                    <div class="header-container">
                        <h3>파일명</h3>
                    </div>
                </div>
                <div class="header-download-container">
                    <div class="header-container">
                        <div class="svg-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="header-delete-container">
                    <div class="header-container">
                        <div class="svg-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="table">
                    {#each item_objs as item, index}
                        <ManageCreateItem
                            checked = {item.checked}
                            src = {item.src}
                            file = {item.file}
                            index = {index}
                            type = {type}
                            on:delete = {deleteHandle}
                            on:download = {downloadHandle}
                            on:check = {checkHandle}
                        />
                    {/each}
                </div>
            </div>
        </div>
    {:else if stage == 3}
        <Tiptap {content} on:change={contentHandle}/>
    {:else if stage == 4}
        <Preview item_objs={item_objs}
                 title={title}
                 location={location}
                 affiliation={affiliation}
                 associate={associate}
                 attendee={attendee_list}
                 date={date}
                 produced={produced}
                 type={type}
                 content={content} />
    {/if}
</div>