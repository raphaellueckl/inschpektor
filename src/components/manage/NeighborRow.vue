<template>
  <div class="columns">
    <div class="column is-one-fifth">
      Username
    </div>
    <div class="column is-two-fifths">
      {{neighbor.address}}
    </div>
    <div class="column">
      Active
    </div>
    <div class="column">
      Sync
    </div>
    <div class="column">
      <i class="far fa-trash-alt"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NeighborRow',
    props: ['neighbor']
  };
</script>

<style scoped>
  .column {
    background-color: #009fff;
    color: #fff;
    border-radius: 4px;
    margin: 4px;
  }
</style>