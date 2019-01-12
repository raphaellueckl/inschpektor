<template>
  <div>
    <div class="loading-animation">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="animated-info-text">
      There might be a problem getting data from your node. If you access it remotely, please do not forget to allow at least the reading commands on your IRI.
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NoContent'
  };
</script>

<style scoped>
  .loading-animation {
    display: inline-block;
    position: relative;
    width: 110px;
    height: 60px;
  }

  .loading-animation div {
    position: absolute;
    top: 24px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #000;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .loading-animation div:nth-child(1) {
    left: 20px;
    animation: loading-animation1 0.6s infinite;
  }

  .loading-animation div:nth-child(2) {
    left: 20px;
    animation: loading-animation2 0.6s infinite;
  }

  .loading-animation div:nth-child(3) {
    left: 50px;
    animation: loading-animation2 0.6s infinite;
  }

  .loading-animation div:nth-child(4) {
    left: 80px;
    animation: loading-animation3 0.6s infinite;
  }

  @keyframes loading-animation1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes loading-animation3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  @keyframes loading-animation2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(30px, 0);
    }
  }

  .animated-info-text {
    opacity: 0;
    animation-name: fadein;
    animation-timing-function: linear;
    animation-duration: 1s;
    animation-delay: 5s;
    animation-fill-mode: forwards;
  }

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
</style>