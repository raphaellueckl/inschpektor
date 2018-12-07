<template>
  <button class="button is-rounded" :class="[isLoading ? 'is-loading' : '', buttonType]" :disabled="disabled" @click="click(); isLoading = true">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'RoundedButton',
    props: {
      click: Function,
      disabled: Boolean,
      type: String,
      spin: Number
    },
    data: function () {
      return {
        isLoading: false,
        buttonType: this.type === 'ok' ? 'is-link' : this.type === 'danger' ? 'is-danger' : ''
      };
    },
  };
</script>

<style scoped>

</style>