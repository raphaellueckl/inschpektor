<template>
  <div id="app">
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <figure class="image is-128x128">
          <img src="./assets/logo.png">
        </figure>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            Dashboard
          </a>
        </div>
        <div class="navbar-end">
          <a class="navbar-item">
            subtangle index / milestone index
          </a>
        </div>
      </div>
    </nav>


    <section class="hero is-primary" style="margin-top: 130px">
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
  import HelloWorld from './components/HelloWorld.vue'

  export default {
    name: 'app',
    components: {
      HelloWorld
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
