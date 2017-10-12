<template>
  <div class="image-uploader">
    <div class="container-image" @click="toggleModal">
      <div class="preview-image-overlap">
        <img class="upload_icon" :src="uploadIcon">
      </div>
      <img class="preview-image" :src="imgUrl"/>
      <input type="hidden" :name="input_name" :value="imgUrl">
    </div>
    <transition name="modal" v-if="showModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <h3>change image</h3>
            </div>
            <div class="modal-body">
              <slot name="body">
                <change_image
                  :close_modal="toggleModalProxy"
                  :set_ratio="set_ratio"
                  :update_image="updateImageProxy"
                  :call_back_image_url="call_back_image_url">
                </change_image>
              </slot>
            </div>
            <div class="modal-footer">
              <p @click="toggleModal">close</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

  import ChangeImage from './ChangeImage.vue'
  import {uploadIcon} from './DefaultImage'
  import {defaultImage} from './DefaultImage'

  export default {
    props: [
      'exist_image',
      'input_name',
      'set_ratio',
      'call_back_image_url'
    ],
    components: {
      change_image: ChangeImage
    },
    data() {
      return {
        imgUrl: defaultImage(),
        showModal: false,
        uploadIcon: uploadIcon(),
      }
    },
    mounted() {
      if (this.exist_image && this.exist_image.length > 1) {
        this.imgUrl = this.exist_image;
      }
    },
    methods: {
      updateImage(val) {
        this.imgUrl = val;
        if (typeof this.call_back_image_url === "object") {
          this.call_back_image_url(val);
        }
      },
      updateImageProxy(val) {
        this.updateImage(val)
      },
      toggleModal() {
        this.showModal = !this.showModal;
      },
      toggleModalProxy() {
        this.toggleModal();
      }
    }
  }
</script>

<style scoped>

  * {
    box-sizing: unset;
    line-height: 1;
  }

  h3 {
    font-size: 15px;
    letter-spacing: 2px;
    font-weight: 200;
  }


  .preview-image {
    width: 100%;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 50%;
    min-width: 600px;
    margin: 0px auto;
    padding: 30px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header {
    border-bottom: solid 1px #eee;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .preview-image-overlap {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    left: 0px;
    top: 0px;
    background: #000;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.5;
    z-index: 999;
    display: none;
  }

  img {
    max-width: none !important;
  }

  .preview-image-overlap .upload_icon {
    width: 30px !important;
    height: 30px !important;
    border: none !important;
  }

  .container-image {
    position: relative;
    width: 100%;
    margin: 0px;
    padding: 0px;
  }

  .container-image:hover > .preview-image-overlap {
    display: flex;
  }

  .container-image:hover > .preview-image {
    -webkit-filter: blur(2px);
    -moz-filter: blur(2px);
    -o-filter: blur(2px);
    -ms-filter: blur(2px);
    filter: blur(2px);
  }

  button {
    background: none;
    color: #000;
    padding: 0px 30px;
  }
</style>

