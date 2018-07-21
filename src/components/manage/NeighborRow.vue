<template>
  <div class="columns">
    <div class="column is-one-fifth">
      User123
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
      <a class="button is-danger is-rounded" @click="remove"><i class="far fa-trash-alt"/></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NeighborRow',
    props: ['neighbor'],
    methods: {
      remove() {

      }
    }
  };
</script>

<style scoped>
  .columns {
    background-color: #009fff;
    color: #fff;
    margin-top: 4px;
    border-radius: 4px;
  }
</style>