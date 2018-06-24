<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child notification is-success box">
          <p class="subtitle">Username</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-success box">
          <p class="subtitle">IP</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-success box">
          <p class="subtitle">Active</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-success box">
          <p class="subtitle">Sync</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-success box">
          <p class="subtitle">Remove?</p>
        </article>
      </div>
    </div>
    <NeighborRow v-for="neighbor in neighbors" :neighbor="neighbor" :key="neighbor.address"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import NeighborRow from './NeighborRow';

  export default {
    name: 'NeighborTable',
    components: {
      NeighborRow
    },
    computed: {
      ...mapGetters(['neighbors'])
    }
  }
</script>

<style scoped>

</style>