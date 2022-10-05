<template>
  <b-modal
    centered
    id="external-video-window"
    :title="!attributes ? 'Insert Video' : 'Edit Video'"
    @cancel="handleCancel"
    @ok="handleOk"
    visible
  >
    <form @submit.stop.prevent="handleSubmit">
      <b-form-group id="src-input" label="Src" label-for="src-input">
        <b-form-input id="src" v-model="form.src"></b-form-input>
      </b-form-group>
      <b-form-group id="title-input" label="Title" label-for="title-input">
        <b-form-input id="title" v-model="form.title"></b-form-input>
      </b-form-group>
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
    attributes: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        src: "",
        title: "",
      },
    };
  },
  methods: {
    resetModal() {
      this.form.src = "";
      this.form.title = "";
    },
    handleOk() {
      this.handleSubmit();
    },
    handleCancel() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    handleSubmit() {
      if (this.attributes == null) {
        this.addExternalVideo();
      } else {
        this.editExternalVideo();
      }
    },
    addExternalVideo() {
      if (this.form.src == null || this.form.src == "") {
        return;
      }

      this.editor.chain().focus().setExternalVideo(this.form).run();

      this.handleCancel();
    },
    editExternalVideo() {
      this.editor
        .chain()
        .focus()
        .updateAttributes("external-video", this.form)
        .run();
    },
  },
  mounted() {
    if (this.attributes) {
      Object.assign(this.form, this.attributes);
    }
  },
};
</script>
