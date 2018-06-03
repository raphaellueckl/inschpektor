<template>
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <router-link to="/" class="navbar-brand">
      <figure class="image is-128x128" style="margin-left: 6px; margin-right: 6px">
        <img src="@/assets/logo.png">
      </figure>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </router-link>

    <div class="navbar-menu is-active">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">
          Dashboard
        </router-link>
        <div class="navbar-start">
          <router-link to="/manage" class="navbar-item">
            Manage
          </router-link>
          <router-link to="/login" class="navbar-item">
            Login
          </router-link>
          <router-link to="/about" class="navbar-item">
            About
          </router-link>
        </div>
      </div>
      <div class="navbar-end">
            <span class="navbar-item">
              subtangle index / milestone index
            </span>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Menu'
  };
</script>

<style scoped>

</style>