<template>
  <button class="button is-rounded" :class="[buttonType]" :disabled="disabled" @click="click()">
    {{text}}
  </button>
</template>

<script>
  export default {
    name: 'RoundedButton',
    props: {
      click: Function,
      disabled: Boolean,
      text: String,
      type: String
    },
    data: function () {
      return {
        buttonType: this.type === 'ok' ? 'is-link' : ''
      };
    }
  };
</script>

<style scoped>

</style>