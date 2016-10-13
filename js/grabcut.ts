let grabcut: (imagePtr: number, scribblePtr: number, height: number, width: number) => number = Module.cwrap(
    'grabCut', 'number', ['number', 'number', 'number', 'number']
)

function calculate(imagedata: ImageData, scribbledata: ImageData): ImageData {
    let size = imagedata.data.length * imagedata.data.BYTES_PER_ELEMENT;
    aliasImage(scribbledata);
    let imagePtr = Module._malloc(size);
    let scribblePtr = Module._malloc(size);

    let imageHeap = new Uint8Array(Module.HEAPU8.buffer, imagePtr, size);
    imageHeap.set(new Uint8Array(imagedata.data.buffer));

    let scribbleHeap = new Uint8Array(Module.HEAPU8.buffer, scribblePtr, size);
    scribbleHeap.set(new Uint8Array(scribbledata.data.buffer));

    let flow = grabcut(imageHeap.byteOffset, scribbleHeap.byteOffset, imagedata.height, imagedata.width);
    let resultData = new Uint8ClampedArray(imageHeap.buffer, imageHeap.byteOffset, imagedata.data.length);

    Module._free(imageHeap.byteOffset);
    Module._free(scribbleHeap.byteOffset);

    let inferencedata = new ImageData(imagedata.width, imagedata.height);
    inferencedata.data.set(resultData);

    return inferencedata;
}

function aliasImage(img: ImageData) {
    let counter = 0;
    for (let i = 0; i < img.height * img.width * 4; i += 4) {
	if (img.data[i] > 0) {
	    img.data[i] = 255;
	    img.data[i + 1] = 0;
	} else if (img.data[i + 1] > 0) {
	    img.data[i] = 0;
	    img.data[i + 1] = 255;
	} else {
	    img.data[i] = 0;
	    img.data[i + 1] = 0;
	    // img.data[i + 3] = 0;
	}
    }
}

function gray2green(grayImg: ImageData): ImageData {
    let colorImg = new ImageData(grayImg.width, grayImg.height);
    colorImg.data.set(grayImg.data);
    let old_data = grayImg.data;
    let new_data = colorImg.data;
    for (var i = 0; i < grayImg.height * grayImg.width * 4; i += 4) {
	new_data[i] = 0;
	new_data[i + 2] = 0;
	if (old_data[i + 1] < 128) {
	    new_data[i + 1] = 0;
	    new_data[i + 3] = 0;
	} else {
	    new_data[i + 1] = 255;
	    new_data[i + 3] = 255;
	}
    }
    return colorImg;
}

function gray2color(grayImg: ImageData): ImageData {
    let colorImg = new ImageData(grayImg.width, grayImg.height);
    colorImg.data.set(grayImg.data);
    let old_data = grayImg.data;
    let new_data = colorImg.data;
    for (var i = 0; i < grayImg.height * grayImg.width * 4; i += 4) {
	new_data[i] = 0;
	new_data[i + 2] = 0;
	if (old_data[i + 1] < 128) {
	    new_data[i + 1] = 0;
	    new_data[i + 3] = 0;
	} else {
	    new_data[i + 1] = 0;
	    new_data[i + 3] = 128;
	}
    }
    return colorImg;
}

function image2mask(colourImg: ImageData): Uint8Array {
    let data = colourImg.data;
    let mask = new Uint8Array(Math.floor(data.length / 32));
    let store = 0;
    for (let i = 0; i < data.length/4; i++) {
	if (i % 8 == 0 && i > 0) {
	    mask[Math.floor(i / 8) - 1] = store;
	    store = 0;
	}
	let bit = (Number)(data[i * 4 + 3] > 0) & 1;
	store = (store << 1) | bit;
    }
    if (data.length % 8 != 0) {
	mask[Math.floor(data.length / 8)] = store;
    }
    return mask;
}
