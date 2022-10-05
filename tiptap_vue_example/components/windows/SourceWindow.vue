<template>
  <b-modal
    centered
    id="external-video-window"
    title="Source View"
    @cancel="handleCancel"
    @ok="handleOk"
    size="lg"
    visible
  >
    <form @submit.stop.prevent="handleSubmit">
      <b-form-textarea
        id="code"
        v-model="form.source"
        rows="20"
      ></b-form-textarea>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    editor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        source: "",
      },
    };
  },
  methods: {
    resetModal() {
      this.form.source = "";
    },
    handleOk() {
      this.handleSubmit();
    },
    handleCancel() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    handleSubmit() {
      if (this.form.source !== this.editor.getHTML()) {
        this.editor.chain().setContent(this.form.source, true).run();
      }

      this.handleCancel();
    },
  },
  mounted() {
    this.form.source = this.editor.getHTML();
  },
};
</script>
