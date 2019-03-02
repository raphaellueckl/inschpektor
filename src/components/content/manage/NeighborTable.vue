<template>
  <div class="bottom-margin">
    <div class="columns header not-on-mobile">
      <div class="column is-4">
        IP
      </div>
      <div class="column is-one-fifth">
        Username
      </div>
      <div class="column is-2">
        Main Port
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

    <NeighborRow
      v-if="neighbors"
      v-for="neighbor in neighbors"
      :neighbor="neighbor"
      :key="neighbor.address"
    />

    <NoContent v-if="!neighbors"></NoContent>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
  background-color: hsl(141, 71%, 60%);
  border-radius: 4px;
  margin-top: 4px;
  font-weight: bold;
}

.bottom-margin {
  margin-bottom: 25px;
}

@media screen and (max-width: 768px) {
  .not-on-mobile {
    display: none;
  }
}
</style>
