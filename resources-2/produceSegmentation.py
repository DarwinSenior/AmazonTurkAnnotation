import os
from scipy.io import loadmat
import os
from PIL import Image
import numpy as np

dirs = os.listdir("segmentation")
x = "./segmentation/ILSVRC2015_val_00006005/visuals/segmentations/segmentation-coco-deconvet-obj0.avi"

for dir in dirs:
    produce_dir = os.path.join("segmentation", dir, "probmaps")
    video_dir = os.path.join("segmentation", dir, "visuals", "segmentations")
    for model in ["coco", "pascal"]:
        file_name = os.path.join(video_dir, "segmentation-%s-deconvet-obj0"%model)
        os.system("ffmpeg -i %s.avi %s.mp4"%(file_name, file_name))
        file = os.path.join(produce_dir, "model_%s_obj0.mat"%model)
        print(file)
        data = loadmat(file)["segmentations"].ravel()
        for i in range(data.size):
            Image.fromarray(data[i].astype(np.uint8)*255).save(os.path.join(produce_dir, "seg_%s_%i.png"%(model, i)))
    file = open(os.path.join("segmentation", dir, "count"), "w")
    file.write(str(data.size))
    file.close()
