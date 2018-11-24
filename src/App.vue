<template>
  <div id="app">
    <Menu/>
    <section class="section">
      <div class="container">
        <transition name="fade">
          <Error v-if="nodeError" :code="nodeError"/>
          <router-view v-else/>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Menu from './components/Menu';
  import Error from './components/error/Error';

  export default {
    name: 'app',
    components: {
      Error,
      Menu
    },
    created() {
      this.$store.dispatch('login');
      this.$store.dispatch('checkForVersionUpdate');
      this.$store.dispatch('loadPeriodically');

      setInterval(() => {
        this.$store.dispatch('loadPeriodically');
      }, 10000);
    },
    computed: {
      ...mapGetters(['nodeError'])
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
    transition: opacity 0.8s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
