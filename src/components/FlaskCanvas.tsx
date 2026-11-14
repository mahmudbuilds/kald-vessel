import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import type { FlaskEdition } from '../data/products';

export interface FlaskChoreographyState {
  /** 0 = Hero pose, 1 = Anatomy exploded stage */
  explodeProgress: number;
  /** 0 = Hero (right-center), 1 = Anatomy (left-center on desktop) */
  stageShift: number;
  /** 1 = fully visible, 0 = faded away */
  visibility: number;
}

interface FlaskCanvasProps {
  edition: FlaskEdition;
  choreographyRef: React.MutableRefObject<FlaskChoreographyState>;
}

function createMicroGrainTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = 115 + Math.floor(Math.random() * 45);
      data[i] = n;
      data[i + 1] = n;
      data[i + 2] = n;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 10);
  return tex;
}

function createLabelBandTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(244, 241, 234, 0.72)';
    ctx.font = '700 32px "Syne", sans-serif';
    ctx.letterSpacing = '12px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('K A L D ®   ·   0 1', canvas.width / 2, canvas.height / 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

export function FlaskCanvas({ edition, choreographyRef }: FlaskCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const initialEditionRef = useRef(edition);
  const outerMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const accentRingMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Smooth material transition when user switches edition colorways
  useEffect(() => {
    if (!outerMatRef.current || !accentRingMatRef.current) return;
    const targetColor = new THREE.Color(edition.hex);
    const targetRing = new THREE.Color(edition.ringHex);

    gsap.to(outerMatRef.current.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.75,
      ease: 'power3.out',
    });
    gsap.to(outerMatRef.current, {
      metalness: edition.metalness,
      roughness: edition.roughness,
      duration: 0.75,
      ease: 'power3.out',
    });
    gsap.to(accentRingMatRef.current.color, {
      r: targetRing.r,
      g: targetRing.g,
      b: targetRing.b,
      duration: 0.75,
      ease: 'power3.out',
    });
  }, [edition]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.15, 8.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Studio environment reflection for crisp metal highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    envScene.dispose();

    // Key, Rim & Warm Accent Studio Lighting
    const ambient = new THREE.AmbientLight(0xf4f1ea, 0.35);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.5);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const coolRim = new THREE.DirectionalLight(0x9eb5c4, 2.2);
    coolRim.position.set(-6, 3, -4);
    scene.add(coolRim);

    const warmRim = new THREE.PointLight(0xd4724e, 3.4, 16);
    warmRim.position.set(2.5, -2.5, 3.5);
    scene.add(warmRim);

    // Textures
    const grainTex = createMicroGrainTexture();
    const labelTex = createLabelBandTexture();

    // Materials
    const initialEdition = initialEditionRef.current;
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialEdition.hex),
      metalness: initialEdition.metalness,
      roughness: initialEdition.roughness,
      roughnessMap: grainTex,
      bumpMap: grainTex,
      bumpScale: 0.008,
      clearcoat: 0.18,
      clearcoatRoughness: 0.45,
    });
    outerMatRef.current = outerMat;

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#27292e'),
      metalness: 0.85,
      roughness: 0.32,
    });

    const brushedSteelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d2d5da'),
      metalness: 0.96,
      roughness: 0.22,
    });

    const mirrorSteelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#eceef2'),
      metalness: 1.0,
      roughness: 0.08,
      clearcoat: 0.5,
    });

    const copperFoilMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d4724e'),
      metalness: 0.95,
      roughness: 0.18,
    });

    const accentRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialEdition.ringHex),
      metalness: 0.88,
      roughness: 0.24,
    });
    accentRingMatRef.current = accentRingMat;

    const siliconeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#131316'),
      metalness: 0.05,
      roughness: 0.9,
    });

    // Master Flask Root Group
    const flaskRoot = new THREE.Group();
    scene.add(flaskRoot);

    // 1. OUTER POWDER-COATED SHELL (Lathe profile)
    const outerShellGroup = new THREE.Group();
    const outerPoints = [
      new THREE.Vector2(0.0, -1.65),
      new THREE.Vector2(0.68, -1.65),
      new THREE.Vector2(0.75, -1.56),
      new THREE.Vector2(0.75, 0.95),
      new THREE.Vector2(0.72, 1.15),
      new THREE.Vector2(0.56, 1.38),
      new THREE.Vector2(0.52, 1.44),
      new THREE.Vector2(0.49, 1.44),
      new THREE.Vector2(0.49, 1.32),
      new THREE.Vector2(0.69, 1.08),
      new THREE.Vector2(0.69, -1.54),
      new THREE.Vector2(0.0, -1.54),
    ];
    const outerGeo = new THREE.LatheGeometry(outerPoints, 72);
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerShellGroup.add(outerMesh);

    const labelGeo = new THREE.CylinderGeometry(0.753, 0.753, 0.24, 64, 1, true);
    const labelMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -1.15;
    outerShellGroup.add(labelMesh);
    flaskRoot.add(outerShellGroup);

    // 2. VULCANIZED SILICONE BASE FOOT
    const baseRingGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(0.74, 0.71, 0.14, 64);
    const baseMesh = new THREE.Mesh(baseGeo, siliconeMat);
    baseMesh.position.y = -1.69;
    baseRingGroup.add(baseMesh);
    flaskRoot.add(baseRingGroup);

    // 3. COPPER RADIATION SHIELD SLEEVE (inside outer shell)
    const copperShieldGroup = new THREE.Group();
    const copperGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.25, 64, 1, true);
    const copperMesh = new THREE.Mesh(copperGeo, copperFoilMat);
    copperMesh.position.y = -0.25;
    copperShieldGroup.add(copperMesh);

    const copperCapRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.015, 16, 64),
      copperFoilMat
    );
    copperCapRing.rotation.x = Math.PI / 2;
    copperCapRing.position.y = 0.875;
    copperShieldGroup.add(copperCapRing);
    flaskRoot.add(copperShieldGroup);

    // 4. ELECTROPOLISHED SURGICAL STEEL INNER VESSEL
    const innerCoreGroup = new THREE.Group();
    const innerPoints = [
      new THREE.Vector2(0.0, -1.42),
      new THREE.Vector2(0.57, -1.42),
      new THREE.Vector2(0.61, -1.34),
      new THREE.Vector2(0.61, 0.98),
      new THREE.Vector2(0.51, 1.24),
      new THREE.Vector2(0.47, 1.48),
      new THREE.Vector2(0.44, 1.48),
      new THREE.Vector2(0.44, 1.24),
      new THREE.Vector2(0.56, 0.96),
      new THREE.Vector2(0.56, -1.36),
      new THREE.Vector2(0.0, -1.36),
    ];
    const innerGeo = new THREE.LatheGeometry(innerPoints, 64);
    const innerMesh = new THREE.Mesh(innerGeo, mirrorSteelMat);
    innerCoreGroup.add(innerMesh);
    flaskRoot.add(innerCoreGroup);

    // 5. PRECISION NECK COLLAR + THREADS + COPPER SEAL RING
    const collarGroup = new THREE.Group();
    const neckTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.505, 0.505, 0.28, 64, 1, true),
      brushedSteelMat
    );
    neckTube.position.y = 1.53;
    collarGroup.add(neckTube);

    for (let i = 0; i < 3; i++) {
      const thread = new THREE.Mesh(
        new THREE.TorusGeometry(0.512, 0.013, 12, 64),
        brushedSteelMat
      );
      thread.rotation.x = Math.PI / 2;
      thread.position.y = 1.47 + i * 0.065;
      collarGroup.add(thread);
    }

    const accentRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.535, 0.022, 16, 64),
      accentRingMat
    );
    accentRing.rotation.x = Math.PI / 2;
    accentRing.position.y = 1.41;
    collarGroup.add(accentRing);

    const oRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.495, 0.02, 16, 64),
      siliconeMat
    );
    oRing.rotation.x = Math.PI / 2;
    oRing.position.y = 1.66;
    collarGroup.add(oRing);

    flaskRoot.add(collarGroup);

    // 6. KNURLED CNC TITANIUM CAP + INTEGRATED BAIL HANDLE
    const capGroup = new THREE.Group();
    const capBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.535, 0.545, 0.38, 64),
      titaniumMat
    );
    capBody.position.y = 1.82;
    capGroup.add(capBody);

    const capBevel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.47, 0.535, 0.07, 64),
      titaniumMat
    );
    capBevel.position.y = 2.045;
    capGroup.add(capBevel);

    const knurlGeo = new THREE.BoxGeometry(0.016, 0.27, 0.02);
    const knurlCount = 44;
    for (let i = 0; i < knurlCount; i++) {
      const angle = (i / knurlCount) * Math.PI * 2;
      const rib = new THREE.Mesh(knurlGeo, titaniumMat);
      rib.position.set(
        Math.cos(angle) * 0.542,
        1.82,
        Math.sin(angle) * 0.542
      );
      rib.rotation.y = -angle;
      capGroup.add(rib);
    }

    const loopGeo = new THREE.TorusGeometry(0.28, 0.026, 16, 48, Math.PI);
    const loopMesh = new THREE.Mesh(loopGeo, brushedSteelMat);
    loopMesh.position.set(0, 2.04, 0);
    loopMesh.rotation.x = 0.25;
    capGroup.add(loopMesh);

    flaskRoot.add(capGroup);

    // 7. CAD EXPLOSION AXIS HALO RING (only visible when exploded)
    const cadHaloMat = new THREE.MeshBasicMaterial({
      color: 0xd4724e,
      transparent: true,
      opacity: 0,
      wireframe: false,
    });
    const cadHaloGeo = new THREE.RingGeometry(1.18, 1.2, 72);
    const cadHalo = new THREE.Mesh(cadHaloGeo, cadHaloMat);
    cadHalo.rotation.x = Math.PI / 2 - 0.15;
    cadHalo.position.y = 0.15;
    flaskRoot.add(cadHalo);

    // 8. AMBIENT FLOATING MICRO-PARTICLES
    const particleCount = 70;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf4f1ea,
      size: 0.025,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interactive Drag & Hover Parallax State (mouse only on desktop so mobile touch scroll stays silky)
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    let isDragging = false;
    let prevX = 0;
    let dragRotY = 0;
    let targetDragRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (isCoarsePointer || e.pointerType === 'touch') return;
      isDragging = true;
      prevX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (isCoarsePointer || e.pointerType === 'touch') return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (isDragging) {
        const deltaX = e.clientX - prevX;
        targetDragRotY += deltaX * 0.01;
        prevX = e.clientX;
      }
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.style.touchAction = 'pan-y';
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { explodeProgress, stageShift, visibility } = choreographyRef.current;

      container.style.opacity = String(visibility);
      container.style.pointerEvents =
        !isCoarsePointer && visibility > 0.35 ? 'auto' : 'none';

      dragRotY += (targetDragRotY - dragRotY) * 0.08;

      const w = window.innerWidth;
      const isDesktop = w >= 1024;
      const isTablet = w >= 640 && w < 1024;
      const heroX = isDesktop ? 1.55 : 0;
      const anatomyX = isDesktop ? -1.3 : 0;
      const targetX = THREE.MathUtils.lerp(heroX, anatomyX, stageShift);

      // Pull camera back cleanly during explosion so all 5 layers fit inside frame
      const targetCamZ = THREE.MathUtils.lerp(
        8.8,
        isDesktop ? 11.4 : isTablet ? 12.6 : 13.8,
        explodeProgress
      );
      const targetCamY = THREE.MathUtils.lerp(0.15, isDesktop ? 0.38 : 0.2, explodeProgress);
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;

      const heroScale = isDesktop ? 0.98 : isTablet ? 0.5 : 0.39;
      const anatomyScale = isDesktop ? 0.72 : isTablet ? 0.36 : 0.33;
      const targetScale = THREE.MathUtils.lerp(heroScale, anatomyScale, explodeProgress);

      // On mobile/tablet, align the bottle inside each section's dedicated showcase window
      const mobileOffsetY = isDesktop
        ? 0
        : THREE.MathUtils.lerp(isTablet ? 1.15 : 1.05, isTablet ? 0.2 : 0.14, stageShift);

      flaskRoot.position.x += (targetX - flaskRoot.position.x) * 0.08;
      flaskRoot.position.y =
        Math.sin(t * 1.1) * 0.05 + mobileOffsetY - explodeProgress * 0.14;
      flaskRoot.scale.setScalar(targetScale);

      const targetTiltZ = THREE.MathUtils.lerp(-0.14, 0.02, explodeProgress);
      const targetTiltX =
        THREE.MathUtils.lerp(0.14, 0.16, explodeProgress) + mouseY * 0.08;

      flaskRoot.rotation.z += (targetTiltZ - flaskRoot.rotation.z) * 0.08;
      flaskRoot.rotation.x += (targetTiltX - flaskRoot.rotation.x) * 0.08;
      flaskRoot.rotation.y =
        t * 0.24 + dragRotY + mouseX * 0.22 + explodeProgress * 1.4;

      // Calibrated exploded layer offsets (fits cleanly within viewport height)
      baseRingGroup.position.y = -explodeProgress * 1.15;
      outerShellGroup.position.y = -explodeProgress * 0.85;
      copperShieldGroup.position.y = explodeProgress * 0.22;
      innerCoreGroup.position.y = explodeProgress * 0.85;
      collarGroup.position.y = explodeProgress * 1.32;
      capGroup.position.y = explodeProgress * 1.72;

      cadHaloMat.opacity = explodeProgress * 0.32;
      cadHalo.rotation.z = t * 0.25;

      particles.rotation.y = t * 0.05;
      particles.position.y = Math.sin(t * 0.4) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      grainTex.dispose();
      labelTex.dispose();
      outerGeo.dispose();
      labelGeo.dispose();
      baseGeo.dispose();
      copperGeo.dispose();
      innerGeo.dispose();
      cadHaloGeo.dispose();
      particleGeo.dispose();
      envRT.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, [choreographyRef]);

  return (
    <div
      ref={mountRef}
      data-cursor="DRAG 3D"
      className="fixed inset-0 z-20 cursor-grab transition-opacity duration-300 active:cursor-grabbing"
      aria-label="Interactive 3D KALD Vacuum Flask"
    />
  );
}
