<template>
  <div>
    <div class="columns header">
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

    <NeighborRow v-if="neighbors" v-for="neighbor in neighbors" :neighbor="neighbor" :key="neighbor.address"/>

    <NoContent v-if="!neighbors"></NoContent>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import NoContent from '../NoContent.vue';
  import NeighborRow from './NeighborRow';

  export default {
    name: 'NeighborTable',
    components: {
      NoContent,
      NeighborRow
    },
    computed: {
      ...mapGetters(['neighbors'])
    }
  };
</script>

<style scoped>
  .columns.header {
    background-color: hsl(141, 71%, 48%);
    color: #fff;
    border-radius: 4px;
    margin-top: 4px;
    font-weight: bold;
  }
</style>