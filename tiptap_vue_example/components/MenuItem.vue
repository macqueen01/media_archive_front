<template>
  <!--button
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive(): null, 'is-disabled': can ? !can(): false }"
    @click="action"
    :title="title"
    :disabled="can ? !can() : false"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>-->
  <button
    class="menu-item"
    @click="action"
    :title="title"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script>
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    action: {
      type: Function,
      required: true,
    },
    /*isActive: {
      type: Function,
      default: null,
    },
    can: {
      type: Function,
      default: null
    }*/
  },

  data() {
    return {
      remixiconUrl,
    }
  },
}
</script>
