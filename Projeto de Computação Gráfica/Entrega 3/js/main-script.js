///////////////////////
/* GLOBAL VARIABLES */
/////////////////////

var camera, scene, renderer, stereoCamera, displacement;
var fieldTexture, skydomeTexture;
var fieldMesh, skydomeMesh;
var skydomeMaterial, fieldMaterial;
var lightOn = true;
var arrowKeys = { left: false, right: false, up: false, down: false };
var directionalLight, spotlight, pointlight, ovni, mesh, line;
var terrainCutout;
var moon, tree1, tree2;
var meshes = [];

var materialsB = [  // basic mesh
    new THREE.MeshBasicMaterial({ color: 0xf7f49e }),
    new THREE.MeshBasicMaterial({ color: 0x9be59b }),
    new THREE.MeshBasicMaterial({ color: 0x1b1464 }),
    new THREE.MeshBasicMaterial({ color: 0x4d3313 }),
    new THREE.MeshBasicMaterial({ color: 0x006400 }),
    new THREE.MeshBasicMaterial({ color: 0x00000 }),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x808080 }),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    new THREE.MeshBasicMaterial({ color: 0xcb4e05}),
    new THREE.MeshBasicMaterial({ color: 0xffffff}),
    new THREE.MeshBasicMaterial({ color: 0xcb4e05}),
    new THREE.MeshBasicMaterial({ color: 0x1c46c2}) 
];

const roofVertices1 = new Float32Array([ // create the roof geometry 
    -11, 2, -12,  
    -9, 2, -10, 
    -10, 5, -12 
]);

const roofVertices2 = new Float32Array([ // create the roof geometry 
    -24.9, 2, -12,  
    -10, 1, -10, 
    -8.9,5.25, -12 
]);

const roofVertices3 = new Float32Array([ // create the roof geometry 
    -9, 5, -12,  
    -21, 4.85, -10, 
    -24.9, 2, -12 
]);

const wallVertices1 = new Float32Array([ // create the walls geometry
    0, -1, 0, 
    -10, -1, 0,   
    0, 5, 0    
]);

const wallVertices2 = new Float32Array([ // create the walls geometry
    -10, -1, 0, 
    -10, 5, 0,   
    0, 5, 0    
]);

const wallVertices3 = new Float32Array([ // create the walls geometry
    -0.05, 2.1, -12, 
    -1.08, 0.5, -1,   
    -1.07, -5.65, 0    
]);

const wallVertices4 = new Float32Array([ // create the walls geometry
    -0.05, 2.1, -12, 
    0.35, -5, 0,   
    -0.6, -5, 6    
]);

const doorVertices1 = new Float32Array([ // create the door geometry
    -1.75, 0, 0,
    -1.75, 4, 0,
    0, 4, 0
]);

const doorVertices2 = new Float32Array([ // create the door geometry
    -1.75, 0, 0,
    0, 0, 0,
    0, 4, 0
]);

const windowVertices1 = new Float32Array([  // create the window geometry
    -8, 0, 0,
    -8, 2, 0,
    -6, 2, 0
]);

const windowVertices2 = new Float32Array([  // create the window geometry
    -3, 0, 0,
    -5, 0, 0,
    -3, 2, 0
]);

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(50));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';

    var aspectRatio = window.innerWidth / window.innerHeight;

    // creating perspective camera
    camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 100);
    camera.position.set(0, 0, 20);
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';

    // create ambient
    var ambientLight = new THREE.AmbientLight(0xeeffa8, 0.5);
    scene.add(ambientLight);
}

/////////////////////
/* CREATE SCENARIO */
/////////////////////
function createMoon(x, y, z) {
    'use strict';

    moon = new THREE.Object3D();

    addMoon(moon, 12, 10, -9);
    addDirectionalLight(moon, 12, 10, -9);

    moon.position.set(x, y, z);
    scene.add(moon);
}

function addMoon(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(4, 100, 100);    
    var mesh1 = new THREE.Mesh(geometry, materialsB[0]);
    mesh1.position.set(x, y, z);
    obj.add(mesh1);
    meshes.push(mesh1);
}

function addDirectionalLight(obj, x, y, z) {
    'use strict';

    directionalLight = new THREE.DirectionalLight(0xeeffa8, 1); 
    directionalLight.position.set(x, y, z); 

    // create a target for the directional light
    var targetDir = new THREE.Vector3(3, -8, 0);
    directionalLight.target.position.copy(targetDir);

    obj.add(directionalLight);
    obj.add(directionalLight.target); 
}

function generateFieldTexture(size) {
    'use strict';

    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');

    // light green background
    context.fillStyle = '#58a415';
    context.fillRect(0, 0, size, size);

    // creating the white, yellow, lillac and light blue flowers 
    var colors = ['#ffffff', '#ffff00', '#7e7eec', '#7eb5ec'];
    var radius = 3;
    var numCircles = 500;

    for (var i = 0; i < numCircles; i++) {
        var x = Math.random() * size;
        var y = Math.random() * size;
        var color = colors[Math.floor(Math.random() * colors.length)];
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    // Generate data URL
    var dataURL = canvas.toDataURL('field.jpeg');
    return dataURL;
}

function createGreenTexture(size) {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
  
    // Fill the canvas with green color
    context.fillStyle = '#58a415';
    context.fillRect(0, 0, size, size);
  
    // Generate data URL
    const dataURL = canvas.toDataURL();
    return dataURL;
}

function createField() {
    'use strict';

    var loader = new THREE.TextureLoader();
    displacement = loader.load('heightmap.png');
    var texture = new THREE.TextureLoader().load(createGreenTexture(512));
    terrainCutout = new TerrainCutout(60, 1, 60, 300, 300, displacement, texture);
    
    terrainCutout.material.displacementScale = 10;
    terrainCutout.position.set(0, -6, 2);
    scene.add(terrainCutout);
}

function generateSkyTexture(size) {
    'use strict';

    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');

    // creating the background
    var gradient = context.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#1b1464');
    gradient.addColorStop(1, '#3a0f4b');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    // creating the stars
    var starColor = '#ffffff';
    var starRadius = 1;
    var numStars = 200;

    for (var i = 0; i < numStars; i++) {
        var x = Math.random() * size;
        var y = Math.random() * size;
        context.fillStyle = starColor;
        context.beginPath();
        context.arc(x, y, starRadius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    // Generate data URL
    var dataURL = canvas.toDataURL('sky.jpeg');
    return dataURL;
}

function createSkydome() {
    'use strict';

    var skydomeGeometry = new THREE.SphereGeometry(50, 60, 60);
    skydomeMesh = new THREE.Mesh(skydomeGeometry, materialsB[2]);
    skydomeMesh.material.side = THREE.BackSide;
    skydomeMesh.position.set(0, -5.9, 14);
    scene.add(skydomeMesh);
}

/////////////////////
/* CREATE OBJECTS */
////////////////////
function createTree1(x, y, z) {
    'use strict';

    tree1 = new THREE.Object3D();

    addTrunk(tree1, 6, -1.5, 3);
    addBranch(tree1, 5.15, -0.65, 5);
    addSecBranch(tree1, 6.7, -0.25, 3);
    addCanopy(tree1, 6.25, 0.75, 3);
    addSmallCanopy(tree1, 5.15, 0.15, 3);

    tree1.position.set(x, y, z);
    scene.add(tree1);
}

function addTrunk(obj, x, y, z) {
    'use strict';

    var trunkGeometry = new THREE.CylinderGeometry(0.45, 0.45, 3, 50);
    mesh =  new THREE.Mesh(trunkGeometry, materialsB[3]);
    mesh.position.set(x, y, z);
    mesh.rotation.Y = Math.PI / 2;
    obj.add(mesh);
    meshes.push(mesh);    
}

function addBranch(obj, x, y, z) {
    'use strict';

    var branchGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.75, 8);
    mesh = new THREE.Mesh(branchGeometry, materialsB[3]);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 3;
    obj.add(mesh);
    meshes.push(mesh);
}

function addSecBranch(obj, x, y, z) {
    'use strict';

    var branchGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.75, 8);
    mesh = new THREE.Mesh(branchGeometry, materialsB[3]);
    mesh.position.set(x, y, z);
    mesh.rotation.z = - Math.PI / 3;
    obj.add(mesh);
    meshes.push(mesh);
}

function addCanopy(obj, x, y, z) {
    'use strict';

    var canopyGeometry = new THREE.SphereGeometry(1, 16, 16);
    mesh = new THREE.Mesh(canopyGeometry, materialsB[4]);
    mesh.position.set(x, y, z);
    obj.add(mesh); 
    meshes.push(mesh); 
}

function addSmallCanopy(obj, x, y, z) {
    'use strict';

    var canopyGeometry = new THREE.SphereGeometry(0.75, 16, 16);
    mesh = new THREE.Mesh(canopyGeometry, materialsB[4]);
    mesh.position.set(x, y, z);
    obj.add(mesh); 
    meshes.push(mesh); 
}

function createTree2(x, y, z) {
    'use strict';

    tree2 = new THREE.Object3D();
    addTrunk(tree2, 6, -1.5, 3);
    addBranch(tree2, 5.2, -0.65, 2.5);
    addSecBranch(tree2, 6.8, -0.25, 3);
    addCanopy(tree2, 5.5, 0.75, 3);
    addSmallCanopy(tree2, 6.25, 0.25, 3); 

    tree2.position.set(x, y, z);
    scene.add(tree2);
}

function createOvni(x, y, z) {
    'use strict';

    ovni = new THREE.Object3D();

    addUpperBody(ovni, 0, -1.5, 0);
    addLowerBody(ovni, 0, -2, 0);
    addCockpit(ovni, 0, -1, 0);

    addBottom(ovni, 0, -2.25, 0);

    addSmallSphere(ovni, 2.25, -2, 0);
    addPointlight(ovni, 2.25, -2, 0);

    addSmallSphere(ovni, -2.25, -2, 0);
    addPointlight(ovni, -2.25, -2, 0);

    addSmallSphere(ovni, 0, -2, 2.25);
    addPointlight(ovni, 0, -2, 2.25);

    addSmallSphere(ovni, 0, -2, -2.25);
    addPointlight(ovni, 0, -2, -2.25);

    addSmallSphere(ovni, 1.75, -2, 1.75);
    addPointlight(ovni, 1.75, -2, 1.75);

    addSmallSphere(ovni, -1.55, -2, 1.55);
    addPointlight(ovni, -1.55, -2, 1.55);

    addSmallSphere(ovni, 1.55, -2, -1.55);
    addPointlight(ovni, 1.55, -2, -1.55);

    addSmallSphere(ovni, -1.55, -2, -1.55);
    addPointlight(ovni, -1.55, -2, -1.55);

    addSpotlight(ovni, 0, -6, 0);

    ovni.position.set(x, y, z);
    scene.add(ovni);
}

function addCockpit(obj, x, y, z) {
    'use strict';

    var cockpitGeometry = new THREE.SphereGeometry(1.2, 35, 30);
    mesh = new THREE.Mesh(cockpitGeometry, materialsB[5]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    meshes.push(mesh);
}

function addSmallSphere(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(0.05, 16, 16);
    mesh = new THREE.Mesh(geometry, materialsB[6]);
    mesh.position.set(x, y, z);
    obj.add(mesh); 
    meshes.push(mesh);
}

function addUpperBody(obj, x, y, z) {
    'use strict';

    var ufoBodyGeometry = new THREE.CylinderGeometry(1, 3, 0.5, 22);
    mesh =  new THREE.Mesh(ufoBodyGeometry, materialsB[7]);
    line = new THREE.LineSegments(new THREE.EdgesGeometry(ufoBodyGeometry), new THREE.LineBasicMaterial({color: 0x808080}));
    mesh.add(line);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    meshes.push(mesh);
}

function addLowerBody(obj, x, y, z) {
    'use strict';

    var ufoBodyGeometry = new THREE.CylinderGeometry(3, 1, 0.35, 22);
    mesh = new THREE.Mesh(ufoBodyGeometry, materialsB[7]);
    line = new THREE.LineSegments(new THREE.EdgesGeometry(ufoBodyGeometry), new THREE.LineBasicMaterial({color: 0x808080}));
    mesh.add(line);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    meshes.push(mesh);
}

function addBottom(obj, x, y, z) {
    'use strict';

    var ufoBodyGeometry = new THREE.CylinderGeometry(1, 1, 0.35, 22);
    mesh = new THREE.Mesh(ufoBodyGeometry, materialsB[8]);
    line = new THREE.LineSegments(new THREE.EdgesGeometry(ufoBodyGeometry), new THREE.LineBasicMaterial({color: 0x808080}));
    mesh.add(line);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    meshes.push(mesh);
}

function addSpotlight(obj, x, y, z) {
    'use strict';

    spotlight = new THREE.SpotLight(0xffffff, 3, 9, Math.PI / 4, 1, 0.25);
    spotlight.position.set(x, y, z); 
    
    var targetSpo = new THREE.Vector3(0, -50, 0);
    spotlight.target.position.copy(targetSpo);
    
    obj.add(spotlight);
    obj.add(spotlight.target); 
}

function addPointlight(obj, x, y, z) {
    'use strict';
    
    pointlight = new THREE.PointLight(0xffffff, 0.5, 20, 2);
    pointlight.position.set(x, y, z); 
    obj.add(pointlight);
}

function createHouse(x, y, z) {
    'use strict';

    var house = new THREE.Object3D();
    addRoof(house);
    addWall(house);
    addDoor(house);
    addWindow(house);

    house.position.set(x, y, z);
    scene.add(house);
}

function addRoof(obj) {
    'use strict';

    const sideRoofIndices = [0, 1, 2];
    var sideRoofGeometry = new THREE.BufferGeometry();
    sideRoofGeometry.setAttribute('position', new THREE.BufferAttribute(roofVertices1, 3));
    sideRoofGeometry.setIndex(sideRoofIndices);
    var sideRoofMesh = new THREE.Mesh(sideRoofGeometry, materialsB[10]);
    sideRoofMesh.position.set(8, 2.5 ,-5);

    const roofIndices1 = [0, 1, 2];
    var roofGeometry1 = new THREE.BufferGeometry();
    roofGeometry1.setAttribute('position', new THREE.BufferAttribute(roofVertices2, 3));
    roofGeometry1.setIndex(roofIndices1);
    var roofMesh1 = new THREE.Mesh(roofGeometry1, materialsB[11]);
    roofMesh1.position.set(6.9, 2.3 ,-5.1);

    const roofIndices2 = [0, 1, 2];
    var roofGeometry2 = new THREE.BufferGeometry();
    roofGeometry2.setAttribute('position', new THREE.BufferAttribute(roofVertices3, 3));
    roofGeometry2.setIndex(roofIndices2);
    var roofMesh2 = new THREE.Mesh(roofGeometry2, materialsB[11]);
    roofMesh2.position.set(6.9, 2.3 ,-5.1);

    obj.add(roofMesh1);
    obj.add(roofMesh2);
    obj.add(sideRoofMesh);
}

function addWall(obj) {
    'use strict';

    const wallIndices = [0, 2, 1];
    const wallGeometry = new THREE.BufferGeometry();
    wallGeometry.setAttribute('position', new THREE.BufferAttribute(wallVertices1, 3));
    wallGeometry.setIndex(wallIndices);
    const wallMesh1 = new THREE.Mesh(wallGeometry, materialsB[10]);
    wallMesh1.position.set(-2, -2.05, -5);

    const wallIndices1 = [0, 2, 1];
    const wallGeometry1 = new THREE.BufferGeometry();
    wallGeometry1.setAttribute('position', new THREE.BufferAttribute(wallVertices2, 3));
    wallGeometry1.setIndex(wallIndices1);
    const wallMesh2 = new THREE.Mesh(wallGeometry1, materialsB[10]);
    wallMesh2.position.set(-2, -2.05, -5);

    const sideWallIndices1 = [0, 1, 2];
    var sideWallGeometry = new THREE.BufferGeometry();
    sideWallGeometry.setAttribute('position', new THREE.BufferAttribute(wallVertices3, 3));
    sideWallGeometry.setIndex(sideWallIndices1);
    var sideWallMesh1 = new THREE.Mesh(sideWallGeometry, materialsB[10]);
    sideWallMesh1.position.set(-1, 2.67 ,-5);
    
    const sideWallIndices2 = [0, 2, 1];
    var sideWallGeometry2 = new THREE.BufferGeometry();
    sideWallGeometry2.setAttribute('position', new THREE.BufferAttribute(wallVertices4, 3));
    sideWallGeometry2.setIndex(sideWallIndices2);
    var sideWallMesh2 = new THREE.Mesh(sideWallGeometry2, materialsB[10]);
    sideWallMesh2.position.set(-1, 2.67 ,-5);

    obj.add(sideWallMesh1);
    obj.add(sideWallMesh2);
    obj.add(wallMesh1);
    obj.add(wallMesh2);
}

function addDoor(obj) {
    'use strict';

    const doorIndices1 = [0, 2, 1];
    const doorGeometry1 = new THREE.BufferGeometry();
    doorGeometry1.setAttribute('position', new THREE.BufferAttribute(doorVertices1, 3));
    doorGeometry1.setIndex(doorIndices1);
    const doorMesh1 = new THREE.Mesh(doorGeometry1, materialsB[12]);
    doorMesh1.position.set(-4, -3.1, -5);

    const doorIndices2 = [0, 1, 2];
    const doorGeometry2 = new THREE.BufferGeometry();
    doorGeometry2.setAttribute('position', new THREE.BufferAttribute(doorVertices2, 3));
    doorGeometry2.setIndex(doorIndices2);
    const doorMesh2 = new THREE.Mesh(doorGeometry2, materialsB[12]);
    doorMesh2.position.set(-4, -3.1, -5);

    obj.add(doorMesh1);
    obj.add(doorMesh2);
}

function addWindow(obj) {
    'use strict';

    const windowIndices1 = [0, 2, 1];
    const windowGeometry1 = new THREE.BufferGeometry();
    windowGeometry1.setAttribute('position', new THREE.BufferAttribute(windowVertices1, 3));
    windowGeometry1.setIndex(windowIndices1);
    const windowMesh1 = new THREE.Mesh(windowGeometry1, materialsB[12]);
    windowMesh1.position.set(-1.75, -1.1, -5);

    const windowIndices2 = [0, 2, 1];
    const windowGeometry2 = new THREE.BufferGeometry();
    windowGeometry2.setAttribute('position', new THREE.BufferAttribute(windowVertices2, 3));
    windowGeometry2.setIndex(windowIndices2);
    const windowMesh2 = new THREE.Mesh(windowGeometry2, materialsB[12]);
    windowMesh2.position.set(-4.75, -1.1, -5);

    obj.add(windowMesh1);
    obj.add(windowMesh2);
}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';

    if (arrowKeys.left) {
        ovni.position.x -= 0.1;
    }
    if (arrowKeys.right) {
        ovni.position.x += 0.1;
    }
    if (arrowKeys.up) {
        ovni.position.z -= 0.1;
    }
    if (arrowKeys.down) {
        ovni.position.z += 0.1;
    }
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({  antialias: true  });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;
    
    createScene();
    createCameras();
    createLights();
    createField();
    createSkydome();
    createMoon(-35, 0, 0);
    createTree1(0.5, 0, 0);
    createTree1(-2.5, 0.5, -10);
    createTree2(-15, 0, 5);
    createTree2(-25, 0, -10);
    createOvni(0, 7.25, 3);
    createHouse(0, 0, 0);
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    ovni.rotation.y += 0.01;
    render();
    requestAnimationFrame(animate);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.setAnimationLoop( function () { 

        update();
        renderer.render(scene, camera);
    });
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 37: // Left arrow key 
            arrowKeys.left = true;
            break;

        case 39: // Right arrow key
            arrowKeys.right = true;
            break;

        case 38: // Up arrow key
            arrowKeys.up = true;
            break;

        case 40: // Down arrow key
            arrowKeys.down = true;
            break;

        case 49: // 1 shows field
            var texture = new THREE.TextureLoader().load(generateFieldTexture(512));
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);

            terrainCutout = new TerrainCutout(60, 1, 60, 300, 300, displacement, texture);
    
            terrainCutout.material.displacementScale = 10;
            terrainCutout.position.set(0, -6, 2);
            scene.add(terrainCutout);
            break;
    
        case 50: // 2 shows sky
            var skydomeTexture = new THREE.TextureLoader().load(generateSkyTexture(612));
            skydomeTexture.wrapS = skydomeTexture.wrapT = THREE.RepeatWrapping;
            skydomeTexture.repeat.set(4, 4);

            skydomeMaterial = new THREE.MeshPhongMaterial({ map: skydomeTexture });
            skydomeMesh.material = skydomeMaterial;
            skydomeMesh.material.side = THREE.BackSide;
            break;
        
        case 68: // D toggle the directional light state
            lightOn = !lightOn; 
            directionalLight.visible = lightOn;
            break;
        
        case 80: // P toggle the point light state
            lightOn = !lightOn; 
            pointlight.visible = lightOn;
            break;
        
        case 81  : // Q key
            console.log("Worked");
            for (let i = 0; i < meshes.length; ++i) {
                var colorT = meshes[i].material.color;
                meshes[i].material = new THREE.MeshLambertMaterial({color: colorT});
            }
            break;

        case 87: // W key
            for (let i = 0; i < meshes.length; ++i) {
                var colorT = meshes[i].material.color;
                meshes[i].material = new THREE.MeshPhongMaterial({color: colorT});
            }
            break;

        case 69: // E key
            for (let i = 0; i < meshes.length; ++i) {
                var colorT = meshes[i].material.color;
                meshes[i].material = new THREE.MeshToonMaterial({color: colorT});
            }
            break;

        case 83: // S toggle the spolight state
            lightOn = !lightOn; 
            spotlight.visible = lightOn;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';

    switch (e.keyCode) {
        case 37: // Left arrow key
          arrowKeys.left = false;
          break;
    
        case 39: // Right arrow key
          arrowKeys.right = false;
          break;
    
        case 38: // Up arrow key
          arrowKeys.up = false;
          break;
    
        case 40: // Down arrow key
          arrowKeys.down = false;
          break;
    }
}