<template>
  <div id="app">

    <Menu />

    <!--<section class="hero is-primary">-->
      <!--<div class="hero-body">-->
        <transition name="fade">
          <router-view/>
        </transition>
      <!--</div>-->
    <!--</section>-->

  </div>
</template>


<script>
  import Menu from './components/Menu'

  export default {
    name: 'app',
    components: {
      Menu
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

  .fade-enter-active {
    transition: opacity .8s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
