<template>
    <div id="app">
        <h1>Vue Uploader</h1>
        <div class="image-wrap">
            <image_modal
                    input_name="image_tag"
                    :exist_image="existImage"
                    set_ratio="2.2"/>
        </div>
        <p>click image</p>
    </div>
</template>

<script>
    import ImageModal from "./lib/ImageModal.vue"
    export default {
        name: 'app',
        data() {
            return {
                existImage: "",
            }
        },
        components: {
            'image_modal': ImageModal,
        }
    }
</script>

<style scoped>
    #app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    h1 {
        font-size: 22px;
        letter-spacing: 2px;
        font-weight: 200;
        color: #FF1461;
    }

    p {
        font-size: 15px;
        letter-spacing: 2px;
        font-weight: 200;
    }

    .image-wrap {
        width: 500px;
    }
</style>
