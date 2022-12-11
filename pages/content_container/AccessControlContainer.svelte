<script>
    import { Route, router } from "tinro";
    import axios from "axios";

    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { token } from "../../utilities/store";

    import AccessControlItem from "../../components/manager/AccessControlItem.svelte";
    import AccessControlDetailView from "./AccessControlDetailView.svelte";
    import { Circle } from "svelte-loading-spinners";
    import { address } from "../../utilities/settings";

    export let stage = 1;

    let all_checked = false;
    let focus = null;
    let item_objs = [];

    // Handler is received from components

    function allCheckHandle(e) {
        if (all_checked) {
            all_checked = false;
            item_objs.forEach((item) => {
                item.checked = false;
            });
        } else {
            all_checked = true;
            item_objs.forEach((item) => {
                item.checked = true;
            });
        }

        console.log(item_objs);
        item_objs = item_objs;
    }

    async function declineHandle(e) {
        let index = e.detail.index;
        if (item_objs[index]) {
            try {
                let result = await declineFromRequestId(item_objs[index].request_form, item_objs[index].id);
                let pop_obj = item_objs.splice(index, 1);
            } catch (e) {
                console.log(e);
            }
            item_objs = item_objs;
        } else {
            console.log(`item_objs[#${index}] doesn't exist`);
        }
    }

    async function acceptHandle(e) {
        let index = e.detail.index;
        if (item_objs[index]) {
            try {
                let result = await acceptFromRequestId(item_objs[index].request_form, item_objs[index].id);
                let pop_obj = item_objs.splice(index, 1);
            } catch (e) {
                console.log(e);
            }
            item_objs = item_objs;
        } else {
            console.log(`item_objs[#${index}] doesn't exist`);
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
        console.log(result.length);
        for (let i = 0; i < result.length; i++) {
            console.log(i);
            if (result[i].checked) {
                let pop_obj = result.splice(i, 1);
                let network_result = await declineFromRequestId(pop_obj[0].request_form, pop_obj[0].id, pop_obj[0]);
                response = [...response, network_result];
                i = i - 1;
            }
        }

        try {
            item_objs = await fetchRequests();
        } catch (e) {
            connection_warning = true;
        }
        console.log(response);
    }

    async function acceptCall() {
        let result = getItemList();
        let response = [];
        console.log(result.length);
        for (let i = 0; i < result.length; i++) {
            console.log(i);
            if (result[i].checked) {
                let pop_obj = result.splice(i, 1);
                let network_result = await acceptFromRequestId(pop_obj[0].request_form, pop_obj[0].id, pop_obj[0]);
                response = [...response, network_result];
                i = i - 1;
            }
        }

        try {
            item_objs = await fetchRequests();
        } catch (e) {
            connection_warning = true;
        }
        console.log(response);
    }

    // Networking functions

    async function acceptFromRequestId(form, id, request_obj) {
        let post_result;

        if (form == 0) {
            let data = {};
            data = access_request_parser(request_obj, 1);
            data.status = 1;
            data.request_form = form;
            data.request_id = id;

            post_result = await axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: data,
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        } else {
            post_result = await axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: {
                    request_form: form,
                    request_id: id,
                    status: 1,
                },
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        }
        return post_result;
    }

    async function declineFromRequestId(form, id, request_obj) {
        let post_result;

        if (form == 0) {
            let data = {};
            data = access_request_parser(request_obj, 0);
            data.status = 0;
            data.request_form = form;
            data.request_id = id;

            post_result = await axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: data,
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        } else {
            post_result = await axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: {
                    request_form: form,
                    request_id: id,
                    status: 0,
                },
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        }
        return post_result;
    }

    async function fetchRequests() {
        let result = await axios({
            url: `http://${address}/drf/request/browse`,
            method: "get",
            headers: {
                Authorization: `Token ${$token}`,
            },
        });

        if (result.status != 200) {
            return result;
        }

        item_objs = result.data;
        item_objs.forEach((item) => {
            item.checked = false;
        });
        return item_objs;
    }

    // Utility functions

    function getItemListLength() {
        return getItemList().length;
    }

    function getItemList() {
        // returns copied list of ITEM_OBJS
        return [...item_objs];
    }

    function access_request_parser(data, status) {
        if ((data.request_form == 1) || !(status in [0,1,2])) {
            return false;
        }
        let result = {};
        result.image_case = {};
        result.video_case = {};
        result.doc_case = {};
        data.request_components.forEach((comp) => {
            if (comp.requesting_case_form == 0) {
                result.image_case[comp.image_case.id] = status;
            } else if (comp.requesting_case_form == 1) {
                result.video_case[comp.video_case.id] = status;
            } else if (comp.requesting_case_form == 2) {
                result.doc_case[comp.doc_case.id] = status;
            } else {
                return false;
            }
        });

        return result;
    }

    // stage manager
    // stage manager manages the logic behind navigation within create-container

    $: {
        if (stage == 1) {
        } else if (stage == 2) {
        } else if (stage == 3) {
        }
    }

</script>

<div class="browse-content-container">
    <div class="upload-view">
        {#await fetchRequests()}
            <div class="spinner-wrap">
                <Circle
                    size="60"
                    color="rgb(31, 32, 88)"
                    unit="px"
                    duration="1s"
                />
            </div>
        {:then data}
            <div class="header">
                <h3>받은 요청</h3>
                <div class="control-panel">
                    <button on:click={acceptCall}><h3>수락</h3></button>
                    <button on:click={declineCall}><h3>거절</h3></button>
                </div>
            </div>
            <div class="table-header">
                <div class="header-checkbox-container">
                    <button
                        class={all_checked ? "check-btn-clicked" : "check-btn"}
                        on:click={allCheckHandle}
                    >
                        {#if all_checked}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="white"
                                height="17"
                                width="17"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
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
                            checked={item.checked}
                            {index}
                            data={item}
                            on:delete={declineHandle}
                            on:accept={acceptHandle}
                            on:check={checkHandle}
                            on:click={focusHandle}
                        />
                    {/each}
                </div>
            </div>
        {:catch error}
            <h3>
                {error.response.status}
            </h3>
        {/await}
    </div>
    {#if focus}
        <AccessControlDetailView request={focus} on:escape={escapeHandle} />
    {/if}
</div>

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
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
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

    .control-panel > button,
    .file-input-label {
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

    .control-panel > button > h3,
    .file-input-label > h3 {
        font-family: "goth";
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
        font-family: "goth";
        font-size: 14px;
        color: #1e1c3b;
    }

    .spinner-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
