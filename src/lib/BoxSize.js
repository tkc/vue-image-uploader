import {Setting} from './Config'
const boxW = Setting.Container.w, boxH = Setting.Container.h;

export const AdjustImageSize = (w, h) => {
    const rate = w / h;
    if (rate >= 1) {
        w = boxW;
        h = boxW / rate;
        if (h > boxH) {
            const limitRate = boxH / h;
            w *= limitRate;
            h *= limitRate;
        }
    } else {
        h = boxH;
        w = boxH * rate;
        if (w > boxW) {
            const limitRate = boxW / w;
            w *= limitRate;
            h *= limitRate;
        }
    }
    return {w: w, h: h}
};
