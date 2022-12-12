<script>
    import CaseCountItem from "./CaseCountItem.svelte";

    import { fade, scale, fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { address } from "../../utilities/settings";
    import { Circle } from "svelte-loading-spinners";
    import axios from "axios";


    async function getCaseCount() {
        let result = await axios({
            url: `http://${address}/drf/statistics/case-count`,
            method: "get",
        });

        return result.data;
    }
</script>

<div class="info-wrap" transition:fly={{ duration: 200, x: 0, y: +100 }}>
    {#await getCaseCount()}
        <Circle size="60" color="rgb(31, 32, 88)" unit="px" duration="1s" />
    {:then result}
        <div class="info-container">
            <CaseCountItem category={"영상류"} amount={result.vid}>
                <svg
                    slot="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="#011284"
                    class="w-6 h-6"
                    height="32px"
                    width="32px"
                    fill="none"
                >
                    <path
                        stroke-linecap="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                </svg>
            </CaseCountItem>

            <div class="wall" />

            <CaseCountItem category={"사진류"} amount={result.img}>
                <svg
                    slot="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="#011284"
                    class="w-6 h-6"
                    height="32px"
                    width="32px"
                    fill="none"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                </svg>
            </CaseCountItem>

            <div class="wall" />

            <CaseCountItem category={"문서류"} amount={result.doc}>
                <svg
                    slot="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="#011284"
                    class="w-6 h-6"
                    height="32px"
                    width="32px"
                    fill="none"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                </svg>
            </CaseCountItem>

            <div class="wall" />

            <div class="info-item">
                <div class="info-title">
                    <h3 class="all">총</h3>
                </div>
                <div class="statistics">
                    <div class="number-container">
                        <h3 class="number">{result.total}</h3>
                        <h3 class="count">개</h3>
                    </div>
                </div>
            </div>
        </div>
    {:catch e}
        <div class="svg-holder">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="rgb(226, 41, 41)"
                height="100"
                width="100"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
            </svg>
        </div>
    {/await}
</div>

<style>
    .svg-holder {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info-wrap {
        position: absolute;
        width: 100%;
        height: 190px;
        background-color: white;
        bottom: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info-container {
        width: 1445px;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .info-item {
        min-width: 237px;
        width: fit-content;
        height: 80px;
        position: relative;
        padding: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .info-title {
        position: relative;
        height: fit-content;
        width: fit-content;
        min-width: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 8px;
        padding-right: 57px;
    }

    .statistics {
        width: fit-content;
        height: 90px;
        position: relative;
        right: 0;
        bottom: 0;
    }

    .number-container {
        position: relative;
        width: fit-content;
        height: 80px;
        bottom: 0;
        display: flex;
    }

    .number {
        position: relative;
        bottom: -4px;
        right: 5px;
        font-family: "goth";
        font-size: 55px;
        color: #011284;
    }

    .count {
        position: relative;
        top: 40px;
        font-family: "goth";
        height: fit-content;
    }

    .all {
        font-family: "goth";
        font-size: 20px;
        color: #293062;
    }

    .wall {
        height: 35px;
        border-right: solid 2px #6770ad;
    }
</style>
