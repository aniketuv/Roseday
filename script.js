let scene, camera, renderer, rose, particles;
const particleCount = 1000;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.PointLight(0xff69b4, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Camera position
    camera.position.z = 5;

    // Load rose model
    const loader = new THREE.GLTFLoader();
    loader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/models/gltf/Flamingo.gltf', (gltf) => {
        rose = gltf.scene;
        rose.scale.set(0.5, 0.5, 0.5);
        scene.add(rose);
    });

    // Create particles
    const particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    for(let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
    }
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xff1493,
        size: 0.1,
        transparent: true
    });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.getElementById('heartButton').addEventListener('click', showMessage);
}

function showMessage() {
    document.getElementById('message').style.opacity = '1';
    createHeartExplosion();
    setTimeout(() => {
        document.getElementById('message').style.opacity = '0';
    }, 5000);
}

function createHeartExplosion() {
    const heartGeometry = new THREE.SphereGeometry(0.1);
    const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff1493 });
    for(let i = 0; i < 50; i++) {
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.position.copy(camera.position);
        scene.add(heart);
        
        const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        const speed = 0.05;
        animateHeart(heart, direction, speed);
    }
}

function animateHeart(heart, direction, speed) {
    function update() {
        heart.position.add(direction.clone().multiplyScalar(speed));
        heart.material.opacity -= 0.01;
        if(heart.material.opacity > 0) {
            requestAnimationFrame(update);
        } else {
            scene.remove(heart);
        }
    }
    update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if(rose) rose.rotation.y += 0.01;
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}

init();
animate();