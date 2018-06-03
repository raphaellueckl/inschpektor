<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">

        <div class="tile is-parent is-vertical">
          <div v-for="(neighbor, index) in neighbors" v-if="index < neighbors.length / 3">
            <Neighbor :id="index"/>
            <br>
          </div>
        </div>

        <div class="tile is-parent is-vertical">
          <div v-for="(neighbor, index) in neighbors"
               v-if="index >= neighbors.length / 3 && index < neighbors.length * 2 / 3">
            <Neighbor :id="index"/>
            <br>
          </div>
        </div>

        <div class="tile is-parent is-vertical">
          <div v-for="(neighbor, index) in neighbors"
               v-if="index >= neighbors.length * 2 / 3">
            <Neighbor :id="index"/>
            <br>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Neighbor from './Neighbor.vue'

  export default {
    name: 'Dashboard',
    components: {
      Neighbor
    },
    data() {
      return {
        neighbors: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
      }
    }
  };
</script>

<style scoped>
</style>