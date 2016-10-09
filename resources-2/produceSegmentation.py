import os
from scipy.io import loadmat
from PIL import Image
import numpy as np

dirs = os.listdir("segmentation")

for dir in dirs:
    produce_dir = os.path.join("segmentation", dir, "probmaps")
    for model in ["coco", "pascal"]:
        file = os.path.join(produce_dir, "model_%s_obj0.mat"%model)
        print(file)
        data = loadmat(file)["segmentations"].ravel()
        for i in range(data.size):
            Image.fromarray(data[i].astype(np.uint8)*255).save(os.path.join(produce_dir, "seg_%s_%i.png"%(model, i)))
