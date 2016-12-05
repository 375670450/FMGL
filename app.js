/**
 * Created by stardust on 2016/12/3.
 */



var scene, camera, renderer;
var objectHolder, loadManager, controls, textureLoader;

var cubeArray;

var generateGap = 1000;
var speed = 0.1;
var width = 800, height = 600;
var planeWidth = 10, planeLength = 40;

init();

function init() {

    cubeArray = [];

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    textureLoader = new THREE.TextureLoader();

    camera = new THREE.PerspectiveCamera(
        35,             // Field of view
        width / height,     // Aspect ratio
        0.1,            // Near ground
        10000           // Far ground
    );
    camera.position.set( 0, 0, 20 );
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.y / 2));

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

    scene.rotateX(-45);

    render();
    requestAnimationFrame(animate);
    setTimeout(generateCubes, generateGap);
}

function animate() {

    cubeArray.forEach(function (cube, index, array) {
        if( cube.position.y < -5 ){
            objectHolder.remove(cube);
            array.slice(index, 1);
        }else{
            cube.position.y -= speed;
        }

    });

    // objectHolder.position.y -= speed;
    renderer.render(scene, camera);
    controls.update();
    // console.log(camera.position);
    requestAnimationFrame(animate);
}

function initLight() {
    var point = new THREE.PointLight( 0xaaaaaa );
    point.position.set( 0, -30, 30 );
    scene.add( point );

    var ambient = new THREE.AmbientLight( 0xaaaaaa );
    scene.add(ambient)

    var direct = new THREE.DirectionalLight( 0xffffff );
    scene.add(direct);

}

function initControl() {

    controls = new THREE.TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = true;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );
}

function loadobj() {
    if( !loadManager )
        // loadManager = new THREE.LoadingManager();
    var loader = new THREE.FBXLoader( );

    loader.load(
        './models/xsi_man_skinning.fbx',
        function ( object ) {
            if( object  )
            object.scale.set(.1, .1, .1);
            objectHolder.add( object );
        }
    );

}

function generateCubes() {

    var cube = new THREE.CubeGeometry(1, 1, 1);
    // var material = new THREE.MeshLambertMaterial( { color : 0xee0000 } );
    var material = new THREE.MeshPhongMaterial( { color : 0xFFFFFF, map: textureLoader.load("models/crate.gif") } );
    var cubeMesh = new THREE.Mesh(cube, material);
    cubeMesh.position.set(THREE.Math.randInt(-4.5, 4.5), planeWidth + 0.5, .5);
    cubeArray.push(cubeMesh);
    objectHolder.add(cubeMesh);
    setTimeout(generateCubes, generateGap);

}

function render() {
    renderer.setClearColor( 0xdddddd, 1);
    renderer.render( scene, camera );

}


