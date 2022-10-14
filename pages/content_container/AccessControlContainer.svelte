<style>
    .browse-content-container {
        width: 960px;
        height: 550px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: -4px 5px 14px 0 rgb(197 197 197 / 50%);       
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
        width: 130px;
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
        grid-template-columns: 1fr 1fr 3fr 5fr 2fr 2fr;
        z-index: 4;
    }

    .header-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header-id-container {
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

    .header-name-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 3 / 4;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .header-detail-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 4 / 5;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .header-accept-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 5 / 6;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .header-decline-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 6 / 7;
        overflow-x: hidden;
        overflow-y: hidden;
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
    
    import AccessControlItem from '../../components/manager/AccessControlItem.svelte';
    import AccessControlDetailView from './AccessControlDetailView.svelte';

    export let stage = 1;



    let all_checked = false;
    let focus = null;
    let item_objs = []

    // Handler is received from components

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


    async function declineHandle(e) {
        let index = e.detail.index;
        if (item_objs[index]) {
            try {
                let result = await declineFromRequestId(item_objs[index]._id);
                let pop_obj = item_objs.splice(index, 1);
            } catch (e) {
                console.log(e);
            }
            item_objs = item_objs;
        } else {
            console.log(`item_objs[#${index}] doesn't exist`)
        }
    }

    async function acceptHandle(e) {
        let index = e.detail.index;
        if (item_objs[index]) {
            try {
                let result = await acceptFromRequestId(item_objs[index]._id);
                let pop_obj = item_objs.splice(index, 1);
            } catch (e) {
                console.log(e);
            }
            item_objs = item_objs;
        } else {
            console.log(`item_objs[#${index}] doesn't exist`)
        }
    }

    function checkHandle(e) {
        let index = e.detail.index;
        let checked = e.detail.checked;
        if (item_objs[index]) {
            item_objs[index].checked = checked;
        } else {
            console.log(`item_objs[#${index}] doesn't exist`);
        }

        item_objs = item_objs;
    }

    function focusHandle(e) {
        let index = e.detail.index;
        focus = item_objs[index];
    }

    function escapeHandle(e) {
        focus = e.detail.focus;
    }

    
    // Call is received directly from buttons

    async function declineCall() {
        let result = getItemList();
        let response = [];
        console.log(result.length)
        for (let i = 0; i < result.length; i++) {
            console.log(i)
            if (result[i].checked) {
                let pop_obj = result.splice(i, 1);
                let network_result = await declineFromRequestId(pop_obj._id);
                response = [...response, network_result];
                i = i - 1;
            }
        }

        console.log(response);
        item_objs = result;
    }

    async function acceptCall() {
        let result = getItemList();
        let response = [];
        console.log(result.length)
        for (let i = 0; i < result.length; i++) {
            console.log(i)
            if (result[i].checked) {
                let pop_obj = result.splice(i, 1);
                let network_result = await acceptFromRequestId(pop_obj._id);
                response = [...response, network_result];
                i = i - 1;
            }
        }

        console.log(response)
        item_objs = result;
    }

    // Networking functions

    async function acceptFromRequestId(id) {
        let result = await axios.post(
            `http://localhost:8000/request/accpet`,
            {
                request_id: id,
            }
        );
        return result;
    }

    async function declineFromRequestId(id) {
        let result = await axios.post(
            `http://localhost:8000/request/decline`,
            {
                request_id: id,
            }
        );
        return result;
    }



    // Utility functions

    function getItemListLength() {
        return getItemList().length;
    }

    function getItemList() {
        // returns copied list of ITEM_OBJS
        return [...item_objs];
    }




    // stage manager
    // stage manager manages the logic behind navigation within create-container

    $: {
        if (stage == 1) {

        } else if (stage == 2) {

        }
        
        else if (stage == 3) {

        }
    }


    // Dummy datas

    for (let i = 0; i < 20; i++) {
        item_objs = [...item_objs, {
            checked: false,
            _id: i,
            user_id: i,
            name: '김재우',
            detail: '권한 수정 요청',
            content: {
                type: 0,
            //    access_to: [
            //        0,1,3,4
            //    ]
            //  if type == 1,
            //       {
              type: 1,
              change_to: 2
            //}
            },
            reasons: "해사 역사 기록 연구 목적"

        }]
    }











</script>


<div class="browse-content-container">

        <div class="upload-view">
            <div class="header">
                <h3>받은 요청</h3>
                <div class="control-panel">
                    <button on:click={acceptCall}><h3>수락</h3></button>
                    <button on:click={declineCall}><h3>거절</h3></button>
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
                <div class="header-id-container">
                    <div class="header-container">
                        <h3>ID</h3>
                    </div>
                </div>
                <div class="header-name-container">
                    <div class="header-container">
                        <h3>이름</h3>
                    </div>
                </div>
                <div class="header-detail-container">
                    <div class="header-container">
                        <h3>요청사항</h3>
                    </div>
                </div>
                <div class="header-accept-container">
                    <div class="header-container">
                        <h3>수락</h3>
                    </div>
                </div>
                <div class="header-decline-container">
                    <div class="header-container">
                        <h3>거절</h3>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="table">
                    {#each item_objs as item, index}
                        <AccessControlItem
                            checked = {item.checked}
                            index = {index}
                            data = {item}
                            on:delete = {declineHandle}
                            on:accept = {acceptHandle}
                            on:check = {checkHandle}
                            on:click = {focusHandle}
                        />
                    {/each}
                </div>
            </div>
        </div>
        {#if focus}
            <AccessControlDetailView request={focus} on:escape={escapeHandle} />
        {/if}
</div>