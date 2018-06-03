<template>
  <!--<article class="tile is-child notification" :class="colors[id % colors.length]">-->
  <article class="tile is-child notification" >
    <h1 class="title">123.123.123.123</h1>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>Active:</strong><span class="align__right">❌</span>
        </p>
        <p>
          <strong>Synced:</strong><span class="align__right">✔️</span>
        </p>
        <p>
          <strong>Iri-version:</strong><span class="align__right">1.4.2</span>
        </p>
        <p>
          <strong>Online since:</strong><span class="align__right">3d 12h 2m</span>
        </p>
      </div>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'Neighbor',
    props: ['id'],
    data() {
      return {
        colors: ['is-primary', 'is-link', 'is-info', 'is-success', 'is-warning', 'is-danger']
      }
    }
  }
</script>

<style scoped>
  .align__right {
    float: right
  }
</style>