<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification is-dark">
            <h1 class="title">Danger Zone</h1>
            <a class="button is-danger is-rounded" @click="restartNode">Restart node</a>
            <a class="button is-danger is-rounded" @click="resetDatabase">Reset inschpektor</a>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DangerZone',
    methods: {
      restartNode() {
        this.$store.dispatch('restartNode');
      },
      resetDatabase() {
        this.$store.dispatch('resetDatabase');
      }
    }
  };
</script>

<style scoped>
  .button.is-danger.is-rounded {
    margin: 5px;
  }
</style>