<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child notification is-info">
        <div class="content">
          username
        </div>
      </article>
      <article class="tile is-child notification is-info">
        <div class="content">
          IP
        </div>
      </article>
      <article class="tile is-child notification is-info">
        <div class="content">
          Active
        </div>
      </article>
      <article class="tile is-child notification is-info">
        <div class="content">
          Sync
        </div>
      </article>
      <article class="tile is-child notification is-info">
        <div class="content">
          Remove
        </div>
      </article>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NeighborRow',
    props: ['neighbor']
  }
</script>

<style scoped>
</style>