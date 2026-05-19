(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || !window.THREE) return;

  const isMobile = window.innerWidth < 768;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080808);
  scene.fog = new THREE.Fog(0x080808, 24, 86);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 140);
  camera.position.set(0, isMobile ? 1.1 : 1.35, isMobile ? 12.5 : 10);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const gold = new THREE.Color(0xc9a870);
  const goldLight = new THREE.Color(0xdfc08a);
  const goldDark = new THREE.Color(0x9a7a4a);

  const laptopWire = new THREE.MeshStandardMaterial({
    color: gold,
    wireframe: true,
    metalness: 0.88,
    roughness: 0.18,
    transparent: true,
    opacity: 0.88
  });

  const screenGlowMaterial = new THREE.MeshBasicMaterial({
    color: gold,
    transparent: true,
    opacity: 0.13,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const splitMaterial = new THREE.MeshBasicMaterial({
    color: goldLight,
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const solidGold = new THREE.MeshBasicMaterial({
    color: gold,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending
  });

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: gold,
    transparent: true,
    opacity: 0.45,
    metalness: 0.95,
    roughness: 0.16
  });

  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: goldLight,
    wireframe: true,
    transparent: true,
    opacity: 0.62,
    metalness: 0.7,
    roughness: 0.25
  });

  const lineMaterial = new THREE.LineBasicMaterial({
    color: goldDark,
    transparent: true,
    opacity: 0.36,
    blending: THREE.AdditiveBlending
  });

  const heroRig = new THREE.Group();
  scene.add(heroRig);

  const laptop = new THREE.Group();
  laptop.position.set(0, -0.18, 0);
  heroRig.add(laptop);

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 2.12), laptopWire);
  base.position.set(0, -0.65, 0.25);
  laptop.add(base);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.1, 0.08), laptopWire);
  screen.position.set(0, 0.34, -0.72);
  screen.rotation.x = THREE.MathUtils.degToRad(-18);
  laptop.add(screen);

  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.58, 1.78), screenGlowMaterial);
  screenGlow.position.set(0, 0.35, -0.66);
  screenGlow.rotation.x = screen.rotation.x;
  laptop.add(screenGlow);

  const diagonalShape = new THREE.Shape();
  diagonalShape.moveTo(-1.29, -0.89);
  diagonalShape.lineTo(-1.29, 0.42);
  diagonalShape.lineTo(1.16, -0.89);
  diagonalShape.lineTo(-1.29, -0.89);
  const diagonalFill = new THREE.Mesh(new THREE.ShapeGeometry(diagonalShape), splitMaterial);
  diagonalFill.position.set(0, 0.35, -0.635);
  diagonalFill.rotation.x = screen.rotation.x;
  laptop.add(diagonalFill);

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.15, 24), laptopWire);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, -0.55, -0.75);
  laptop.add(hinge);

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const key = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.012, 0.045), solidGold);
      key.position.set(-0.78 + col * 0.22, -0.56, -0.28 + row * 0.18);
      laptop.add(key);
    }
  }

  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.013, 0.34), solidGold);
  trackpad.position.set(0, -0.555, 0.58);
  laptop.add(trackpad);

  const orbitRig = new THREE.Group();
  heroRig.add(orbitRig);

  const rings = [
    new THREE.Mesh(new THREE.TorusGeometry(4.1, 0.03, 8, 120), ringMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(5.15, 0.018, 8, 120), ringMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.014, 8, 96), ringMaterial)
  ];
  rings[0].rotation.x = THREE.MathUtils.degToRad(68);
  rings[1].rotation.x = THREE.MathUtils.degToRad(84);
  rings[1].rotation.z = THREE.MathUtils.degToRad(18);
  rings[1].material.opacity = 0.22;
  rings[2].rotation.x = THREE.MathUtils.degToRad(38);
  rings[2].rotation.z = THREE.MathUtils.degToRad(-28);
  rings[2].material.opacity = 0.28;
  rings.forEach((ring) => orbitRig.add(ring));

  const commerceCards = [];
  const cardCount = isMobile ? 4 : 8;
  for (let i = 0; i < cardCount; i += 1) {
    const cardGroup = new THREE.Group();
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.48, 0.04), nodeMaterial);
    cardGroup.add(card);

    const barCount = 3;
    for (let b = 0; b < barCount; b += 1) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06 + b * 0.055, 0.035), solidGold);
      bar.position.set(-0.22 + b * 0.18, -0.13 + b * 0.027, 0.045);
      cardGroup.add(bar);
    }

    const radius = isMobile ? 3.25 : 4.65;
    const angle = (i / cardCount) * Math.PI * 2;
    cardGroup.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.4) * 1.2, Math.sin(angle) * radius * 0.45);
    cardGroup.rotation.set(0.2, -angle, 0.08);
    cardGroup.userData = { angle, radius, speed: 0.0024 + i * 0.00016 };
    commerceCards.push(cardGroup);
    orbitRig.add(cardGroup);
  }

  const dataLines = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4 + i * 1.25, -1.4 + Math.sin(i) * 0.4, -3 - i * 0.45),
      new THREE.Vector3(-1.8 + i * 0.38, 1.1 + Math.cos(i) * 0.55, -1.5),
      new THREE.Vector3(1.8 - i * 0.26, -0.55 + Math.sin(i * 2) * 0.35, 1.2),
      new THREE.Vector3(4 - i * 0.65, 1.25 - Math.cos(i) * 0.4, -2.6)
    ]);
    const points = curve.getPoints(70);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    line.userData = { speed: 0.001 + i * 0.00035 };
    dataLines.add(line);
  }
  heroRig.add(dataLines);

  const particleCount = isMobile ? 120 : 520;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSpeeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i += 1) {
    const index = i * 3;
    particlePositions[index] = (Math.random() - 0.5) * 66;
    particlePositions[index + 1] = (Math.random() - 0.5) * 58;
    particlePositions[index + 2] = (Math.random() - 0.5) * 66;
    particleSpeeds[i] = 0.014 + Math.random() * 0.034;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: gold,
    size: isMobile ? 0.075 : 0.06,
    transparent: true,
    opacity: 0.66,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const backgroundMaterial = new THREE.MeshStandardMaterial({
    color: goldDark,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const backgroundShape = new THREE.Mesh(new THREE.IcosahedronGeometry(8.4, 1), backgroundMaterial);
  backgroundShape.position.set(0, 0, -22);
  scene.add(backgroundShape);

  const rearPrism = new THREE.Mesh(new THREE.DodecahedronGeometry(5.8, 0), backgroundMaterial.clone());
  rearPrism.material.opacity = 0.08;
  rearPrism.position.set(isMobile ? -1.4 : -6, -0.7, -14);
  scene.add(rearPrism);

  scene.add(new THREE.AmbientLight(0x1a1000, 0.55));

  const pointLightOne = new THREE.PointLight(0xc9a870, 2.4, 42);
  pointLightOne.position.set(5, 5, 5);
  scene.add(pointLightOne);

  const pointLightTwo = new THREE.PointLight(0xdfc08a, 1.25, 34);
  pointLightTwo.position.set(-5, -3, 3);
  scene.add(pointLightTwo);

  if (THREE.RectAreaLight) {
    const rectLight = new THREE.RectAreaLight(goldLight, 2.1, 7, 4);
    rectLight.position.set(0, 2, 5);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);
  }

  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };
  let baseSpin = 0;
  let frame = 0;

  window.addEventListener(
    "mousemove",
    (event) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;
      targetMouse.x = normalizedX * THREE.MathUtils.degToRad(14);
      targetMouse.y = normalizedY * THREE.MathUtils.degToRad(12);
    },
    { passive: true }
  );

  function resize() {
    const mobileNow = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = mobileNow ? 12.5 : 10;
    camera.position.y = mobileNow ? 1.1 : 1.35;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", resize, { passive: true });

  function animate() {
    requestAnimationFrame(animate);

    frame += 0.016;
    baseSpin += 0.0028;

    mouse.x += (targetMouse.x - mouse.x) * 0.08;
    mouse.y += (targetMouse.y - mouse.y) * 0.08;

    heroRig.rotation.x = -mouse.y * 0.34;
    heroRig.rotation.y = mouse.x * 0.42;

    laptop.position.y = -0.18 + Math.sin(frame * 0.8) * 0.32;
    laptop.rotation.x = -mouse.y;
    laptop.rotation.y = baseSpin + mouse.x;
    screenGlow.material.opacity = 0.11 + Math.sin(frame * 2.6) * 0.035;
    diagonalFill.material.opacity = 0.3 + Math.sin(frame * 2.1) * 0.06;

    rings[0].rotation.x += 0.0022;
    rings[0].rotation.z += 0.0042;
    rings[1].rotation.y += 0.002;
    rings[1].rotation.z -= 0.0028;
    rings[2].rotation.x -= 0.003;
    rings[2].rotation.z += 0.0035;

    commerceCards.forEach((cardGroup, index) => {
      const angle = cardGroup.userData.angle + frame * (0.65 + index * 0.025);
      const radius = cardGroup.userData.radius;
      cardGroup.position.x = Math.cos(angle) * radius;
      cardGroup.position.z = Math.sin(angle) * radius * 0.45;
      cardGroup.position.y = Math.sin(angle * 1.6 + index) * 1.25;
      cardGroup.rotation.y = -angle + Math.PI / 2;
      cardGroup.rotation.x = Math.sin(frame + index) * 0.18;
      cardGroup.rotation.z = Math.cos(frame * 0.8 + index) * 0.1;
    });

    dataLines.rotation.y -= 0.0018;
    dataLines.children.forEach((line) => {
      line.rotation.z += line.userData.speed;
    });

    backgroundShape.rotation.x += 0.0008;
    backgroundShape.rotation.y += 0.001;
    backgroundShape.rotation.z += 0.0006;
    rearPrism.rotation.x -= 0.0007;
    rearPrism.rotation.y += 0.0012;

    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i += 1) {
      const yIndex = i * 3 + 1;
      positions[yIndex] += particleSpeeds[i];
      if (positions[yIndex] > 30) {
        positions[yIndex] = -30;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
})();
