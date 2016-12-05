/**
 * Created by stardust on 2016/12/3.
 */



var scene, camera, renderer;
var objectHolder, loadManager, controls, textureLoader;

var cubeArray, mixer;

var generateGap = 1000;
var speed = 1;
var width = 800, height = 600;
var lookAtPoint;
var planeWidth = 100, planeLength = 400;
var horse;

init();

function init() {

    cubeArray = [];

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
    document.addEventListener('keydown', onKeyDown);

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper( 100 ));      // The X axis is red. The Y axis is green. The Z axis is blue.
    textureLoader = new THREE.TextureLoader();

    camera = new THREE.PerspectiveCamera(
        35,             // Field of view
        width / height,     // Aspect ratio
        0.1,            // Near ground
        10000           // Far ground
    );
    camera.position.set( 0, -200, 100 );
    lookAtPoint = new THREE.Vector3();
    objectHolder = new THREE.Object3D();
    scene.add(objectHolder);

    initLight();

    initControl();

    var ground = new THREE.PlaneGeometry(planeWidth, planeLength);
    var material = new THREE.MeshLambertMaterial( { color : 0x00aa00 } );
    // var material = new THREE.MeshPhongMaterial( { color : 0xFFFFFF, map : textureLoader.load("models/tile_texture.png")} );
    var groundMesh = new THREE.Mesh( ground, material );
    groundMesh.receiveShadow = true;
    groundMesh.doubleSided = true;
    scene.add( groundMesh );

    loadobj();

    render();
    requestAnimationFrame(animate);
    setTimeout(generateCubes, generateGap);
}

function animate() {

    cubeArray.forEach(function (cube, index, array) {
        if( cube.position.y < -planeLength ){
            objectHolder.remove(cube);
            array.slice(index, 1);
        }else{
            cube.position.y -= speed;
        }

    });

    // objectHolder.position.y -= speed;
    render();
    controls.update();
    // console.log(camera.position);
    requestAnimationFrame(animate);
}

var spot;
function initLight() {
    spot = new THREE.SpotLight( 0xFFFFFF );
    spot.position.set( 0, -300, 300 );
    spot.castShadow = true;

    // spot.angle = Math.PI / 4;
    // spot.penumbra = 0.05;
    // spot.decay = 2;
    //
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    // spot.shadow.camera.near = 10;
    // spot.shadow.camera.far = 400;
    // spot.shadow.camera.fov = 30;
    spot.shadowCameraVisible = true;
    scene.add( spot );

    // var ambient = new THREE.AmbientLight( 0xaaaaaa );
    // scene.add(ambient);

    // var direct = new THREE.DirectionalLight( 0xffffff );
    // scene.add(direct);

}

function initControl() {

    controls = new THREE.TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 0.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );
}

function loadobj() {
    if( !loadManager )
        // loadManager = new THREE.LoadingManager();
    var loader = new THREE.JSONLoader( );

    loader.load(
        './models/horse.js',
        function ( geometry ) {
            // if( object  )
            // object.scale.set(.1, .1, .1);
            horse = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                vertexColors : THREE.FaceColors,
                morphTargets : true
            }));
            horse.castShadow = true;
            horse.scale.set(.1, .1, .1);
            horse.position.set(0, -planeWidth, 0);
            horse.rotateX(90 * THREE.Math.DEG2RAD);
            horse.rotateY(180 * THREE.Math.DEG2RAD);
            objectHolder.add(horse);

            mixer = new THREE.AnimationMixer( horse );
            var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            mixer.clipAction(clip).setDuration(1).play();
            // objectHolder.add( object );
        }
    );
}

function generateCubes() {

    var cube = new THREE.CubeGeometry(10, 10, 10);
    // var material = new THREE.MeshLambertMaterial( { color : 0xee0000 } );
    var material = new THREE.MeshPhongMaterial( { color : 0xFFFFFF, map: textureLoader.load("models/crate.gif") } );
    var cubeMesh = new THREE.Mesh(cube, material);
    cubeMesh.position.set(THREE.Math.randInt(-45, 45), planeWidth + 5, 5);
    cubeMesh.castShadow = true;

    cubeArray.push(cubeMesh);
    objectHolder.add(cubeMesh);
    setTimeout(generateCubes, generateGap);

}

var prevTime = Date.now();
function render() {
    renderer.setClearColor( 0xdddddd, 1);
    if( mixer ){
        var time = Date.now();
        mixer.update( ( time - prevTime ) * 0.001 );
        prevTime = time;
    }
    renderer.render( scene, camera );

}

function onKeyDown( event ) {
    event = event || window.event;
    var delta = 1;
    var keycode = event.keyCode;
    switch ( keycode ){
        case 37 : //left arrow 向左箭头
            camera.position.x = camera.position.x - delta;
            lookAtPoint.x -= delta;
            break;
        case 38 : // up arrow 向上箭头
            camera.position.z = camera.position.z - delta;
            lookAtPoint.z -= delta;
            break;
        case 39 : // right arrow 向右箭头
            camera.position.x = camera.position.x + delta;
            break;
        case 40 : //down arrow向下箭头
            camera.position.z = camera.position.z + delta;
            break;

    }
    camera.lookAt(lookAtPoint);


}


