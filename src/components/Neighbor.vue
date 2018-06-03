<template>
  <div class="box">
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
  </div>
</template>


<script>
  export default {
    name: 'Neighbor'
  }
</script>


<style scoped>
  .align__right {
    float: right
  }
  .box {
    /*margin-right: 10px;*/
    /*margin-left: 10px;*/
  }
</style>