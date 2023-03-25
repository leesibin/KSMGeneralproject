<template>
  <div>
    <input
      @input="Ename = $event.target.value"
      v-on:keyup.enter="joinSubmit()"
    />
    <input type="button" value="확인" @click="joinSubmit()" />
  </div>
</template>

<script>
/* eslint-disable */ 
export default {
  name: "app",
  data() {
    return {
      Ename: "",
    };
  },
  created() {
    this.$socket.on("newUser", this.Ename);
  },
  methods: {
    joinSubmit() {
      this.$router.push({ path: "about", query: { name: this.Ename } });
      this.$socket.emit("newUser", this.Ename);
    },
  },
};
</script>

<style></style>