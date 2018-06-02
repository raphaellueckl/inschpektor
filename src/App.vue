<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->

  <div id="app">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <figure class="image is-128x128" style="margin-left: 6px; margin-right: 6px">
          <img src="./assets/logo.png">
        </figure>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu is-active">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">
            Dashboard
          </router-link>
          <div class="navbar-start">
            <router-link to="/manage"  class="navbar-item">
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

    <router-view />


    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title">
          inschpektor
        </p>
        <p class="subtitle">
          Coming soon!
        </p>
      </div>
    </section>
  </div>
</template>


<script>
import HelloWorld from "./components/Manage.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
