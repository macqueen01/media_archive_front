<template>
  <b-form-group>
    <b-form-row class="d-flex align-items-center">
      <b-col sm="7">
        <b-form-group id="src" label-for="src">
          <b-form-input name="src-input" v-model="form.src"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <b-form-group id="width" label-for="width">
          <b-form-input name="width-input" v-model="form.width"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-button @click="removeSrcset" variant="danger" block class="mb-3"
          >Remove</b-button
        >
      </b-col>
    </b-form-row>
  </b-form-group>
</template>

<script>
export default {
  props: {
    srcset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        src: "",
        width: "",
      },
    };
  },
  methods: {
    removeSrcset() {
      this.$emit("removed", this.srcset.uuid);
    },
  },
  mounted() {
    Object.assign(this.form, this.srcset);

    this.$watch(
      "form",
      () => {
        this.$emit("updated", { uuid: this.srcset.uuid, form: this.form });
      },
      { deep: true }
    );
  },
};
</script>
