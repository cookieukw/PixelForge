import * as IQ from "image-q";


self.onmessage = async event => {
    const { imageData, method } = event.data;
    const pointContainer = pointContainer.fromImageData(imageData);
    const scaledPoints = await IQ.utils.scale(pointContainer, { method, scale: 4 });
    self.postMessage(scaledPoints.toImageData());
};

