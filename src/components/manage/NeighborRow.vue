<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child notification is-info box">
        <div class="content">
          Username
        </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child notification is-info box">
        <div class="content">
          IP
        </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child notification is-info box">
        <div class="content">
          Active
        </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child notification is-info box">
        <div class="content">
          Sync
        </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child notification is-info box">
        <div class="content">
          <i class="far fa-trash-alt"></i>
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