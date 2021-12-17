<template>
  <a-layout>
    <Header></Header>
    <router-view />
  </a-layout>
</template>

<script>
import Header from "@/components/header";
export default {
  name: "MainLayout",
  components: {
    Header
  }
}
</script>

<style scoped>
</style>