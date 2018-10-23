<template>
  <div>
    <img src="../../assets/logo.png">
    <p>
      This is an open source app, that can be found @ <a href="https://github.com/codepleb/inschpektor">Github</a>.
    </p>
    <p>
      The application is based on Vuejs.
    </p>
    <br>
    <p>
      If you would like to contribute: I'd love to get your pullrequests. :)
    </p>
    <p>
      Hit me up on telegram: @codepleb
    </p>
    <br>
    <br>
    <h3 class="title is-3">Donations</h3>
    <p>If you like this app and you want to support me, use the following IOTA address:</p>

    <Donation address="IPXS9YLKJMODKUBHOXRHSUOMWYCBAKYGRCNLH9RAEP9NXRXXYPGBZBVQQWCMLNOHZQRTOGIRMTISGXAVAGASBFLAUB" class="asd"/>

    <br>
    <p>
      If you prefer another coin, you can have a look at the other options over @
      <a target="_blank" href="https://codepleb.net/donations">codepleb.net</a>
    </p>
  </div>
</template>

<script>
  import Donation from './Donation';

  export default {
    name: 'About',
    components: {
      Donation
    }
  };
</script>

<style scoped>
</style>