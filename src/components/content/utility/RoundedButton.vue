<template>
  <button class="button is-rounded" :class="[isLoading ? 'is-loading' : '', buttonType]" :disabled="disabled"
          @click="click(); showSpinner()">
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
    methods: {
      showSpinner() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false
        }, this.spin ? this.spin : 500);
      },
    }
  };
</script>

<style scoped>

</style>