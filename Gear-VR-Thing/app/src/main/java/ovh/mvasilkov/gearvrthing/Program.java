package ovh.mvasilkov.gearvrthing;

import android.graphics.Color;

import org.gearvrf.GVRAndroidResource;
import org.gearvrf.GVRCameraRig;
import org.gearvrf.GVRContext;
import org.gearvrf.GVRMain;
import org.gearvrf.GVRMaterial;
import org.gearvrf.GVRScene;
import org.gearvrf.GVRSceneObject;
import org.gearvrf.GVRTexture;
import org.gearvrf.scene_objects.GVRCubeSceneObject;

class Program extends GVRMain {
    private GVRContext c;
    private GVRSceneObject object;

    @Override
    public void onInit(GVRContext gvrContext) {
        c = gvrContext;

        GVRScene scene = c.getMainScene();
        GVRCameraRig cameraRig = scene.getMainCameraRig();
        cameraRig.getLeftCamera().setBackgroundColor(Color.WHITE);
        cameraRig.getRightCamera().setBackgroundColor(Color.WHITE);

        GVRTexture texture = c.loadTexture(new GVRAndroidResource(c, R.mipmap.rei));
        GVRMaterial material = new GVRMaterial(c);
        material.setMainTexture(texture);

        object = new GVRCubeSceneObject(c, true, material);
        object.getTransform().setPosition(0, -1, -3);
        scene.addSceneObject(object);
    }

    @Override
    public void onStep() {
        if (object != null) {
            object.getTransform().rotateByAxis(1, 0.1f, 0.2f, 0.3f);
        }
    }
}
