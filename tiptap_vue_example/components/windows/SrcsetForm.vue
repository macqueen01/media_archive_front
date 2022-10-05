<template>
  <div>
    <b-form-group id="srcset-input" label-for="srcset-input">
      <b-form-row class="d-flex align-items-center">
        <b-col sm="7">
          <b-form-group id="src" label="Src" label-for="src">
            <b-form-input name="src-input" v-model="form.src"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="2">
          <b-form-group id="width" label="Width" label-for="width">
            <b-form-input
              name="width-input"
              v-model="form.width"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-button @click="addSrcset" variant="success" block class="mt-2"
            >Add</b-button
          >
        </b-col>
      </b-form-row>
    </b-form-group>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      form: {
        src: "",
        width: "",
      },
    };
  },
  methods: {
    addSrcset() {
      this.$emit("added", {
        uuid: uuidv4(),
        src: this.form.src,
        width: this.form.width,
      });
      this.resetForm();
    },
    resetForm() {
      this.form.src = "";
      this.form.width = "";
    },
  },
  mounted() {
    //
  },
};
</script>
