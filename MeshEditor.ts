import { Mesh  } from 'babylonjs';
import { Control, Slider, StackPanel, TextBlock } from 'babylonjs-gui';

export interface ControlConfig {
    type: string;
    min: number;
    max: number;
    callback?: (mesh: Mesh, value: number) => void;
};

export class MeshEditor {
    
    constructor() {}
    
    createMeshUI(mesh: Mesh, controls: ControlConfig[]): StackPanel {
      const meshUI = new StackPanel(`${mesh.name} UI`);
      const minHeight = 40 * controls.length + 10;
      meshUI.height = `${minHeight}px`;
      meshUI.background = "black";
      meshUI.width = "160px";
      meshUI.alpha = 0.5;

      controls.forEach((control) => {
        const panel = new StackPanel();
        panel.width = "100%";
        panel.height = "40px";

        const label = new TextBlock(`${control.type}Label`, control.type + ":");
        label.width = "120px";
        label.height = "20px";
        label.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.addControl(label);

        const slider = new Slider(`${control.type}Slider`);
        slider.minimum = control.min;
        slider.maximum = control.max;
        slider.height = "20px";
        slider.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider.onValueChangedObservable.add((value) => {
            control.callback?.(mesh, value);
        });
        panel.addControl(slider);

        meshUI.addControl(panel);
      });

      meshUI.isVisible = false;
  
      return meshUI;
    }
}
  