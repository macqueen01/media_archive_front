<script>
    import { fade, scale, fly } from "svelte/transition";

    export let category = "미상";
    export let amount = 0;
</script>

<div class="info-item">
    <div class="info-title">
        <slot name="icon" />
        <h3 class="all">{category}</h3>
    </div>

    <div class="statistics">
        <div class="number-container">
            <h3 class="number">{amount}</h3>
            <h3 class="count">개</h3>
        </div>
    </div>
</div>

<style>
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
