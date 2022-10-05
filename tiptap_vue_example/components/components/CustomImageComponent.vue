<template>
  <node-view-wrapper>
    <img :class="this.node.attrs.class" :src="this.node.attrs.src" :width="node.attrs.width" :height="node.attrs.height">
  </node-view-wrapper>
</template>

<script>
  import Vue from 'vue'
  import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-2'
  //import ImageWindow from '@/admin/editor-new/ImageWindow'

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
      onClick() {
        const ImageCtor = Vue.extend(ImageWindow)
        const windowInstance = new ImageCtor({
          propsData: {
            editor: this.editor,
            attributes: this.node.attrs
          }
        })
        windowInstance.$mount()
        document.querySelector('body').appendChild(windowInstance.$el)
      }
    },
    mounted() {
      //
    }
  }
</script>
