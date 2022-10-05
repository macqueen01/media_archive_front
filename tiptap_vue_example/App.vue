<template>
  <div id="app">
    <editor v-model="content" />
  </div>
</template>

<script>
import Editor from "./components/Editor.vue";

export default {
  name: "App",
  components: {
    Editor,
  },
  data() {
    return {
     content: ''
    };
  },
};
</script>