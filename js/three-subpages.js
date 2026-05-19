(function () {
  if (!window.THREE) return;

  const canvases = document.querySelectorAll("[data-subpage-scene]");
  if (!canvases.length) return;

  canvases.forEach((canvas) => {
    const parent = canvas.parentElement;
    const sceneType = canvas.dataset.subpageScene || "portfolio";
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x080808, 18, 62);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
    camera.position.set(0, 0.3, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const gold = new THREE.Color(0xc9a870);
    const goldLight = new THREE.Color(0xdfc08a);
    const maroon = new THREE.Color(0x3a1f2a);

    const wireMaterial = new THREE.MeshStandardMaterial({
      color: gold,
      wireframe: true,
      transparent: true,
      opacity: 0.62,
      metalness: 0.72,
      roughness: 0.25
    });

    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: goldLight,
      transparent: true,
      opacity: 0.13,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const solidMaterial = new THREE.MeshStandardMaterial({
      color: sceneType === "pricing" ? goldLight : maroon,
      transparent: true,
      opacity: sceneType === "pricing" ? 0.35 : 0.45,
      metalness: 0.7,
      roughness: 0.2
    });

    scene.add(new THREE.AmbientLight(0x1a1000, 0.78));

    const key = new THREE.PointLight(0xc9a870, 1.8, 32);
    key.position.set(4, 5, 6);
    scene.add(key);

    const fill = new THREE.PointLight(0xdfc08a, 0.85, 28);
    fill.position.set(-5, -2, 4);
    scene.add(fill);

    const rig = new THREE.Group();
    rig.position.set(window.innerWidth < 760 ? 0 : 3.15, 0.2, 0);
    scene.add(rig);

    const primary = sceneType === "pricing"
      ? new THREE.Mesh(new THREE.OctahedronGeometry(1.65, 1), wireMaterial)
      : new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 1.4), wireMaterial);
    rig.add(primary);

    const secondary = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), wireMaterial.clone());
    secondary.material.opacity = 0.34;
    secondary.position.set(-1.9, -1.1, -1.2);
    rig.add(secondary);

    const tertiary = new THREE.Mesh(new THREE.TetrahedronGeometry(1.05, 0), wireMaterial.clone());
    tertiary.material.opacity = 0.45;
    tertiary.position.set(2.1, 1.25, -0.8);
    rig.add(tertiary);

    const rings = [];
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7 + i * 0.72, 0.016, 8, 96), wireMaterial.clone());
      ring.material.opacity = 0.22 - i * 0.035;
      ring.rotation.x = THREE.MathUtils.degToRad(55 + i * 13);
      ring.rotation.z = THREE.MathUtils.degToRad(i * 26);
      rings.push(ring);
      rig.add(ring);
    }

    const panels = [];
    for (let i = 0; i < 6; i += 1) {
      const panel = new THREE.Group();
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.48), ghostMaterial);
      panel.add(plane);

      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.02), solidMaterial);
      bar.position.set(0, -0.04, 0.035);
      panel.add(bar);

      const angle = (i / 6) * Math.PI * 2;
      panel.position.set(Math.cos(angle) * 3.6, Math.sin(angle * 1.2) * 1.35, Math.sin(angle) * 1.55);
      panel.rotation.y = -angle;
      panel.userData = { angle, speed: 0.35 + i * 0.03 };
      panels.push(panel);
      rig.add(panel);
    }

    const particleCount = window.innerWidth < 768 ? 70 : 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3;
      particlePositions[index] = (Math.random() - 0.5) * 28;
      particlePositions[index + 1] = (Math.random() - 0.5) * 18;
      particlePositions[index + 2] = (Math.random() - 0.5) * 24;
      particleSpeeds[i] = 0.005 + Math.random() * 0.018;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: gold,
      size: 0.055,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;

    window.addEventListener(
      "mousemove",
      (event) => {
        target.x = event.clientX / window.innerWidth - 0.5;
        target.y = event.clientY / window.innerHeight - 0.5;
      },
      { passive: true }
    );

    function resize() {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(360, rect.height);
      camera.aspect = width / height;
      camera.position.z = window.innerWidth < 760 ? 11.2 : 10;
      rig.position.x = window.innerWidth < 760 ? 0 : 3.15;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      frame += 0.016;
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;

      rig.rotation.y = frame * 0.22 + mouse.x * 0.42;
      rig.rotation.x = Math.sin(frame * 0.6) * 0.08 - mouse.y * 0.18;
      primary.rotation.x += 0.007;
      primary.rotation.y += 0.01;
      secondary.rotation.y -= 0.011;
      tertiary.rotation.x += 0.013;

      rings.forEach((ring, index) => {
        ring.rotation.z += 0.002 + index * 0.001;
        ring.rotation.x += 0.0008;
      });

      panels.forEach((panel, index) => {
        const angle = panel.userData.angle + frame * panel.userData.speed;
        panel.position.x = Math.cos(angle) * 3.6;
        panel.position.z = Math.sin(angle) * 1.55;
        panel.position.y = Math.sin(angle * 1.3 + index) * 1.3;
        panel.rotation.y = -angle + Math.PI / 2;
      });

      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i += 1) {
        const yIndex = i * 3 + 1;
        positions[yIndex] += particleSpeeds[i];
        if (positions[yIndex] > 9) positions[yIndex] = -9;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  });
})();
