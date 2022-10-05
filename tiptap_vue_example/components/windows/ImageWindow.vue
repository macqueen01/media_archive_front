<template>
    <b-modal
      centered
      id="image-window"
      :title="!attributes ? 'Insert Image' : 'Edit Image'"
      @cancel="handleCancel"
      @ok="handleOk"
      size="lg"
      visible
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-group id="src-input" label="Src" label-for="src-input">
          <b-form-input id="src" @input.native="debounceLoadImage($event.target.value)" v-bind:value="form.src" :autofocus="true"></b-form-input>
        </b-form-group>
        <b-form-row class="d-flex align-items-center my-2">
          <b-col md="2">
            <p class="text-muted">Widght x Height</p>
          </b-col>
          <b-col md="5">
            <b-form-group id="width" >
              <b-form-input
                name="width-input"
                v-model="form.width"
                type="number"
                @change="keepAspectRatio('width')"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5">
            <b-form-group id="height">
              <b-form-input
                name="height-input"
                v-model="form.height"
                type="number"
                @change="keepAspectRatio('height')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-group id="loading-input" label="Loading" label-for="loading-input">
          <b-form-select v-model="form.loading" :options="['auto', 'lazy', 'eager']"></b-form-select>
        </b-form-group>
        <b-form-group id="alt-input" label="Alt" label-for="alt-input">
          <b-form-input id="alt" v-model="form.alt"></b-form-input>
        </b-form-group>
        <b-form-group id="title-input" label="Title" label-for="title-input">
          <b-form-input id="title" v-model="form.title"></b-form-input>
        </b-form-group>
        <b-form-group id="class-input" label="Class" label-for="class-input">
          <v-select v-model="classes" :options="['lazy', 'img-fluid', 'responsive-images', 'border', 'rounded', 'shadow-md']" label="Classes" multiple></v-select>
        </b-form-group>
        <b-form-row class="d-flex align-items-center my-2">
          <b-col sm="9">
             <p class="lead">Srcsets</p>
          </b-col>
          <b-col sm="3">
            <b-button
              @click="resetSrcset"
              :variant="this.srcsets.length > 0 ? 'warning' : 'success'"
              block
              :disabled="this.form.src == ''"
            >
              {{ this.srcsets.length > 0 ? 'Reset' : 'Load' }}
            </b-button>
          </b-col>
        </b-form-row>
        <srcset-form @added="appendSrcset"></srcset-form>
        <srcset
          v-for="(srcset, index) in srcsets"
          :srcset="srcset"
          :key="srcset.uuid"
          @updated="updateSrcset"
          @removed="removeSrcset"
        ></srcset>
        <b-form-group id="sizes-input" label="Sizes" label-for="sizes-input">
          <b-form-select v-model="form.sizes" :options="['(min-width: 768px) 80vw, (min-width: 1024px) 75vw, 100vw']"></b-form-select>
        </b-form-group>
      </form>
    </b-modal>
</template>

<script>
  import axios from 'axios'
  import SrcsetForm from './SrcsetForm'
  import Srcset from './Srcset'
  import { debounce } from 'lodash'
  import vSelect from 'vue-select'
  import { v4 as uuidv4 } from 'uuid';

  export default {
    components: {
      SrcsetForm,
      Srcset,
      'v-select': vSelect
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
        form: {
          src: '',
          width: '',
          height: '',
          alt: '',
          title: '',
          class: '',
          srcset: '',
          sizes: '(min-width: 768px) 80vw, (min-width: 1024px) 75vw, 100vw',
          loading: 'lazy'
        },
        classes: [],
        srcsets: []

      }
    },
    methods: {
      resetModal() {
        this.form.src = ''
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
          this.addImage()
        } else {
          this.editImage()
        }
      },
      addImage() {
        if (this.form.src == null || this.form.src == '') {
          return
        }

        this.editor
          .chain()
          .focus()
          .setImage(this.prepareImage(this.form))
          .run()

        this.handleCancel()
      },
      editImage() {
        if (this.form.src == null || this.form.src == '') {
          return
        }

        this.editor
          .chain()
          .focus()
          .updateAttributes('image', this.prepareImage(this.form))
          .run()

        this.handleCancel()
      },
      prepareImage(attributes) {
        return {
          src: attributes.src,
          alt: attributes.alt == '' ? null :  attributes.alt,
          width: attributes.width == '' ? null : attributes.width,
          height: attributes.height == '' ? null : attributes.height,
          title: attributes.title == '' ? null :  attributes.title,
          class: attributes.class == '' ? null :  attributes.class,
          srcset: attributes.srcset == '' ? null :  attributes.srcset,
          sizes: attributes.sizes == '' ? null :  attributes.sizes,
          loading: attributes.loading == '' ? null :  attributes.loading,
        }
      },
      appendSrcset(srcset) {
        this.srcsets.push(srcset)
      },
      updateSrcset(values) {
        const { uuid, form } = values
        Object.assign(this.srcsets.find(s => s.uuid == uuid), form)
      },
      removeSrcset(uuid) {
        this.srcsets = this.srcsets.filter((s) => s.uuid !== uuid)
      },
      async resetSrcset() {
        if (this.srcsets.length > 0) {
          let confirmation = confirm(`Are you sure you want to reset the image's srcsets?`)
          if (confirmation) {
            this.srcsets.splice(0)
            let img = await this.loadImage(this.form.src)
            let srcsets = await this.loadSrcsets(img.width)
            this.srcsets.push(...srcsets)
          }
          return
        }

        let img = await this.loadImage(this.form.src)
        let srcsets = await this.loadSrcsets(img.width)
        this.srcsets.push(...srcsets)
      },
      assignForm() {
        this.form.src = this.attributes.src
        this.form.alt = this.attributes.alt == null ? '' : this.attributes.alt
        this.form.width = this.attributes.width == null ? '' : this.attributes.width
        this.form.height = this.attributes.height == null ? '' : this.attributes.height
        this.form.title = this.attributes.title == null ? '' : this.attributes.title
        if (this.attributes.class) {
          this.assignClass()
        }
        if (this.attributes.srcset) {
          this.assignSrcset()
        }
        this.form.sizes = this.attributes.sizes == null ?
          '(min-width: 768px) 80vw, (min-width: 1024px) 75vw, 100vw' : this.attributes.sizes
        this.form.loading = this.attributes.loading == null ? 'lazy' : this.attributes.loading
      },
      assignClass() {
        this.classes.push(...this.attributes.class.split(' '))
      },
      async assignSrcset() {
        let srcsets = this.attributes.srcset
        .split(',')
        .map((srcset) => {
          return srcset.trimLeft()
        })
        .filter((srcset) => srcset.startsWith('http'))
        .map((srcset) => {
          return this.srcsetRegex(srcset, false)
        })
        .filter((srcset) => srcset !== undefined)

        this.srcsets.push(...srcsets)
      },
      loadImage(src) {
        return new Promise((resolve, reject) => {
          let img = document.createElement('img')
          img.addEventListener('load', () => {
            resolve(img)
          })
          img.addEventListener('error', (error) => reject(error))
          img.src = src
        })
      },
      keepAspectRatio(dimension) {
        if (this.form.width && this.form.height) {
          if (dimension === 'width') {
            this.form.height = Math.round((this.form.width/16)*9)

            return
          }
          this.form.width = Math.round((this.form.height/16)*9)
        }
      },
      async loadSrcsets(width) {
        let response = await axios.get(`/uploads?src=${this.form.src}`)
        if (response.data) {
          let children = response.data.children.map((c) => {
            return this.srcsetRegex(c.public_url)
          })

          if (children[children.length - 1].width < width) {
            children.push({ uuid: uuidv4(), src: this.form.src, width: width })
          }
          return children
        }
      },
      srcsetRegex(public_url, database = true) {
        let extension = this.form.src.split('.').pop()
        let urlWithoutExtension = this.form.src.replace(`.${extension}`, '')

        if (database) {
          let regex = new RegExp(`${urlWithoutExtension}-(.*).${extension}`);
          let match = regex.exec(public_url)
          if (match) {
            return {
              uuid: uuidv4(),
              src: match[0],
              width: match[1]
            }
          }
          return
        }

        let regex = new RegExp(`${urlWithoutExtension}.*.${extension} (.*)`);
        let match = regex.exec(public_url)
        if (match) {
          return {
            uuid: uuidv4(),
            src: match[0].split(' ')[0],
            width: match[1].replace('w', '')
          }
        }
      }
    },
    created() {
      this.debounceLoadImage = debounce(async (value) => {
        try {
          this.form.src = value
          let img = await this.loadImage(value)
          this.form.width = img.width
          this.form.height = img.height
          let srcsets = await this.loadSrcsets(img.width)
          this.srcsets.push(...srcsets)
        } catch (error) {
          console.log(error)
        }
      }, 400)
    },
    mounted() {
      if (this.attributes) {
        this.assignForm()
      } else {
        this.classes.push(...['img-fluid', 'border', 'rounded', 'shadow-md'])
      }

      this.$watch('srcsets', () => {
        this.form.srcset = this.srcsets.map((srcset) => {
            return `${srcset.src} ${srcset.width}w`
          }).join(', ')
      }, {immediate: true, deep: true})

      this.$watch('classes', () => {
        this.form.class = this.classes.join(' ')
      }, {immediate: true})
    }
  }
</script>
