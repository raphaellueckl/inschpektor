<template>
  <section class="section">
    <div class="container">

      <div class="columns is-multiline is-mobile">
        <Neighbor class="column is-one-third" />
        <Neighbor class="column is-one-third" />
        <Neighbor class="column is-one-third" />
        <Neighbor class="column is-one-third" />
        <Neighbor class="column is-one-third" />
        <Neighbor class="column is-one-third" />
      </div>

    </div>
  </section>
</template>

<script>
import Neighbor from './Neighbor.vue'

export default {
  name: "Dashboard",
  components: {
    Neighbor
  }
};
</script>

<style scoped>
</style>