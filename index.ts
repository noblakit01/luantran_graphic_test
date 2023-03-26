import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion, Node, Mesh, TransformNode  } from 'babylonjs';
import { AdvancedDynamicTexture, Button, PlanePanel, Rectangle, Slider, StackPanel, TextBlock } from 'babylonjs-gui';
import 'babylonjs-loaders';
import {MeshEditor, ControlConfig} from './MeshEditor';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);
var gui = AdvancedDynamicTexture.CreateFullscreenUI("ui1", true, scene);
const meshEditor = new MeshEditor();
var icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {}, scene);

function applyBouncing(node: TransformNode, amplitude: number, duration: number) {
	const easingFunction = new BABYLON.BounceEase(4, 2);
	easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
	var animRotateRootNode = BABYLON.Animation.CreateAndStartAnimation(
        "Bouncing Effect",
		node,
		"position",
		30,
		30 * duration,
		new Vector3(node.position.x, node.position.y + amplitude, node.position.z),
		new Vector3(node.position.x, node.position.y, node.position.z),
		undefined,
		easingFunction
    );

	if (animRotateRootNode == null) {
		return
	}
	animRotateRootNode.loopAnimation = false;
}

function prepareScene() {
	// Camera
	const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, true);

	// Light
	new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);

	// Objects
	const plane = MeshBuilder.CreateBox("Plane", {}, scene);
	plane.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);
	plane.isPickable = true;

	icosphere.position.set(-2, 0, 0);
	icosphere.isPickable = true;

	const cylinder = MeshBuilder.CreateCylinder("Cylinder", {}, scene);
	cylinder.position.set(2, 0, 0);
	cylinder.isPickable = true;

	const planeControls: ControlConfig[] = [
		{
		  type: "width",
		  min: 0.1,
		  max: 2.0,
		  callback: (mesh, value) => {
			mesh.scaling.x = value;
		  },
		},
		{
		  type: "height",
		  min: 0.1,
		  max: 2.0,
		  callback: (mesh, value) => {
			mesh.scaling.y = value;
		  },
		},
		{
		  type: "depth",
		  min: 0.1,
		  max: 2.0,
		  callback: (mesh, value) => {
			mesh.scaling.z = value;
		  },
		},
	  ];
	  
	  const cylinderControls: ControlConfig[] = [
		{
		  type: "diameter",
		  min: 0.1,
		  max: 2.0,
		  callback: (mesh, value) => {
			mesh.scaling.x = value;
			mesh.scaling.z = value;
		  },
		},
		{
		  type: "height",
		  min: 0.1,
		  max: 2.0,
		  callback: (mesh, value) => {
			mesh.scaling.y = value;
		  },
		},
	  ];
	  
	  const icosphereControls: ControlConfig[] = [
		{
		  type: "diameter",
		  min: 0.1,
		  max: 2.0,
		  callback: (mesh, value) => {
			mesh.scaling.x = value;
			mesh.scaling.y = value;
			mesh.scaling.z = value;
		  },
		},
		{
		  type: "subdivisions",
		  min: 1,
		  max: 10,
		  callback: (mesh, value) => {
			icosphere.dispose();
			icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", { subdivisions: value }, scene);
			icosphere.position.set(-2, 0, 0);
			icosphere.isPickable = true;
		  },
		},
	  ];

	const planeUI = meshEditor.createMeshUI(plane, planeControls);
	const cylinderUI = meshEditor.createMeshUI(cylinder, cylinderControls);
	const icosphereUI = meshEditor.createMeshUI(icosphere, icosphereControls);

	gui.addControl(planeUI);
	gui.addControl(cylinderUI);
	gui.addControl(icosphereUI);

	planeUI.linkWithMesh(plane);
	cylinderUI.linkWithMesh(cylinder);
	icosphereUI.linkWithMesh(icosphere);

	scene.onPointerDown = ((event, object) => {
		const name = object.pickedMesh?.name;
		if (name == "Plane") {
			planeUI.isVisible = !planeUI.isVisible;
		} else if (name == "Cylinder") {
			cylinderUI.isVisible = !cylinderUI.isVisible;
		} else if (name == "IcoSphere") {
			icosphereUI.isVisible = !icosphereUI.isVisible;
		}
	});

	var icosphereNode = new TransformNode("icosphereNode"); 
    icosphere.parent = icosphereNode;
	applyBouncing(icosphereNode, 10, 5);
}

prepareScene();

engine.runRenderLoop(() => {
	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
})