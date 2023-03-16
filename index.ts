import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion, Node, Mesh, TransformNode  } from 'babylonjs';
import { AdvancedDynamicTexture, Button, PlanePanel, Rectangle, Slider, StackPanel, TextBlock } from 'babylonjs-gui';
import 'babylonjs-loaders';
import gsap, { Bounce } from 'gsap';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);
var gui = AdvancedDynamicTexture.CreateFullscreenUI("ui1", true, scene);
var icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {}, scene);

function applyBouncing(node: TransformNode, amplitude: number, duration: number) {
	node = node.setAbsolutePosition(new Vector3(node.position.x, node.position.y + amplitude, node.position.z));
	gsap.to(node.position, {duration: duration, y: 0, repeat: 0, yoyo: true, ease: Bounce.easeOut});
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

	// GUI
	const planeUI = new StackPanel("plane UI");
	planeUI.background = "black";
	planeUI.height = "80px";
	planeUI.width = "120px";
	planeUI.alpha = .5;

	const widthSlider = new Slider("width");
	widthSlider.minimum = 0.1;
	widthSlider.maximum = 2.0;
	widthSlider.name = "Width:"
	widthSlider.height = "20px";
	widthSlider.onValueChangedObservable.add(function(value) {
		plane.scaling.x = value;
    });

	var heightSlider = new Slider("height");
	heightSlider.minimum = 0.1;
	heightSlider.maximum = 2.0;
	heightSlider.name = "Width:"
	heightSlider.height = "20px";
	heightSlider.onValueChangedObservable.add(function(value) {
		plane.scaling.y = value;
    });

	var depthSlider = new Slider("depth");
	depthSlider.minimum = 0.1;
	depthSlider.maximum = 2.0;
	depthSlider.name = "Width:"
	depthSlider.height = "20px";
	depthSlider.onValueChangedObservable.add(function(value) {
		plane.scaling.z = value;
    });

    gui.addControl(planeUI);
	planeUI.linkWithMesh(plane);
	
	planeUI.addControl(widthSlider);
	planeUI.addControl(heightSlider);
	planeUI.addControl(depthSlider);
	planeUI.isVisible = false;

	// GUI: Cylinder
	const cylinderUI = new StackPanel("Cylinder UI");
	cylinderUI.background = "black";
	cylinderUI.height = "80px";
	cylinderUI.width = "120px";
	cylinderUI.alpha = .5;

	const diameterCylinderSlider = new Slider("diameterCylinderSlider");
	diameterCylinderSlider.minimum = 0.1;
	diameterCylinderSlider.maximum = 2.0;
	diameterCylinderSlider.name = "Diameter Cylinder:"
	diameterCylinderSlider.height = "20px";
	diameterCylinderSlider.onValueChangedObservable.add(function(value) {
		cylinder.scaling.x = value;
		cylinder.scaling.z = value;
    });

	var heightCylinderSlider = new Slider("heightCylinderSlider");
	heightCylinderSlider.minimum = 0.1;
	heightCylinderSlider.maximum = 2.0;
	heightCylinderSlider.name = "Height Cylinder:"
	heightCylinderSlider.height = "20px";
	heightCylinderSlider.onValueChangedObservable.add(function(value) {
		cylinder.scaling.y = value;
    });

	// GUI: icosphere
	const icosphereUI = new StackPanel("icosphere UI");
	icosphereUI.background = "black";
	icosphereUI.height = "80px";
	icosphereUI.width = "120px";
	icosphereUI.alpha = .5;

	const diameterIcosphereSlider = new Slider("diameterIcosphereSlider");
	diameterIcosphereSlider.minimum = 0.1;
	diameterIcosphereSlider.maximum = 2.0;
	diameterIcosphereSlider.name = "Diameter icosphere:"
	diameterIcosphereSlider.height = "20px";
	diameterIcosphereSlider.onValueChangedObservable.add(function(value) {
		icosphere.scaling.x = value;
		icosphere.scaling.y = value;
		icosphere.scaling.z = value;
    });

	var subdivisionsSlider = new Slider("subdivisionsSlider");
	subdivisionsSlider.minimum = 1;
	subdivisionsSlider.maximum = 10;
	subdivisionsSlider.name = "subdivisions Cylinder:"
	subdivisionsSlider.height = "20px";
	subdivisionsSlider.onValueChangedObservable.add(function(value) {
		icosphere.dispose();
		icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {subdivisions: value}, scene);
		icosphere.position.set(-2, 0, 0);
		icosphere.isPickable = true;
    });

    gui.addControl(planeUI);
	planeUI.linkWithMesh(plane);
	planeUI.addControl(widthSlider);
	planeUI.addControl(heightSlider);
	planeUI.addControl(depthSlider);
	planeUI.isVisible = false;

	gui.addControl(cylinderUI);
	cylinderUI.linkWithMesh(cylinder);
	cylinderUI.addControl(diameterCylinderSlider);
	cylinderUI.addControl(heightCylinderSlider);
	cylinderUI.isVisible = false;

	gui.addControl(icosphereUI);
	icosphereUI.linkWithMesh(icosphere);
	icosphereUI.addControl(diameterIcosphereSlider);
	icosphereUI.addControl(subdivisionsSlider);
	icosphereUI.isVisible = false;


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