<template>
    <section>
        <div :class="[normalMode ? nonActiveClass : activeClass]" id="area-edit">
            <div class="container" :style="{'width': containerSize.w+'px', 'height': containerSize.h+'px'}">
                <div :id="idImgContainer" :class="imgContainerClass">
                    <img :id="idClipSrcImg" :src="img" :style="imgStyle">
                    <img :id="idClipSrcImgShadow" @load="srcImgLoaded" :src="img" style="display: none">
                    <div :class="shadowBoxClass"></div>
                    <Select-Box ref="box" :srcSize="imageConvertSize" :ratio="ratio" :img="img"></Select-Box>
                </div>
            </div>
            <div class="actions">
                <div class="save-button" @click="save">save</div>
                <div class="save-button" @click="cancel">cancel</div>
            </div>
        </div>

        <input type="file"
               :id="idFileInput"
               class="no_display"
               accept="image/jpeg,image/png,image/jpg,image/gif"
               @change="fileChange">
        <input type="hidden" :name="input_name" :value="hiddenImgUrl">
    </section>
</template>

<script>

    import shortid from 'shortid'
    import SelectBox from './SelectBox.vue'
    import {Setting} from './Config'
    import {SaveDataUrl} from './S3';
    import {AdjustImageSize} from './BoxSize';

    export default {
        props: [
            'update_image',
            'exist_image',
            'input_name',
            'set_ratio',
            'call_back_image_url',
            'close_modal'
        ],
        components: {
            SelectBox
        },
        data() {
            return {

                // boxSizes
                containerSize: {
                    w: Setting.Container.w,
                    h: Setting.Container.h,
                },

                imageNaturalSize: {
                    w: 0,
                    h: 0,
                    rate: 0
                },

                imageConvertSize: {
                    w: 0,
                    h: 0,
                },

                recSize: {
                    w: 0,
                    h: 0,
                    l: 0,
                    t: 0
                },

                // Mode
                normalMode: true,

                // Id
                idFileInput: this.hashId() + "_file_input",
                idClipSrcImg: this.hashId() + "_clip_src_img",
                idClipSrcImgShadow: this.hashId() + "_clip_src_img_shadow",
                idContainer: this.hashId() + "_container",
                idImgContainer: this.hashId() + "_img_container",

                // Class
                activeClass: 'active',
                nonActiveClass: 'not-active',
                imgContainerClass: 'img-container-wrap',
                shadowBoxClass: 'shadow-box',

                // Data
                dataImage: "",
                hiddenImgUrl: "",
                img: "",

                // Element
                $srcImg: {},
                $input: {},
                $imgContainer: {},

                // Ratio
                ratio: this.set_ratio ? this.set_ratio : 1,
            }
        },
        computed: {
            imgStyle() {
                return `width:${this.imageConvertSize.w}px;height:${this.imageConvertSize.h}px;`
            },
        },
        mounted() {
            this.$input = document.getElementById(this.idFileInput);
            this.$srcImg = document.getElementById(this.idClipSrcImg);
            this.$imgContainer = document.getElementById(this.idImgContainer);
            this.imageChange();
        },
        methods: {
            hashId() {
                return shortid.generate().replace(/[A-Z]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) | 32));
            },
            imageChange() {
                this.$input.click();
            },
            fileChange() {
                const fd = new FileReader();
                fd.onloadend = () => this.img = fd.result;
                this.$input.files && this.$input.files[0] ? fd.readAsDataURL(this.$input.files[0]) : null;
                this.normalMode = !this.normalMode;
            },
            srcImgLoaded() {
                this.imageNaturalSize.w = this.$srcImg.naturalWidth;
                this.imageNaturalSize.h = this.$srcImg.naturalHeight;
                this.imageNaturalSize.rate = this.imageNaturalSize.w / this.imageNaturalSize.h;
                this.clearSelect();
                this.setImgSize();
            },
            clearSelect() {
                const box = this.$refs.box;
                box.clearRec()
            },
            setImgSize() {

                const adjustImageSize = AdjustImageSize(this.imageNaturalSize.w, this.imageNaturalSize.h);
                this.imageConvertSize.w = adjustImageSize.w;
                this.imageConvertSize.h = adjustImageSize.h;

                if (this.ratio > 1) {
                    this.recSize.w = this.imageConvertSize.w / 2;
                    this.recSize.h = this.recSize.w / this.ratio;
                    this.recSize.l = (this.imageConvertSize.w - this.recSize.w ) / 2;
                    this.recSize.t = (this.imageConvertSize.h - this.recSize.h) / 2;
                } else {
                    this.recSize.h = this.imageConvertSize.h / 2;
                    this.recSize.w = this.recSize.h * this.ratio;
                    this.recSize.l = (this.imageConvertSize.w - this.recSize.w) / 2;
                    this.recSize.t = (this.imageConvertSize.h - this.recSize.h) / 2;
                }

                const box = this.$refs.box;
                box.rec = this.recSize;
                box.updateRec();
            },
            getComputedRec(rec) {
                const rateW = this.imageConvertSize.w / rec.w;
                const rateH = this.imageConvertSize.h / rec.h;
                const totalW = this.imageNaturalSize.w * (rec.w / this.imageNaturalSize.w);
                const totalH = this.imageNaturalSize.h * (rec.h / this.imageNaturalSize.h);
                return {
                    l: -rec.l,
                    t: -rec.t,
                    w: totalW * rateW,
                    h: totalH * rateH
                }
            },
            cancel() {
                this.normalMode = !this.normalMode;
                this.close_modal();
            },
            setData(fileURL) {
                this.hiddenImgUrl = fileURL;
                if ('undefined' != typeof this.update_image) {
                    this.update_image(fileURL);
                }
                if ('undefined' != typeof this.call_back_image_url) {
                    this.call_back_image_url(fileURL);
                }
            },
            save() {
                let rec = this.$refs.box.rec;

                if (!rec.w || !rec.h) {
                    return
                }

                const fileName = new Date().getTime() + ".jpg";
                const bufferCanvas = document.createElement('canvas');
                const bfx = bufferCanvas.getContext('2d');
                const computedRec = this.getComputedRec(rec);

                bufferCanvas.width = rec.w;
                bufferCanvas.height = rec.h;
                bfx.drawImage(this.$srcImg, computedRec.l, computedRec.t, computedRec.w, computedRec.h);
                const dataImage = bufferCanvas.toDataURL('image/jpeg', 1);

                // S3
                if (Setting.S3.Enable) {
                    SaveDataUrl(fileName, dataImage, 'image/jpeg').then(fileURL => {
                        this.setData(fileURL);
                        this.normalMode = !this.normalMode;
                    })
                } else {
                    this.setData(dataImage);
                    this.normalMode = !this.normalMode;
                }
                this.close_modal();
            }
        }
    }
</script>

<style scoped>

    .active {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .not-active {
        display: none;
    }

    .actions {
        display: flex;
        justify-content: center;
        padding: 0px;
        list-style: none;

        font-size: 10px;
        letter-spacing: 2px;
        font-weight: 200;
    }

    .actions div {
        margin: 10px 10px;
    }

    .save-button {
        border: solid 3px #3fe8a4;
        padding: 5px 0px;
        font-size: 15px;
        background: none;
        color: #3fe8a4;
        border-radius: 3px;
        width: 150px;
        text-align: center;
        margin-top: 25px;
    }

    .save-button:hover {
        background: #A6FF8F;
        color: #fff;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: solid;
        background: #efefef;
        border-radius: 2px;
    }

    .img-container-wrap {
        display: flex;
        align-items: center;
        position: relative;
    }

    .display_img {
        position: relative;
        width: 100%;
        top: 0px;
        left: 0px;
    }

    .shadow-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 1;
    }

    .no_display {
        display: none;
    }

</style>
