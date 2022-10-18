<template>
  <node-view-wrapper>
    <div class="resp-container"></div>
      <iframe
        :src="this.node.attrs.src"
        :width="node.attrs.width"
        :height="node.attrs.height"
      />
    </div>
  </node-view-wrapper>
</template>

<script>
  import Vue from 'vue'
  import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-2'

  export default {
    components: {
      NodeViewWrapper,
    },
    props: nodeViewProps,
    data() {
      return {
        //
      }
    },
    methods: {
      //
    },
    mounted() {
      //
    }
  }
</script>
