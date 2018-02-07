'use strict';

var world, ground, timeStep = 1 / 60,
    diceRigid, dice,
    camera, scene, renderer, floorObj,
    startDiceNum = 3,
    cubeSize = 5,
    stopped = false;

main();

function main() {
    initCannon();
    initThree();

    //create a dice.
    var ret = createDice();
    dice = ret.dice;
    diceRigid = ret.rigid;

    world.allowSleep = true;
    diceRigid.allowSleep = true;

    diceRigid.sleepSpeedLimit = 0.1;
    diceRigid.sleepTimeLimit = 1;

    scene.add(dice);
    world.add(diceRigid);

    registerListener();
    renderer.render(scene, camera);
}

function createDice() {

    var boxInfos = [
        {
            url: './image/2.png',
            position: [ -cubeSize, 0, 0 ],
            rotation: [ 0, Math.PI / 2, 0 ]
        },
        {
            url: './image/5.png',
            position: [ cubeSize, 0, 0 ],
            rotation: [ 0, -Math.PI / 2, 0 ]
        },
        {
            url: './image/1.png',
            position: [ 0,  cubeSize, 0 ],
            rotation: [ Math.PI / 2, 0, Math.PI ]
        },
        {
            url: './image/6.png',
            position: [ 0, -cubeSize, 0 ],
            rotation: [ - Math.PI / 2, 0, Math.PI ]
        },
        {
            url: './image/3.png',
            position: [ 0, 0,  cubeSize ],
            rotation: [ 0, Math.PI, 0 ]
        },
        {
            url: './image/4.png',
            position: [ 0, 0, -cubeSize ],
            rotation: [ 0, 0, 0 ]
        }
    ];

    // For three.js
    var el, dice, info, img, face;

    el = document.createElement('div');
    el.style.width = cubeSize * 2 + 'px';
    el.style.height = cubeSize * 2 + 'px';
    dice = new THREE.CSS3DObject(el);

    boxInfos.forEach((boxInfo) => {
        img = document.createElement('img');
        img.width = cubeSize * 2;
        img.src = boxInfo.url;
        face = new THREE.CSS3DObject(img);

        face.position.fromArray(boxInfo.position);
        face.rotation.fromArray(boxInfo.rotation);
        dice.add(face);
    });

    // Create physics.
    var mass  = 1;
    var box = new CANNON.Box(new CANNON.Vec3(cubeSize, cubeSize, cubeSize));
    var body = new CANNON.RigidBody(mass, box);
    
    //body.position.set(x, y, z);
    //body.velocity.set(0, 0, Math.random() * -50 - 30);

    //body.angularVelocity.set(10, 10, 10);
    //body.angularDamping = 0.001;

    return {
        dice: dice,
        rigid: body
    };
}

function initCannon() {
    //Cannonの世界を生成
    world = new CANNON.World();

    //重力を設定
    world.gravity.set(0, -90.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.solver.tolerance = 0.001;

    //地面用にPlaneを生成
    var plane = new CANNON.Plane();

    //Planeの剛体を質量0で生成する
    ground= new CANNON.RigidBody(0, plane);

    //X軸に90度（つまり地面）に回転
    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(ground);
}

function initThree() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(10, 40, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(w, h);

    var textureSize = 800;
    var floorEle = document.createElement('div');
    floorEle.style.width  = textureSize + 'px';
    floorEle.style.height = textureSize + 'px';
    floorEle.style.background = 'url(http://jsrun.it/assets/d/x/0/w/dx0wl.png) left top repeat';
    floorEle.style.backgroundSize = textureSize / 20 + 'px ' + textureSize / 20 + 'px';

    floorObj = new THREE.CSS3DObject(floorEle);
    floorObj.position.fromArray([0, 0, 0]);
    floorObj.rotation.fromArray([Math.PI / 2, 0, 0]);
    scene.add(floorObj);

    scene.add(camera);

    var container = document.getElementById('d0');
    container.appendChild(renderer.domElement);
}

function animate() {
    if (stopped) {
        return;
    }
    requestAnimationFrame(animate);
    updatePhysics();
    renderer.render(scene, camera);
}

function updatePhysics() {
    //物理エンジンの時間を進める
    world.step(timeStep);

    //物理エンジンで計算されたbody(RigidBody)の位置をThree.jsのMeshにコピー
    if (diceRigid) {
        diceRigid.position.copy(dice.position);
        diceRigid.quaternion.copy(dice.quaternion);
        diceRigid.position.copy(camera.position);
        camera.position.y += 50;
        camera.position.x += 50;
        camera.lookAt(diceRigid.position.copy(new THREE.Vector3(0, 0, 0)));
    }

    ground.position.copy(floorObj.position);
    ground.quaternion.copy(floorObj.quaternion);
}

function initAnimation() {
    diceRigid.position.set(0, 50, 30);
    diceRigid.velocity.set(
        Math.random() * 20  + 0,
        Math.random() * 100 + 20,
        Math.random() * -50 - 30);
    diceRigid.angularVelocity.set(10, 10, 10);
    diceRigid.angularDamping = 0.001;
}

function registerListener() {
    diceRigid.addEventListener('sleepy', function (e) {
        var vec4s = [
            new THREE.Vector4( 0,  1,  0, 0), // 1
            new THREE.Vector4(-1,  0,  0, 0), // 2
            new THREE.Vector4( 0,  0,  1, 0), // 3
            new THREE.Vector4( 0,  0, -1, 0), // 4
            new THREE.Vector4( 1,  0,  0, 0), // 5
            new THREE.Vector4( 0, -1,  0, 0), // 6
        ];
        var up = 0.99;

        vec4s.forEach((vec4, index) => {
            if ( vec4.applyMatrix4(dice.matrixWorld).y > up ) {
                document.getElementById('num').innerHTML = index + 1;
            }
        });

        stopped = true;
    });

    diceRigid.addEventListener('sleep', function (e) {
        //alert('sleep');
    });

    document.addEventListener('click', function (e) {
        stopped = false;
        initAnimation();
        animate();
    }, false);
}