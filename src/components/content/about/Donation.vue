<template>
  <article class="tile is-child notification">
    <qrcode-vue :value="dontationAddress()" :size="size" level="L" class="qr-code"></qrcode-vue>
    <p>
      <strong>IOTA:</strong>
      {{ donation.address }}
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
        address: this.address,
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

<style>
p {
  word-wrap: break-word;
}

article {
  background: rgb(0, 0, 0, 0);
}

.qr-code:hover > canvas {
  animation: present 1s;
  animation-fill-mode: forwards;
}

.qr-code > canvas {
  animation: presentBack 1s;
  animation-fill-mode: forwards;
}

@keyframes present {
  0% {
    transform: scaleX(1) scaleY(1);
  }
  100% {
    transform: scaleX(1.05) scaleY(1.05);
  }
}

@keyframes presentBack {
  0% {
    transform: scaleX(1.05) scaleY(1.05);
  }
  100% {
    transform: scaleX(1) scaleY(1);
  }
}
</style>
