package ovh.mvasilkov.gearvrthing;

import android.graphics.Color;

import org.gearvrf.GVRCameraRig;
import org.gearvrf.GVRContext;
import org.gearvrf.GVRMain;
import org.gearvrf.GVRScene;

class Program extends GVRMain {
    private GVRContext c;

    @Override
    public void onInit(GVRContext gvrContext) {
        c = gvrContext;

        GVRScene scene = c.getMainScene();
        GVRCameraRig cameraRig = scene.getMainCameraRig();
        cameraRig.getLeftCamera().setBackgroundColor(Color.WHITE);
        cameraRig.getRightCamera().setBackgroundColor(Color.WHITE);
    }

    @Override
    public void onStep() {
    }
}
