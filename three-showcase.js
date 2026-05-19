(function () {
  const canvas = document.getElementById("showcase-canvas");
  const stage = document.getElementById("showcase-stage");
  if (!canvas || !stage || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
  camera.position.set(0, 0.1, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const material = new THREE.MeshStandardMaterial({
    color: 0xc9a870,
    wireframe: true,
    metalness: 0.7,
    roughness: 0.22
  });

  const ghostMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfc08a,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });

  scene.add(new THREE.AmbientLight(0x1a1000, 0.8));

  const keyLight = new THREE.PointLight(0xc9a870, 1.8, 25);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xdfc08a, 0.9, 20);
  fillLight.position.set(-4, -2, 4);
  scene.add(fillLight);

  const compactStage = stage.clientWidth < 620;
  camera.position.z = compactStage ? 9.8 : 8;

  const cubeTargets = compactStage
    ? [
        new THREE.Vector3(-1.15, 1.05, 0),
        new THREE.Vector3(1.15, 0.5, -0.2),
        new THREE.Vector3(0, -1.35, 0.25)
      ]
    : [
        new THREE.Vector3(-2, 1, 0),
        new THREE.Vector3(2.1, 0.45, -0.2),
        new THREE.Vector3(0, -1.6, 0.25)
      ];

  const cubeStarts = compactStage
    ? [
        new THREE.Vector3(-4, 1.25, 0),
        new THREE.Vector3(4, 0.7, -0.2),
        new THREE.Vector3(0, -4, 0.25)
      ]
    : [
        new THREE.Vector3(-7, 1.25, 0),
        new THREE.Vector3(7, 0.7, -0.2),
        new THREE.Vector3(0, -5, 0.25)
      ];

  const cubes = [
    {
      mesh: new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 1.35), material),
      start: cubeStarts[0],
      target: cubeTargets[0],
      rotationSpeed: new THREE.Vector3(0.009, 0.013, 0.006)
    },
    {
      mesh: new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.25, 1.25), material),
      start: cubeStarts[1],
      target: cubeTargets[1],
      rotationSpeed: new THREE.Vector3(0.006, 0.01, 0.014)
    },
    {
      mesh: new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), material),
      start: cubeStarts[2],
      target: cubeTargets[2],
      rotationSpeed: new THREE.Vector3(0.012, 0.007, 0.01)
    }
  ];

  cubes.forEach((item) => {
    item.mesh.position.copy(item.start);
    item.mesh.userData.target = item.target;
    scene.add(item.mesh);

    const ghost = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.75, 1.75), ghostMaterial);
    ghost.position.copy(item.target);
    ghost.rotation.set(0.4, 0.5, 0.2);
    scene.add(ghost);
    item.ghost = ghost;
  });

  function resize() {
    const width = stage.clientWidth || 600;
    const height = stage.clientHeight || 500;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top 78%",
        once: true
      }
    });

    cubes.forEach((item, index) => {
      timeline.to(
        item.mesh.position,
        {
          x: item.target.x,
          y: item.target.y,
          z: item.target.z,
          duration: 1.25,
          ease: "power3.out"
        },
        index * 0.12
      );
    });
  } else {
    cubes.forEach((item) => item.mesh.position.copy(item.target));
  }

  function animate() {
    requestAnimationFrame(animate);
    cubes.forEach((item) => {
      item.mesh.rotation.x += item.rotationSpeed.x;
      item.mesh.rotation.y += item.rotationSpeed.y;
      item.mesh.rotation.z += item.rotationSpeed.z;
      item.ghost.rotation.x -= item.rotationSpeed.x * 0.45;
      item.ghost.rotation.y += item.rotationSpeed.y * 0.35;
    });
    renderer.render(scene, camera);
  }

  animate();
})();
