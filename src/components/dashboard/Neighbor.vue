<template>
  <article class="tile is-child notification" :class="{'is-danger' : !neighbor.isFriendlyNode || neighbor.isActive === false || neighbor.isSynced === false}">
    <h1 class="title"><span v-if="neighbor.iriVersion">👑</span> {{neighbor.name ? neighbor.name : neighbor.address}}</h1>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>Protocol:</strong><span class="align__right">{{neighbor.protocol === null ? 'N/A' : neighbor.protocol.toUpperCase()}}</span>
        </p>
        <p>
          <strong>Friendly Node:</strong><span class="align__right">{{neighbor.isFriendlyNode ? '✔️' : '❌'}}</span>
        </p>
        <p>
          <strong>Active:</strong><span class="align__right">{{neighbor.isActive === null ? 'N/A' : neighbor.isActive ? '✔️' : '❌' }}</span>
        </p>
        <p>
          <strong>Synced:</strong><span class="align__right">
          {{neighbor.isSynced === null ? 'N/A'
          : neighbor.isSynced ? '✔' : '❌'}}️</span>
        </p>
        <p>
          <strong>Iri-version:</strong><span class="align__right">{{neighbor.iriVersion === null ? 'N/A' : neighbor.iriVersion}}</span>
        </p>
      </div>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'Neighbor',
    props: ['neighbor']
  };
</script>

<style scoped>
  .align__right {
    float: right
  }
</style>