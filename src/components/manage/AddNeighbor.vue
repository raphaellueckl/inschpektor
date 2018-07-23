<template>

  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <h1 class="title">Add a neighbor</h1>
            <div class="media-content">
              <div class="content">

                <div>
                  <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="Custom name for this node">
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">IP-Address</label>
                    <div class="control has-icons-right">
                      <input class="input is-success" type="text" placeholder="E.g. 123.32.123.123">
                      <span class="icon is-small is-right">
                        <i class="fas fa-check"></i>
                      </span>
                    </div>
                    <p class="help is-success">This username is available</p>
                  </div>

                  <div class="field">
                    <label class="label">protocol</label>
                    <div class="control">
                      <div class="select">
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="field is-grouped">
                    <div class="control">
                      <button class="button is-link">Submit</button>
                    </div>
                    <div class="control">
                      <button class="button is-text">Cancel</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </article>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AddNeighbor'
  };
</script>

<style scoped>

</style>