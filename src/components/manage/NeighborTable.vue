<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child notification is-success">
          <p class="subtitle">Username</p>
        </article>
        <article class="tile is-child notification is-success">
          <p class="subtitle">IP</p>
        </article>
        <article class="tile is-child notification is-success">
          <p class="subtitle">Active</p>
        </article>
        <article class="tile is-child notification is-success">
          <p class="subtitle">Sync</p>
        </article>
        <article class="tile is-child notification is-success">
          <p class="subtitle">Remove?</p>
        </article>
      </div>
    </div>
    <NeighborRow v-for="neighbor in neighbors" neighbor="neighbor"/>
  </div>
</template>

<script>
  import NeighborRow from './NeighborRow';

  export default {
    name: 'NeighborTable',
    components: {
      NeighborRow
    },
    data() {
      return {
        neighbors: [1, 2, 3]
      }
    }
  }
</script>

<style scoped>

</style>