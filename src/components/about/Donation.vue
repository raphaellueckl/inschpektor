<template>
  <article class="tile is-child notification">
    <qrcode-vue :value="dontationAddress()" :size="size" level="L"></qrcode-vue>
    <p>
      {{donation.address}}
    </p>
  </article>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';

  export default {
    name: 'Donation',
    props: ['address'],
    data() {
      return {
        size: 200,
        donation: {
          address:
          this.address,
          amount: 1000000,
          tag: 'inschpektor',
          message: 'I LOVE INSCHPEKTOR! <3'
        }
      };
    },
    methods: {
      dontationAddress() {
        return JSON.stringify(this.donation);
      }
    },
    components: {
      QrcodeVue
    }
  };
</script>

<style scoped>
</style>