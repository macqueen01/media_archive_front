<template>
    <b-modal
      centered
      id="link-window"
      :title="!attributes ? 'Insert Link' : 'Edit Link'"
      @cancel="handleCancel"
      @ok="handleOk"
      visible
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-group id="url-input" label="Url" label-for="url-input">
          <vue-typeahead-bootstrap
            v-model="form.href"
            :data="internalLinks"
            :serializer="link => link.text"
            @hit="form.href = $event.id"
            ref="href"
          /></b-form-group>
        </b-form-group>
        <b-form-group id="target-input" label="Target" label-for="target-input">
          <b-form-select id="target" v-model="form.target" :options="targets"></b-form-select>
        </b-form-group>
        <b-form-group id="rel-input" label="Rel" label-for="rel-input">
          <b-form-select id="rel" v-model="form.rel" :options="rels"></b-form-select>
        </b-form-group>
        <b-form-row class="d-flex align-items-center my-2">
          <b-col sm="9">
             <p>Class</p>
          </b-col>
          <b-col sm="3">
            <b-button
              size="sm"
              @click="resetClass"
              variant="warning"
              block
              :disabled="this.form.class == ''"
            >
              Reset
            </b-button>
          </b-col>
        </b-form-row>
        <b-form-group id="class-input">
          <v-select
            id="link-classes"
            v-model="classes"
            :options="[
              'btn',
              'bg-primary',
              'bg-secondary',
              'bg-green-700',
              'text-white',
              'text-black',
              'border',
              'border-primary',
              'border-secondary',
              'border-green-700',
              'hover:bg-white',
              'hover:text-primary',
              'hover:text-secondary',
              'hover:text-black',
              'inline-flex',
              'items-center',
              'transition',
              'ease-in-out',
              'duration-150',
              'no-underline',
              'm-2',
              'md:border-2',
            ]"
            label="Classes"
            multiple>
          </v-select>
        </b-form-group>
        <b-row>
          <b-col md="4" class="my-2">
            <button @click.prevent="addButtonClasses('primary')" class="d-block w-100 btn bg-primary text-white border border-primary md:border-2 hover:bg-white hover:text-primary inline-flex items-center transition ease-in-out duration-150">Button</button>
          </b-col>
          <b-col md="4" class="my-2">
            <button @click.prevent="addButtonClasses('secondary')" class="d-block w-100 btn bg-secondary text-white border border-secondary md:border-2 hover:bg-white hover:text-secondary inline-flex items-center transition ease-in-out duration-150">Button</button>
          </b-col>
          <b-col md="4" class="my-2">
            <button @click.prevent="addButtonClasses('success')" class="d-block w-100 btn bg-success text-white border border-success md:border-2 hover:bg-white hover:text-success inline-flex items-center transition ease-in-out duration-150">Button</button>
          </b-col>
        </b-row>
        </div>
      </form>
    </b-modal>
</template>

<script>
  import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
  import vSelect from 'vue-select'

  export default {
    components: {
      VueTypeaheadBootstrap,
      vSelect
    },
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
        internalLinks: [],
        form: {
          href: '',
          target: 'None',
          rel: 'follow',
          class: ''
        },
        targets: ['None', '_blank'],
        rels: ['follow', 'noopener noreferrer nofollow', 'noopener sponsored'],
        classes: [],
        buttons: [
          { name: 'primary', class: 'btn bg-primary text-white border border-primary md:border-2 hover:bg-white hover:text-primary inline-flex items-center transition ease-in-out duration-150 m-2' },
          { name: 'secondary', class: 'btn bg-secondary text-white border border-secondary md:border-2 hover:bg-white hover:text-secondary inline-flex items-center transition ease-in-out duration-150 m-2' },
          { name: 'success', class: 'btn bg-green-700 inline-block text-white border border-green-700 hover:bg-white hover:text-black m-2' }
        ],
      }
    },
    methods: {
      resetModal() {
        this.form.href = ''
        this.form.target = 'None'
        this.form.rel = 'follow'
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
          this.addLink()
        } else {
          this.editLink()
        }
      },
      addLink() {
        if (this.form.href == null || this.form.href == '') {
          return
        }

        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink(this.prepareLink(this.form))
          .run()

        this.handleCancel()
      },
      editLink() {
        // if href is not set, we presume that the link should be removed
        if (this.form.href == null || this.form.href == '') {
          this.editor.chain().focus().unsetLink().run()
        }

        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .updateAttributes('link', this.prepareLink(this.form))
          .run()

        this.handleCancel()
      },
      prepareLink(attributes) {
        return {
          href: attributes.href,
          target: attributes.target == 'None' ? null : '_blank',
          rel: this.prepareRel(attributes),
          class: attributes.class == '' ? null :  attributes.class,
        }
      },
      prepareRel(attributes) {
        if (attributes.rel !== 'follow') {
          return attributes.rel
        }

        if (attributes.rel == 'follow' && attributes.target == '_blank') {
          return 'noopener'
        }

        return null
      },
      resetClass() {
        if (this.classes.length > 0) {
          let confirmation = confirm(`Are you sure you want to reset the image's classes?`)

          if (confirmation) {
            this.classes.splice(0)
          }
        }
      },
      addButtonClasses(name) {
        this.classes.splice(0)
        let button = this.buttons.find((b) => b.name == name)
        this.classes.push(...button.class.split(' '))
      },
      assignForm() {
        this.form.href = this.attributes.href
        this.form.target = this.attributes.target == null ? 'None' : this.attributes.target
        this.form.rel = this.assignRel()
        if (this.attributes.class) {
          this.assignClass()
        }
      },
      assignRel() {
        if (this.attributes.rel === 'noopener noreferrer nofollow') {
          return this.attributes.rel
        }

        if (this.attributes.rel === 'noopener sponsored') {
          return this.attributes.rel
        }

        return 'follow'
      },
      assignClass() {
        this.classes.push(...this.attributes.class.split(' '))
      },
      getInternalLinks() {
        this.editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'heading') {
            if (node.attrs.id !== null) {
              this.internalLinks.push({text: node.textContent, id: `#${node.attrs.id}`})
            }
          }
        })
      }
    },
    async mounted() {
      if (this.attributes) {
        this.assignForm()
      }
      this.getInternalLinks()

      setTimeout(() => {
        this.$refs.href.$refs.input.focus()
      }, 200)

      this.$watch('classes', () => {
        this.form.class = this.classes.join(' ')
      }, {immediate: true})
    }
  }
</script>
