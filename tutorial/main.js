function init() {
    // サイズを指定
    const width = 960;
    const height = 540;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成 画角とアスペクト比
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, +1000);

    // 箱を作成 幅, 高さ, 奥行き
    // const geometry = new THREE.BoxGeometry(400, 400, 400);
    // const material = new THREE.MeshNormalMaterial();
    // const box = new THREE.Mesh(geometry, material);
    // scene.add(box);

    // 球体を作成
    const geometry = new THREE.SphereGeometry(300, 30, 30);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('image/yariika.png');
    const material = new THREE.MeshStandardMaterial({
        map: texture
    });
    // メッシュを作成
    const mesh = new THREE.Mesh(geometry, material);
    // 3D空間にメッシュを追加
    scene.add(mesh);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    // シーンに追加
    scene.add(directionalLight);

    tick();

    function tick() {
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera); // レンダリング  
        // ちょっとよくわからない
        requestAnimationFrame(tick);
    }
}