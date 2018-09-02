<template>
  <div class="columns">
    <div class="column is-one-fifth">
      {{neighbor.name ? neighbor.name : 'N/A'}}
    </div>
    <div class="column is-two-fifths">
      {{neighbor.address}}
    </div>
    <div class="column">
      {{neighbor.isActive === null ? 'N/A' : neighbor.isActive ? '✔️' : '❌' }}
    </div>
    <div class="column">
      {{neighbor.isSynced === null ? 'N/A'
      : neighbor.isSynced ? '✔' : '❌'}}️
    </div>
    <div class="column">
      <a class="button is-danger is-rounded" :class="{'is-loading': submitted}" @click="remove"><i class="far fa-trash-alt"/></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NeighborRow',
    props: ['neighbor'],
    data: () => {
      return {
        submitted: false
      };
    },
    methods: {
      remove() {
        this.submitted = true;
        this.$store.dispatch('removeNeighbor', this.neighbor);
      }
    }
  };
</script>

<style scoped>
  .columns {
    background-color: rgb(0, 159, 255, 0.85);
    color: #fff;
    margin-top: 4px;
    border-radius: 4px;
  }
</style>