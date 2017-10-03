<template>
    <div class="image-uploader">
        <div class="container-image" @click="toggleModal">
            <div class="preview-image-overlap"><img :src="uploadIcon"></div>
            <img class="preview-image" :src="imgUrl"/>
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
                                        :update_image="updateImageOroxy"
                                        :call_back_image_url="call_back_image_url">
                                </change_image>
                            </slot>
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
                imgUrl: '',
                showModal: false,
                uploadIcon: uploadIcon(),
            }
        },
        mounted() {
            this.imgUrl = this.exist_image && this.exist_image.length > 1 && this.exist_image.indexOf('http') != -1 ? this.exist_image : defaultImage();
        },
        methods: {
            updateImage(val){
                this.imgUrl = val;
            },
            updateImageOroxy(val){
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

    h3 {
        font-size: 15px;
        letter-spacing: 2px;
        font-weight: 200;
    }

    .preview-image {
        width: 100%;
    }

    .preview-image:hover {
        border: solid 3px #3fe8a4;
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

    .modal-default-button {
        float: right;
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
        opacity: 0.3;
        z-index: 999;
        display: none;
    }

    .preview-image-overlap img {
        width: 100px;
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

    .button {
        background-color: rebeccapurple;
        border-radius: 3px;
        text-align: center;
        color: #fff;
        padding: 8px 0px;
        width: 120px;
    }

</style>
