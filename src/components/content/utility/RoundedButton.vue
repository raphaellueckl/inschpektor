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
          <button class="button is-success" @click="click(); openModal=false; showSpinner()">Yes</button>
          <button class="button" @click="openModal=false">Cancel</button>
        </footer>
      </div>
    </div>

    <button class="button is-rounded" :class="[isLoading ? 'is-loading' : '', buttonType]" :disabled="disabled"
            @click="buttonClicked()">
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
      spin: String,
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
      buttonClicked() {
        if (this.modalText) {
          this.openModal = true;
        } else {
          this.click();
          this.showSpinner();
        }
      },
      showSpinner() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, this.spin ? Number(this.spin) : 500);
      },
    }
  };
</script>

<style scoped>
  .modal-card-body {
    color: #000;
  }
</style>