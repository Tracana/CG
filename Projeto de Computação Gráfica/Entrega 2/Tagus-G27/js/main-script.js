//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras, scene, renderer, currentCamera;
var mesh, robot, trailer, clock, delta, line;
var arrowKeys = { left: false, right: false, up: false, down: false };
var transformation = { feetL: false, feetR: false, waistR: false, waistL: false, armsL: false, armsR:false, headR: false, headL: false};
var rotationSpeed = Math.PI / 2; 
var speed = 0.05;
var truckMode = false;
var collision = false;
var animation = false;
var coupled = false;
var robotBox, trailerBox;

///////////////////////
///////* ROBOT *///////
///////////////////////
function createRobot(x, y, z) {
  'use strict';

  robot = new THREE.Object3D();

  // torso and its details
  addTorso(robot, 0, 9, 0);
  addBumper(robot, 0, 8, 3);
  addWaist(robot, 0, 4.45, -0);
  addWindow(robot, -2, 11.1, 3);
  addWindow(robot, 2, 11.1, 3);
  addWindowDetail(robot, -2, 11.05, 3);
  addWindowDetail(robot, 2, 11.05, 3);
  addRadiator(robot, 0, 6.25, 3.1);
  addWheel(robot, -3.35, 4.5, 0);
  addWheel(robot, 3.35, 4.5, 0);

  // head
  createHead(robot, 0, 15, 0);

  // legs 
  createLegs(robot, 0, -6, 0);

  // arms
  createArms(robot, 0, 7, 0);

  robot.position.set(x, y, z);
  scene.add(robot);
}

function addTorso(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(9, 10, 6);
  var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addBumper(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(9, 1, 0.05);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addWaist(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(9, 1, 6);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addWindow(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(3.5, 3.5, 0.2);
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addWindowDetail(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(3.75, 4, 0.1);
  var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addRadiator(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(3.75, 4, 0.1);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addPipe(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.CylinderGeometry(0.25, 0.25, 7, 22);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addHeadlighter(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(0.7, 0.5, 1.5);
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createHead(obj, x, y, z) {
  'use strict';

  var offset = 2.4;
  var eyeOffset = 0.75 +  offset;
  var antennaOffset = 1.25 + offset;
  var head = new THREE.Object3D();

  addHead(head, 0, 0 + offset, 0); 
  addEye(head, 0.5, eyeOffset, 2.5); 
  addEye(head, -0.5, eyeOffset, 2.5);
  addAntenna(head, -1.1, antennaOffset, 0); 
  addAntenna(head, 1.1, antennaOffset, 0);

  head.position.set(x, y - offset, z); 
  obj.head = head; 
  obj.add(head); 
}

function addHead(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(2, 3.5, 3);
  var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addEye(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.CircleGeometry(0.2);
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addAntenna(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 22);
  var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createArms(obj, x, y, z) {
  'use strict';

  var memberL = new THREE.Object3D();
  var memberR = new THREE.Object3D();

  // arms
  addArm(memberR, -5.5, 17.25, 0);
  addArm(memberL, 5.5, 17.25, 0);

  //forearms
  addForearm(memberR, -5.5, 12.25, 1);
  addForearm(memberL, 5.5, 12.25, 1);

  //bumpers (small)
  addSmallBumper(memberR, -5.5, 14, 0);
  addSmallBumper(memberL, 5.5, 14, 0);

  // headlighters
  addHeadlighter(memberR, -5.5, 12.25, 2.5);
  addHeadlighter(memberL, 5.5, 12.25, 2.5);

  // pipes
  addPipe(memberR, -6.75, 18, 0);
  addPipe(memberL, 6.75, 18, 0);

  memberR.position.set(0, -6, 0);
  memberL.position.set(0, -6, 0);

  obj.armR = memberR;
  obj.armL = memberL;

  obj.add(memberR);
  obj.add(memberL);
}

function addArm(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(2, 5.5, 2);
  var material = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addForearm(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(2, 2.5, 4);
  var material = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
  mesh = new THREE.Mesh(geometry, material);
  line = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({color: 0x0}));
  mesh.add(line);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addSmallBumper(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.BoxGeometry(2, 1, 2);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  addLine(line, geometry);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createLegs(obj, x, y, z) {
  'use strict';

  var offset = 11;
  var leg = new THREE.Object3D();

  // thighs
  addThigh(leg, -2, 6.5 - offset, 0);
  addThigh(leg, 2, 6.5 - offset, 0);

  // shins
  addShin(leg, -2, -1.5 - offset, 0);
  addShin(leg, 2, -1.5 - offset, 0);
  addWheel(leg, -3.6, -3.2 - offset, 0.65);
  addWheel(leg, 3.6, -3.2 - offset, 0.65);
  addWheel(leg, -3.6, 0.6 - offset, 0.65);
  addWheel(leg, 3.6, 0.6 - offset, 0.65);

  // feet
  createFeet(leg, 0, -3 - offset, 0);

  leg.position.set(x, y + offset, z);
  obj.leg = leg;
  obj.add(leg);
}

function addShin(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(2.5, 9, 2.5);
  var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addThigh(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(2.5, 7, 2.5);
  var material = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createFeet(obj, x, y, z) {
  'use strict';

  var offset = 4;
  var foot = new THREE.Object3D();

  addFeet(foot, -2, -4 + offset, 1.25);
  addFeet(foot, 2, -4 + offset, 1.25);

  foot.position.set(x, y - offset, z);
  obj.foot = foot;
  obj.add(foot);
}

function addFeet(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(2.5, 2.5, 5);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

/////////////////////
/////* TRAILER */////
/////////////////////
function createTrailer(x, y, z) {
  'use strict';

  trailer = new THREE.Object3D();

  addTrailer(trailer, 8, 12.65, 0);
  addWheel(trailer, 2.65, 4.35, -10);
  addWheel(trailer, 13.35, 4.35, -10);
  addWheel(trailer, 2.65, 4.35, -4.5);
  addWheel(trailer, 13.35, 4.35, -4.5);
  addDetail(trailer, 8, 5.155, -7.5);
  addTube(trailer, 10, 5.155, -15.2);
  addConnector(trailer, 8, 9.5, 16.25)

  trailer.position.set(x, y, z);
  scene.add(trailer);
}

function addTrailer(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(10, 13, 30);
  var material = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addWheel(obj, x, y, z) {
  'use strict';

  var geometry = new THREE.CylinderGeometry(1.75, 1.75, 0.75, 22);
  var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  mesh.rotation.z = Math.PI / 2;
  obj.add(mesh);
}

function addDetail(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.BoxGeometry(9.5, 2.45, 15);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addTube(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 4);
  var material = new THREE.MeshBasicMaterial({ color: 0x505050 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  mesh.rotation.x = Math.PI / 2;
  obj.add(mesh);
}

function addConnector(obj, x, y, z) {
  'use strict';
  
  var geometry = new THREE.CylinderGeometry(2, 2, 2.75, 22);
  var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  mesh = new THREE.Mesh(geometry, material);
  addLine(line, geometry);
  mesh.position.set(x, y, z);
  mesh.rotation.x = Math.PI / 2;
  obj.add(mesh);
}

function addLine(line, geometry) {
  line = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({color: 0x0}));
  mesh.add(line);
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
  'use strict';

  scene = new THREE.Scene();
  scene.add(new THREE.AxisHelper(50));
  scene.background = new THREE.Color(0xffffdd); 

  createRobot(-12, 0, 10);
  createTrailer(-20, 0, -15);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
  'use strict';
  
  // frustum values for an isometric projection
  const frustumSize = 20; 
  const aspectRatio = window.innerWidth / window.innerHeight;
  const left = -frustumSize * aspectRatio;
  const right = frustumSize * aspectRatio;
  const top = frustumSize;
  const bottom = -frustumSize;
  const near = -frustumSize * 2;
  const far = frustumSize * 2;
  const cameraDistance = frustumSize / (2 * Math.tan(Math.PI / 6));
    
  // array with all the cameras
  cameras = {
    cameraFront: new THREE.OrthographicCamera(-50, 50, 100 / (2 * aspectRatio), -100 / (2 * aspectRatio), 5, 100),
  
    cameraSide: new THREE.OrthographicCamera(-50, 50, 100 / (2 * aspectRatio), -100 / (2 * aspectRatio), 5, 100),
  
    cameraUp: new THREE.OrthographicCamera(-20, 20, 20, -20, 5, 100),
  
    cameraOrthIso: new THREE.OrthographicCamera(left, right, top, bottom, near, far),
  
    cameraPerspIso: new THREE.PerspectiveCamera(70, aspectRatio, 1, 100)
  };
  
  cameras.cameraFront.position.set(0, 0, 40); 
  cameras.cameraSide.position.set(-40, 0, 0); 
  cameras.cameraUp.position.set(0, 30, 0); 
  cameras.cameraOrthIso.position.set(cameraDistance, cameraDistance, cameraDistance); 
  cameras.cameraPerspIso.position.set(cameraDistance, cameraDistance, cameraDistance); 
  
  cameras.cameraFront.lookAt(scene.position); 
  cameras.cameraSide.lookAt(scene.position); 
  cameras.cameraUp.lookAt(scene.position); 
  cameras.cameraOrthIso.lookAt(new THREE.Vector3(0, 0, 0));
  cameras.cameraPerspIso.lookAt(new THREE.Vector3(0, 0, 0));
    
  // initialization of the current camera
  currentCamera = cameras.cameraFront;  
}

function intersects(box1, box2) {
  'use strict';

  // compare the min and max coordinates of the boxes in each dimension
  if (box1.max.x < box2.min.x || box1.min.x > box2.max.x) return false;
  if (box1.max.y < box2.min.y || box1.min.y > box2.max.y) return false;
  if (box1.max.z < box2.min.z || box1.min.z > box2.max.z) return false;

  // if no separating axis is found, the boxes intersect
  return true;
}

function setFromObject(object) {
  'use strict';

  var box = new THREE.Box3();

  // traverse the object's children and calculate their bounding boxes
  object.traverse(function (child) {
    if (child.geometry !== undefined) {
      child.geometry.computeBoundingBox();
      var childBox = child.geometry.boundingBox.clone();
      childBox.applyMatrix4(child.matrixWorld);
      box.union(childBox);
    }
  });
  return box;
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
  'use strict';

  // define bounding boxes for collision detection
  robotBox = setFromObject(robot);
  trailerBox = setFromObject(trailer);
  collision = intersects(robotBox, trailerBox);
  
  if (collision && !coupled) {
    // collision detected
    handleCollisions();
    coupled = true;
  }
  else if (!collision && coupled) {
    coupled = false;
  }
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
  'use strict';

  // target position for the trailer
  var targetPosition = new THREE.Vector3(-20, 0, -10.5); 
  var totalFrames = 80;
  var positionIncrement = targetPosition.clone().sub(trailer.position).divideScalar(totalFrames);
  animation = true;
  renderer.setAnimationLoop(function () {
    trailer.position.add(positionIncrement);
    renderer.render(scene, currentCamera);

    // check if trailer reached the target position
    if (trailer.position.distanceTo(targetPosition) <= positionIncrement.length()) {
      coupled = true;
      animation = false;
      renderer.setAnimationLoop(null); // stop the animation loop
    }
  });
}

////////////
/* UPDATE */
////////////
function update() {
  if (animation) {
    return; 
  }
  'use strict';
  if (arrowKeys.left) {
    trailer.position.x -= 0.2;
  }
  if (arrowKeys.right) {
    trailer.position.x += 0.2;
  }
  if (arrowKeys.up) {
    trailer.position.z -= 0.2;
  }
  if (arrowKeys.down) {
    trailer.position.z += 0.2;
  }

  // rotate the legs
  if (transformation.feetL) {
    if (robot.leg.foot.rotation.x < Math.PI / 2) {
      robot.leg.foot.rotation.x += rotationSpeed * delta;
    }
  }
  if (transformation.feetR) {
    if (robot.leg.foot.rotation.x > 0) {
      robot.leg.foot.rotation.x -= rotationSpeed * delta;
    }
  }
  if (transformation.waistL) {
    if (robot.leg.rotation.x < Math.PI / 2) {
      robot.leg.rotation.x += rotationSpeed * delta;
    }
  }
  if (transformation.waistR) {
    if (robot.leg.rotation.x > 0) {
      robot.leg.rotation.x -= rotationSpeed * delta;
    }
  }

  // rotate the arms
  if (transformation.armsL) { // Arms go into the robot
    if (robot.armL.position.x > robot.position.x + 10 ) {
      robot.armR.position.x += rotationSpeed * delta;
      robot.armL.position.x -= rotationSpeed * delta;
    }
  }
  if (transformation.armsR) { //Arms go away from the robot
    if (robot.armL.position.x < robot.position.x + 12) {
      robot.armR.position.x -= rotationSpeed * delta; 
      robot.armL.position.x += rotationSpeed * delta;
    }
  }

  // rotate the head
  if (transformation.headL) {
    if (robot.head.rotation.x < 0){
      robot.head.rotation.x += rotationSpeed * delta;
    }
  }
  if (transformation.headR) {
    if (robot.head.rotation.x > -Math.PI) {
      robot.head.rotation.x -= rotationSpeed * delta;
    }
  }

  // collision detection must be enabled only in truck mode, never in robot mode
  if (robot.armL.position.x <= robot.position.x + 10 && robot.head.rotation.x <= -Math.PI &&
    robot.leg.rotation.x >= Math.PI / 2 && robot.leg.foot.rotation.x >= Math.PI / 2) {
    truckMode = true;
  }

  else {
    truckMode = false;
  }
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
  'use strict';
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  if (window.innerHeight > 0 && window.innerWidth > 0) {
    currentCamera.aspect = window.innerWidth / window.innerHeight;
    currentCamera.updateProjectionMatrix();
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

    case 49: // 1 front camera with orthogonal projection
      if (collision == false) {    
        currentCamera = cameras.cameraFront;
      }
      break;

    case 50: // 2 side camera with orthogonal projection
      currentCamera = cameras.cameraSide;
      break;

    case 51: // 3 up camera with orthogonal projection
      currentCamera = cameras.cameraUp;
      break;

    case 52: // 4 camera with orthogonal projection and isometric perspectives
      currentCamera = cameras.cameraOrthIso;
      break;

    case 53: // 5 camera with perspective projection anf isometric perspectives
      if (collision == false) {  
        currentCamera = cameras.cameraPerspIso;
      }
      break;

    case 54: // 6 toggle wireframe mode
      scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.material.wireframe = !node.material.wireframe;
        }
      });
      break;
      
    case 55: // 7 toggle axis helper visibility
      scene.traverse(function (node) {
        if (node instanceof THREE.AxisHelper) {
          node.visible = !node.visible;
        }
      });
      break;

    case 65: // A toggle feet transformation
      transformation.feetR = true;
      break;

    case 68: // D toggle arm movement
      transformation.armsL = true;
      break;

    case 69: // E toggle waist transformation
      transformation.armsR = true;
      break;

    case 70: // F toggle headLeft transformation
      transformation.headL = true;
      break;

    case 81:  // Q toggle feet transformation
      transformation.feetL = true;
      break;

    case 82: // R toggle headRight transformation
      transformation.headR = true;
      break;

    case 83: // S toggle axis helper visibility
      transformation.waistL = true;
      break;

    case 87: // W toggle wireframe mode
      transformation.waistR = true;
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

    case 65: // A toggle feet transformation
      transformation.feetR = false;
      break;

    case 68: // D toggle arm movement
      transformation.armsL = false;
      break;

    case 69: // E toggle waist transformation
      transformation.armsR = false;
      break;

    case 70: // F toggle headLeft transformation
      transformation.headL = false;
      break;

    case 81: // Q toggle feet transformation
      transformation.feetL = false;
      break;

    case 82: // R toggle headRight transformation
      transformation.headR = false;
      break;

    case 83: // S toggle axis helper visibility
      transformation.waistL = false;
      break;  
    
    case 87: // W toggle wireframe mode
      transformation.waistR = false;
      break;
  }
}

/////////////
/* DISPLAY */
/////////////
function render() {
  'use strict';
  
  update();
  renderer.render(scene, currentCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
  'use strict';

  clock = new THREE.Clock();
  clock.start();

  renderer = new THREE.WebGLRenderer({  antialias: true,  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  createScene();
  createCamera();
  
  render();
  
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize'", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
  'use strict';

  delta = clock.getDelta(); 
  requestAnimationFrame(animate);
  update();

  if (truckMode) {
    // Check for collisions
    checkCollisions();
  }

  renderer.render(scene, currentCamera);
}
