var grabcut = Module.cwrap('grabCut', 'number', ['number', 'number', 'number', 'number']);
function calculate(imagedata, scribbledata) {
    var size = imagedata.data.length * imagedata.data.BYTES_PER_ELEMENT;
    aliasImage(scribbledata);
    var imagePtr = Module._malloc(size);
    var scribblePtr = Module._malloc(size);
    console.log(size);
    var imageHeap = new Uint8Array(Module.HEAPU8.buffer, imagePtr, size);
    imageHeap.set(new Uint8Array(imagedata.data.buffer));
    var scribbleHeap = new Uint8Array(Module.HEAPU8.buffer, scribblePtr, size);
    scribbleHeap.set(new Uint8Array(scribbledata.data.buffer));
    var flow = grabcut(imageHeap.byteOffset, scribbleHeap.byteOffset, imagedata.height, imagedata.width);
    var resultData = new Uint8ClampedArray(imageHeap.buffer, imageHeap.byteOffset, imagedata.data.length);
    Module._free(imageHeap.byteOffset);
    Module._free(scribbleHeap.byteOffset);
    var inferencedata = new ImageData(imagedata.width, imagedata.height);
    inferencedata.data.set(resultData);
    return inferencedata;
}
function aliasImage(img) {
    var counter = 0;
    for (var i = 0; i < img.height * img.width * 4; i += 4) {
        if (img.data[i] <= 255 && img.data[i] > 128) {
            img.data[i] = 255;
            img.data[i + 1] = 0;
        }
        else if (img.data[i + 1] <= 255 && img.data[i + 1] > 0) {
            img.data[i] = 0;
            img.data[i + 1] = 255;
            counter++;
        }
        else {
            img.data[i] = 0;
            img.data[i + 1] = 0;
            img.data[i + 3] = 0;
        }
    }
    console.log("counter: " + counter);
}
function gray2color(grayImg) {
    var colorImg = new ImageData(grayImg.width, grayImg.height);
    colorImg.data.set(grayImg.data);
    var old_data = grayImg.data;
    var new_data = colorImg.data;
    for (var i = 0; i < grayImg.height * grayImg.width * 4; i += 4) {
        new_data[i] = 0;
        new_data[i + 2] = 0;
        if (old_data[i + 1] < 128) {
            new_data[i + 1] = 0;
            new_data[i + 3] = 0;
        }
        else {
            new_data[i + 1] = 255;
            new_data[i + 3] = 255;
        }
    }
    return colorImg;
}
