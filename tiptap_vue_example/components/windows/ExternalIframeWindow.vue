<template>
    <b-modal
      centered
      id="external-video-window"
      :title="!attributes ? 'Insert External Iframe' : 'Edit External Iframe'"
      @cancel="handleCancel"
      @ok="handleOk"
      visible
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-group id="code-input" label="Code" label-for="code-input">
          <b-form-textarea id="code" v-model="form.code" rows="6" max-rows="9"></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
</template>

<script>
  export default {
    props: {
      editor: {
        type: Object,
        required: true
      },
      attributes: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        form: {
          code: '',
        }
      }
    },
    methods: {
      resetModal() {
        this.form.code = ''
      },
      handleOk() {
        this.handleSubmit()
      },
      handleCancel() {
        this.$destroy()
        this.$el.parentNode.removeChild(this.$el)
      },
      handleSubmit() {
        if (this.attributes == null) {
          this.addExternalIframe()
        } else {
          this.editExternalIframe()
        }
      },
      addExternalIframe() {
        if (this.form.code == null || this.form.code == '') {
          return
        }

        this.editor
          .chain()
          .focus()
          .setExternalIframe(this.form.code)
          .run()

        this.handleCancel()
      },
      editExternalIframe() {
        // we need to parse the string....
        this.editor
          .chain()
          .focus()
          .updateAttributes('external-iframe', this.parseAttributes())
          .run()
      },
      parseAttributes() {
        let doc = new DOMParser().parseFromString(this.form.code, 'text/html')
        let iframe = doc.querySelector('iframe')

        if (iframe && iframe.hasAttributes()) {
          let attrs = iframe.attributes
          let attributes = {}
          for(let i = attrs.length - 1; i >= 0; i--) {
            attributes[attrs[i].name] = attrs[i].value
          }
          console.log(attributes)
          return attributes
        }

        return {}
      },
      assignForm() {
        let iframe = '<iframe '
        for (let prop in this.attributes) {
          iframe += `${prop}="${this.attributes[prop]}" `
        }
        iframe = iframe.trimRight()
        iframe += '></iframe>'
        this.form.code = iframe
      }
    },
    mounted() {
      if (this.attributes) {
        this.assignForm()
      }
    }
  }
</script>
