<template>
  <button class="button is-rounded" :class="[buttonType]" :disabled="disabled" @click="click()">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'RoundedButton',
    props: {
      click: Function,
      disabled: Boolean,
      type: String
    },
    data: function () {
      return {
        buttonType: this.type === 'ok' ? 'is-link' : this.type === 'danger' ? 'is-danger' : ''
      };
    }
  };
</script>

<style scoped>

</style>