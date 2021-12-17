<template>
<div>
</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "main",
  computed: {
    ...mapGetters("account",["user","authToken"])
  },
  mounted() {
    console.log(this.user)
    console.log(this.authToken)
  }
}
</script>

<style scoped>

</style>