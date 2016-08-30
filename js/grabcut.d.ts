declare let grabcut: (imagePtr: number, scribblePtr: number, height: number, width: number) => number;
declare function calculate(imagedata: ImageData, scribbledata: ImageData): ImageData;
declare function aliasImage(img: ImageData): void;
declare function gray2color(grayImg: ImageData): ImageData;
