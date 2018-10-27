<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification">
              <h1 class="title">Save & Load</h1>
              <div class="margin-container">
                <button class="button is-link is-rounded" @click="saveDatabase">Save Database</button>
                <button class="button is-link is-rounded" @click="loadDatabase">Load Database</button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DatabaseSync',
    methods: {
      saveDatabase() {
        this.$store.dispatch('saveDatabase');
      },
      loadDatabase() {
        this.$store.dispatch('loadDatabase');
      }
    }
  };
</script>

<style scoped>
  .button.is-link.is-rounded {
    margin: 5px;
  }
</style>