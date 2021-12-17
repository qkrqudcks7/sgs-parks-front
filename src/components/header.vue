<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="Title"
        sub-title="This is a subtitle"
        @back="() => $router.go(-1)"
    >
      <template slot="extra">
        <a-button key="3">
          Operation
        </a-button>
        <a-button key="2">
          Operation
        </a-button>
        <a-button key="1" type="primary">
          Primary
        </a-button>
      </template>
    </a-page-header>
  </div>
</template>

<script>
export default {
  name: "header",
}
</script>

<style scoped>
tr:last-child td {
  padding-bottom: 0;
}
</style>