<template>
  <div>
    <div class="modal" :class="{'is-active': openModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Are you sure?</p>
          <button class="delete" aria-label="close" @click="openModal=false"></button>
        </header>
        <section class="modal-card-body">
          {{modalText}}
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="click(); openModal=false">Yes</button>
          <button class="button" @click="openModal=false">Cancel</button>
        </footer>
      </div>
    </div>

    <button class="button is-rounded" :class="[isLoading ? 'is-loading' : '', buttonType]" :disabled="disabled"
            @click="modalText ? openModal = true : click(); showSpinner()">
      <slot></slot>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'RoundedButton',
    props: {
      click: Function,
      disabled: Boolean,
      type: String,
      spin: Number,
      modalText: String
    },
    data: function () {
      return {
        isLoading: false,
        buttonType: this.type === 'ok' ? 'is-link' : this.type === 'danger' ? 'is-danger' : '',
        openModal: false
      };
    },
    methods: {
      showSpinner() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, this.spin ? this.spin : 500);
      },
    }
  };
</script>

<style scoped>

</style>