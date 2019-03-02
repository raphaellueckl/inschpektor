<template>
  <div>
    <NoContent v-if="!neighbors"></NoContent>

    <Summary v-if="neighbors" :neighbors="neighbors" />

    <div v-if="neighbors" class="tile is-ancestor">
      <div class="tile is-parent">
        <Neighbor
          :neighbor="neighbor"
          v-for="(neighbor, index) in neighbors"
          v-if="index < neighbors.length"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Neighbor from './Neighbor.vue';
import Summary from './Summary.vue';
import NoContent from '../NoContent.vue';

export default {
  name: 'Dashboard',
  components: {
    NoContent,
    Summary,
    Neighbor
  },
  computed: {
    ...mapGetters(['neighbors'])
  },
  created() {
    this.$store.dispatch('fetchPersistedIriNeighbors');
  }
};
</script>

<style scoped>
.tile.is-parent {
  flex-wrap: wrap;
}
</style>
