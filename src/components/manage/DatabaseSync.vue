<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification">
              <h1 class="title">Save & Load</h1>
              <div class="field" style="display: flex; justify-content: center">
                <div class="file is-link">
                  <label class="file-label">
                    <input class="file-input" type="file" name="resume">
                    <span class="file-cta">
                      <span class="file-icon">
                        <font-awesome-icon icon="upload"/>
                      </span>
                      <span class="file-label">
                        Feed database
                      </span>
                    </span>
                  </label>
                  <label class="file-label">
                    <input class="file-input" type="file" name="resume">
                    <span class="file-cta">
                      <span class="file-icon">
                        <font-awesome-icon icon="download"/>
                      </span>
                      <span class="file-label">
                        Save database
                      </span>
                    </span>
                  </label>
                </div>
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
  .file-label {
    margin: 5px;
  }

  .button.is-link.is-rounded > input[type="file"] {
    display: none;
  }

  .file-label {
    border-radius: 290486px; /* bulma default */
  }
</style>