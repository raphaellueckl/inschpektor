<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Authentication</h1>
        <h2 class="subtitle">
          To view / edit your neighbors, you need to login first.
        </h2>

        <div class="columns is-mobile">
          <div class="column is-three-fifths is-offset-one-fifth">
            <div class="field">
              <label class="label">Account</label>
              <div class="control">
                <input class="input" type="text" placeholder="Username">
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input class="input" type="text" placeholder="Provide your password...">
              </div>
            </div>
            <div class="field">
              <p class="control">
                <button class="button is-success">
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'Login'
  };
</script>

<style scoped>

</style>