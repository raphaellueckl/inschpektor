<template>
  <div>
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="animated-info-text">
      There might be a problem getting data from your node. If you access it remotely, please don't forget to allow at least the reading commands.
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NoContent'
  };
</script>

<style scoped>
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 110px;
    height: 60px;
  }

  .lds-ellipsis div {
    position: absolute;
    top: 27px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #000;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .lds-ellipsis div:nth-child(1) {
    left: 20px;
    animation: lds-ellipsis1 0.6s infinite;
  }

  .lds-ellipsis div:nth-child(2) {
    left: 20px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  .lds-ellipsis div:nth-child(3) {
    left: 50px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  .lds-ellipsis div:nth-child(4) {
    left: 80px;
    animation: lds-ellipsis3 0.6s infinite;
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  @keyframes lds-ellipsis2 {
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