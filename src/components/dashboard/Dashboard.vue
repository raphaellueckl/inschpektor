<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">

        <div class="tile is-parent is-vertical">
          <div v-for="(neighbor, index) in neighbors" v-if="index < neighbors.length / 3">
            <Neighbor :neighbor="neighbor"/>
            <br>
          </div>
        </div>

        <div class="tile is-parent is-vertical">
          <div v-for="(neighbor, index) in neighbors"
               v-if="index >= neighbors.length / 3 && index < neighbors.length * 2 / 3">
            <Neighbor :neighbor="neighbor"/>
            <br>
          </div>
        </div>

        <div class="tile is-parent is-vertical">
          <div v-for="(neighbor, index) in neighbors"
               v-if="index >= neighbors.length * 2 / 3">
            <Neighbor :neighbor="neighbor"/>
            <br>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Neighbor from './Neighbor.vue'

  export default {
    name: 'Dashboard',
    components: {
      Neighbor
    },
    computed: {
      ...mapGetters(['neighbors'])
    }
  };
</script>

<style scoped>
</style>