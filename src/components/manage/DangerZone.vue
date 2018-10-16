<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification is-dark">
            <h1 class="title">Danger Zone</h1>
            <a class="button is-danger" @click="resetDatabase">Reset inschpektor</a>
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
      resetDatabase() {
        this.$store.dispatch('resetDatabase');
      }
    }
  };
</script>

<style scoped>

</style>