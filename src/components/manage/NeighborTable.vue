<template>
  <div>
    <div class="columns">
      <div class="column is-one-fifth">
        Username
      </div>
      <div class="column is-two-fifths">
        IP
      </div>
      <div class="column">
        Active
      </div>
      <div class="column">
        Sync
      </div>
      <div class="column">
        Remove?
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
  .column {
    font-weight: 600;
    background-color: hsl(141, 71%, 48%);
    color: #fff;
    border-radius: 4px;
    margin: 4px;
  }
</style>