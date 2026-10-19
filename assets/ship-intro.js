import * as THREE from 'three';
import {GLTFLoader} from './vendor/three/loaders/GLTFLoader.js';
import {RoomEnvironment} from './vendor/three/environments/RoomEnvironment.js';
import {MeshoptDecoder} from './vendor/meshopt/meshopt_decoder.js';

const root = document.documentElement;
const hero = document.querySelector('#inicio');
const capabilitiesSection = document.querySelector('#capacidades');
const careerSection = document.querySelector('#trayectoria');
const mainElement = document.querySelector('#main');
const cosmicBackground = document.querySelector('.cosmic-background');
const layer = document.querySelector('.ship-intro-layer');
const canvas = layer?.querySelector('canvas');
const revealBlocks = [...document.querySelectorAll('[data-ship-reveal]')];
const replay = document.querySelector('.ship-replay');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, t) => {
  const v = clamp((t - a) / (b - a));
  return v * v * (3 - 2 * v);
};
const lerp = THREE.MathUtils.lerp;

let renderer, scene, camera, ship, layout;
let ready = false, running = false, raf = 0, lastNow = 0, elapsed = 0, watchdog, finished = false;
let flightMode = 'hero'; // 'hero' | 'capabilities' | 'trayectoria'
let capPlayedInView = false;
let careerInView = false;
let careerLoopTimer = 0;
let initialHeroPlayed = false;
let autoPlayEnabled = true;
let trails = [], mist = [], arcs = [], orbs = [], gravRings = [];
let coreGlow, innerCoreGlow, gravShellMat, bowWaveMat;
let charItems = [];
let lastW = 0, lastH = 0;

const engineLocal = new THREE.Vector3(0, -6.05, 0.30);

// Reuse math objects to reduce allocations during flight.
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler(0, 0, 0, 'XYZ');
const _baseEuler = new THREE.Euler(0, 0, 0, 'ZXY');
const _rollQuat = new THREE.Quaternion();
const _localYAxis = new THREE.Vector3(0, 1, 0);
const _engWorld = new THREE.Vector3();
const _proj = new THREE.Vector3();
const _shipProj = new THREE.Vector3();
const _tmpVec = new THREE.Vector3();
const _targetVec = new THREE.Vector3();

// Pre-allocated wake spine buffer (24 samples for fast CPU->GPU transfer)
const SPINE_LEN = 24;
const spineX = new Float32Array(SPINE_LEN);
const spineY = new Float32Array(SPINE_LEN);
const spineZ = new Float32Array(SPINE_LEN);

/**
 * Splits [data-ship-reveal] elements into individual character spans (.ship-char)
 * while preserving nested styling elements (.given-name, .surname, .title-star, em)
 * and screen-reader accessibility, then caches their natural screen centers in one read pass.
 */
function prepareCharacters() {
  if (charItems.length > 0) return;

  revealBlocks.forEach(block => {
    if (block.dataset.shipSplit === 'true') return;
    const textForAria = block.textContent.trim().replace(/\s+/g, ' ');
    if (!block.getAttribute('aria-label')) {
      block.setAttribute('aria-label', textForAria);
    }

    function splitNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (!text) return;
        const frag = document.createDocumentFragment();
        for (const ch of text) {
          if (ch === ' ' || ch === '\n' || ch === '\t') {
            frag.appendChild(document.createTextNode(ch));
          } else {
            const span = document.createElement('span');
            span.className = 'ship-char';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = ch;
            frag.appendChild(span);
            charItems.push({ el: span, cx: 0, cy: 0, settled: false, hidden: true });
          }
        }
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('title-star')) {
          node.classList.add('ship-char');
          charItems.push({ el: node, cx: 0, cy: 0, settled: false, hidden: true });
          return;
        }
        [...node.childNodes].forEach(splitNode);
      }
    }

    [...block.childNodes].forEach(splitNode);
    block.dataset.shipSplit = 'true';
  });

  // Measure natural character coordinates in a single read pass before any inline transforms
  for (let i = 0; i < charItems.length; i++) {
    const r = charItems[i].el.getBoundingClientRect();
    charItems[i].cx = r.left + r.width * 0.5;
    charItems[i].cy = r.top + r.height * 0.5;
  }
}

function resetCharactersHidden() {
  for (let i = 0; i < charItems.length; i++) {
    const item = charItems[i];
    item.settled = false;
    item.hidden = true;
    item.el.style.opacity = '0';
    item.el.style.transform = 'translate3d(0, 10px, 0)';
  }
}

function revealAllCharactersInstantly() {
  for (let i = 0; i < charItems.length; i++) {
    const item = charItems[i];
    item.settled = true;
    item.hidden = false;
    item.el.style.opacity = '';
    item.el.style.transform = '';
  }
}

function finish() {
  running = false;
  finished = true;
  cancelAnimationFrame(raf);
  clearTimeout(watchdog);
  clearTimeout(careerLoopTimer);
  root.classList.remove('ship-intro-capable', 'ship-intro-running');
  root.classList.add('ship-intro-complete');
  revealAllCharactersInstantly();
  if (mainElement) {
    mainElement.style.transform = '';
    mainElement.style.willChange = '';
  }
  if (cosmicBackground) {
    cosmicBackground.style.transform = '';
  }
  if (camera) {
    camera.position.set(0, 0, 12);
  }
  if (layer) {
    layer.hidden = true;
    layer.classList.remove('ship-behind-content');
  }
  if (replay) replay.disabled = false;
  if (renderer) renderer.clear();
}

function glowTexture() {
  const el = document.createElement('canvas');
  el.width = el.height = 128;
  const c = el.getContext('2d');
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.10, 'rgba(220,248,255,0.92)');
  g.addColorStop(0.28, 'rgba(130,220,255,0.38)');
  g.addColorStop(0.62, 'rgba(140,110,255,0.08)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(el);
}

function glow(map, color, size, opacity = 1) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  sprite.scale.setScalar(size);
  return sprite;
}

/**
 * Builds the 3D gravitational warp field around the ship, shockwave rings,
 * volumetric plasma wake, and wing weapon charges.
 */
function setupEffects() {
  const map = glowTexture();

  // Engine core glows (outer halo + intense inner plasma core)
  coreGlow = glow(map, 0x64e8ff, 3.4, 0.9);
  coreGlow.position.copy(engineLocal);
  ship.add(coreGlow);

  innerCoreGlow = glow(map, 0xffffff, 1.65, 0.98);
  innerCoreGlow.position.copy(engineLocal);
  ship.add(innerCoreGlow);

  // 1. 3D Gravitational Warp Shell enveloping the ship (Fresnel spacetime distortion)
  gravShellMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vLocalPos;
      uniform float uTime;
      void main() {
        vLocalPos = position;
        vec3 displaced = position;
        float ripple = sin(position.y * 1.6 - uTime * 9.0) * 0.045;
        displaced += normal * ripple;
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vLocalPos;
      uniform float uTime;
      uniform float uIntensity;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - abs(dot(normal, viewDir));
        float rim = pow(clamp(fresnel, 0.0, 1.0), 2.6);

        // Travelling gravitational waves from nose (+Y) to tail (-Y)
        float wave1 = 0.5 + 0.5 * sin(vLocalPos.y * 2.4 - uTime * 10.5 + cos(vLocalPos.x * 2.0));
        float wave2 = 0.5 + 0.5 * sin(vLocalPos.y * 4.2 - uTime * 15.0 - abs(vLocalPos.x) * 1.6);
        float wavePattern = mix(wave1, wave2, 0.45);

        vec3 cyan = vec3(0.42, 0.90, 1.0);
        vec3 violet = vec3(0.72, 0.50, 1.0);
        vec3 gold = vec3(1.0, 0.82, 0.45);
        vec3 col = mix(violet, cyan, wave1);
        col = mix(col, gold, pow(wave2, 3.0) * 0.25);

        // Soft fade at extremes so the shell never looks like a hard sphere
        float radialDist = length(vec3(vLocalPos.x * 0.13, (vLocalPos.y - 0.6) * 0.11, vLocalPos.z * 0.42));
        float shellFade = 1.0 - smoothstep(0.65, 1.02, radialDist);

        float alpha = rim * (0.14 + 0.34 * wavePattern) * shellFade * uIntensity;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.52));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide
  });

  const gravShellGeom = new THREE.SphereGeometry(1, 20, 14);
  gravShellGeom.scale(7.9, 8.6, 2.35);
  const gravShell = new THREE.Mesh(gravShellGeom, gravShellMat);
  gravShell.position.set(0, 0.7, 0.05);
  gravShell.frustumCulled = false;
  ship.add(gravShell);

  // 2. Bow Shockwave Arc ahead of the nose/wings (Mach gravitational wave)
  bowWaveMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uIntensity;
      void main() {
        float arc = sin(vUv.x * 3.14159265);
        float radial = sin(vUv.y * 3.14159265);
        float pulse = 0.7 + 0.3 * sin(uTime * 12.0 - vUv.x * 6.0);
        vec3 col = mix(vec3(0.55, 0.42, 1.0), vec3(0.45, 0.92, 1.0), radial);
        float alpha = pow(arc, 1.8) * pow(radial, 2.2) * 0.38 * pulse * uIntensity;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const bowGeom = new THREE.RingGeometry(5.6, 7.6, 24, 1, Math.PI * 0.18, Math.PI * 0.64);
  const bowMesh = new THREE.Mesh(bowGeom, bowWaveMat);
  bowMesh.position.set(0, 2.2, 0.25);
  bowMesh.scale.set(1.05, 1.15, 1);
  bowMesh.frustumCulled = false;
  ship.add(bowMesh);

  // 3. Expanding Gravitational Shockwave Rings in World Space along the wake
  const ringBaseGeom = new THREE.RingGeometry(0.72, 1.0, 24);
  for (let i = 0; i < 4; i++) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x70ecff : 0xb388ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringBaseGeom, ringMat);
    ringMesh.frustumCulled = false;
    ringMesh.visible = false;
    scene.add(ringMesh);
    gravRings.push({ mesh: ringMesh, mat: ringMat, spawnP: 0.10 + i * 0.18 });
  }

  // 4. Smooth Wake Trails (4 ribbons x 24 vertices)
  for (let j = 0; j < 4; j++) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SPINE_LEN * 3), 3));
    geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(SPINE_LEN * 3), 3));
    const line = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.85
      })
    );
    line.frustumCulled = false;
    scene.add(line);
    trails.push(line);
  }

  // 5. Ionized Plasma Mist Sprites along the wake
  for (let j = 0; j < 10; j++) {
    const sprite = glow(map, j % 2 ? 0x9b7aff : 0x62dcff, 1, 0.16);
    scene.add(sprite);
    mist.push(sprite);
  }

  // 6. Wing Energy Orbs & Lightning Arcs
  const orbGeom = new THREE.SphereGeometry(0.48, 12, 10);
  const orbMat = new THREE.MeshBasicMaterial({ color: 0xffd25a });
  for (const side of [-1, 1]) {
    const group = new THREE.Group();
    ship.add(group);
    const sphere = new THREE.Mesh(orbGeom, orbMat);
    group.add(sphere);
    const halo = glow(map, 0xffbb36, 3.6, 0.88);
    group.add(halo);
    orbs.push({ side, group, sphere, halo });

    [[1.22, 4.4], [1.65, 6.2]].forEach(([x, y], j) => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(13 * 3), 3));
      const line = new THREE.Line(
        geom,
        new THREE.LineBasicMaterial({
          color: 0xffeb9c,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      line.frustumCulled = false;
      ship.add(line);
      arcs.push({ line, side, seed: j + side * 5, origin: new THREE.Vector3(side * x, y, 0.24) });
    });
  }
}

/**
 * Measures the full viewport and caches character centers only when viewport size changes.
 */
function measure(forceCharMeasure = false) {
  prepareCharacters();

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 700;
  const sizeChanged = vw !== lastW || vh !== lastH;

  if (sizeChanged && renderer && camera) {
    lastW = vw;
    lastH = vh;
    renderer.setPixelRatio(1);
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
  }

  const titleRect = hero.querySelector('h1').getBoundingClientRect();
  const factor = 2 * Math.tan(THREE.MathUtils.degToRad((camera ? camera.fov : 36) / 2));
  const initialWidth = mobile ? clamp(vw * 0.54, 165, 250) : clamp(vw * 0.23, 270, 420);

  if (forceCharMeasure || sizeChanged || (charItems.length > 0 && charItems[0].cx === 0)) {
    for (let i = 0; i < charItems.length; i++) {
      charItems[i].el.style.transform = 'none';
    }
    for (let i = 0; i < charItems.length; i++) {
      const r = charItems[i].el.getBoundingClientRect();
      charItems[i].cx = r.left + r.width * 0.5;
      charItems[i].cy = r.top + r.height * 0.5;
    }
    for (let i = 0; i < charItems.length; i++) {
      if (charItems[i].hidden) {
        charItems[i].el.style.transform = 'translate3d(0, 10px, 0)';
      }
    }
  }

  return {
    width: vw,
    height: vh,
    mobile,
    factor,
    titleY: clamp(titleRect.top + titleRect.height * 0.5, vh * 0.34, vh * 0.64),
    scale: (initialWidth / vh) * 26 * factor / 14,
    duration: mobile ? 4400 : 4900,
    capDuration: mobile ? 4600 : 5400,
    careerDuration: mobile ? 3000 : 3400
  };
}

/**
 * Evaluates 3D ship position and orientation at flight progress p in [0, 1]
 * without allocating any heap objects.
 */
function evaluatePose(p, outPos, outQuat) {
  const { width, height, factor, titleY, scale, mobile } = layout;
  const cp = clamp(p, 0, 1);

  if (flightMode === 'trayectoria') {
    const careerScale = scale * (mobile ? 0.46 : 0.50);
    const distance = 14.2 - 1.2 * Math.sin(cp * Math.PI);
    const sy = lerp(height * 1.28, -height * 0.88, cp);
    const posX = 0.494 * (distance - 1.07 * careerScale) * factor * camera.aspect - 7.28 * careerScale;

    outPos.set(
      posX,
      (0.5 - sy / height) * distance * factor,
      12 - distance
    );

    const pitchX = 0.20 - 0.12 * Math.sin(cp * Math.PI);
    const rollZ = 0.02 * Math.sin(cp * Math.PI);
    _euler.set(pitchX, 0, rollZ, 'XYZ');
    outQuat.setFromEuler(_euler);

    return careerScale;
  }

  if (flightMode === 'capabilities') {
    const capScale = scale * 0.44;
    const rollProgress = smooth(0.10, 0.78, cp);
    const rollAngle = rollProgress * Math.PI * 2;

    const distance = 22.5 - 2.2 * Math.sin(cp * Math.PI) - 0.85 * Math.cos(rollAngle);
    const sx = lerp(width * 1.06, -width * 0.44, cp);

    let sectionAnchorY = height * 0.34;
    if (capabilitiesSection) {
      const capRect = capabilitiesSection.getBoundingClientRect();
      sectionAnchorY = clamp(capRect.top + capRect.height * 0.28, height * 0.18, height * 0.64);
    }

    const baseY = sectionAnchorY - Math.sin(cp * Math.PI) * (height * 0.035);
    const barrelOffsetY = -Math.sin(rollAngle) * (height * 0.045) * Math.sin(rollProgress * Math.PI);
    const sy = baseY + barrelOffsetY;

    outPos.set(
      (sx / width - 0.5) * distance * factor * camera.aspect,
      (0.5 - sy / height) * distance * factor,
      12 - distance
    );

    _baseEuler.set(0.32, -0.26, Math.PI * 0.51, 'ZXY');
    _rollQuat.setFromAxisAngle(_localYAxis, rollAngle);
    outQuat.setFromEuler(_baseEuler).multiply(_rollQuat);

    return capScale;
  }

  const q = 1 - cp;
  const distance = 22.0 * Math.pow(0.41, cp);

  const sx = width * (
    -0.02 * q * q * q +
    3 * 0.24 * q * q * cp +
    3 * 0.82 * q * cp * cp +
    1.92 * cp * cp * cp
  );

  const startY = Math.max(height * 0.26, titleY - height * 0.18);
  const midY = titleY + height * 0.045;
  const endY = Math.min(height * 0.72, titleY + height * 0.19);
  const sy = lerp(startY, midY, smooth(0, 0.52, cp)) + (endY - midY) * smooth(0.52, 1, cp);

  outPos.set(
    (sx / width - 0.5) * distance * factor * camera.aspect,
    (0.5 - sy / height) * distance * factor,
    12 - distance
  );

  _euler.set(
    0.56 + 0.28 * Math.sin(cp * Math.PI),
    -0.22 - 0.46 * cp,
    -1.92 + 0.50 * smooth(0, 0.58, cp) - 0.12 * smooth(0.66, 1, cp)
  );
  outQuat.setFromEuler(_euler);
  return scale;
}

function evaluateEngineAt(p, outVec) {
  const s = evaluatePose(p, _pos, _quat);
  outVec.copy(engineLocal).multiplyScalar(s).applyQuaternion(_quat).add(_pos);
}

function updateWakeAndGravitationalField(t, p) {
  const fade = 1 - smooth(0.88, 1, t);
  const maxWake = flightMode === 'capabilities' ? 0.22 : (flightMode === 'trayectoria' ? 0.22 : 0.26);
  const length = Math.min(p, maxWake) * (1 - smooth(0.82, 1, t) * 0.65);
  let modeScale = layout.scale;
  if (flightMode === 'capabilities') {
    modeScale = layout.scale * 0.44;
  } else if (flightMode === 'trayectoria') {
    modeScale = layout.scale * (layout.mobile ? 0.46 : 0.50);
  }

  if (gravShellMat) {
    gravShellMat.uniforms.uTime.value = t * 7.0;
    gravShellMat.uniforms.uIntensity.value = fade;
  }
  if (bowWaveMat) {
    bowWaveMat.uniforms.uTime.value = t * 7.0;
    bowWaveMat.uniforms.uIntensity.value = fade;
  }

  for (let k = 0; k < SPINE_LEN; k++) {
    const f = k / (SPINE_LEN - 1);
    evaluateEngineAt(Math.max(0, p - length * f), _tmpVec);
    spineX[k] = _tmpVec.x;
    spineY[k] = _tmpVec.y;
    spineZ[k] = _tmpVec.z;
  }

  const waveAmpScale = flightMode === 'capabilities' ? 0.48 : (flightMode === 'trayectoria' ? 0.55 : 1.0);

  for (let j = 0; j < trails.length; j++) {
    const line = trails[j];
    const pos = line.geometry.attributes.position;
    const col = line.geometry.attributes.color;
    const isViolet = j % 2 === 1;
    const rCol = isViolet ? 0.65 : 0.48;
    const gCol = isViolet ? 0.54 : 0.93;
    const bCol = 1.0;
    const offsetIdx = j - 1.5;

    for (let k = 0; k < SPINE_LEN; k++) {
      const f = k / (SPINE_LEN - 1);
      const waveY = (offsetIdx * 0.11 * f + Math.sin(f * 10 - t * 18 + j) * 0.042 * f) * waveAmpScale;
      const waveZ = (offsetIdx * 0.05 * f + Math.cos(f * 8 - t * 14 + j) * 0.025 * f) * waveAmpScale;
      pos.setXYZ(k, spineX[k], spineY[k] + waveY, spineZ[k] + waveZ);

      const a = Math.pow(1 - f, 1.35) * fade;
      col.setXYZ(k, rCol * a, gCol * a, bCol * a);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  for (let i = 0; i < mist.length; i++) {
    const sprite = mist[i];
    const f = i / (mist.length - 1);
    const k = Math.min(SPINE_LEN - 1, Math.floor(f * (SPINE_LEN - 1)));
    sprite.position.set(spineX[k], spineY[k], spineZ[k]);
    sprite.scale.setScalar((0.28 + f * 0.82) * modeScale * 2.7);
    sprite.material.opacity = 0.16 * (1 - f) * fade;
  }

  for (let i = 0; i < gravRings.length; i++) {
    const ring = gravRings[i];
    const age = p - ring.spawnP;
    if (age > 0 && age < 0.34) {
      const rp = age / 0.34;
      ring.mesh.visible = true;
      evaluateEngineAt(ring.spawnP, ring.mesh.position);
      ring.mesh.quaternion.copy(_quat);
      ring.mesh.rotateX(Math.PI * 0.5);
      const ringScale = modeScale * (1.2 + rp * 8.5);
      ring.mesh.scale.set(ringScale, ringScale * 0.68, 1);
      ring.mat.opacity = Math.sin(rp * Math.PI) * (1 - rp * 0.7) * 0.28 * fade;
    } else {
      ring.mesh.visible = false;
    }
  }

  const pulse = 0.82 + Math.sin(t * 75) * 0.14;
  coreGlow.material.opacity = pulse * fade;
  innerCoreGlow.material.opacity = Math.min(1, (pulse + 0.15) * fade);
}

function updateWeapons(t) {
  const charge = smooth(0.26, 0.46, t);
  const shot = smooth(0.53, 0.69, t);
  const alpha = smooth(0.25, 0.32, t) * (1 - smooth(0.69, 0.80, t));

  for (let i = 0; i < orbs.length; i++) {
    const { side, group, sphere, halo } = orbs[i];
    group.visible = alpha > 0.001;
    group.position.set(side * 1.16, 8.5 + shot * 21, 0.30 + shot * 0.5);
    sphere.scale.setScalar(Math.max(0.001, charge * (1 + shot * 0.25)));
    halo.scale.setScalar(3.4 * charge);
    halo.material.opacity = 0.85 * alpha;
  }

  for (let j = 0; j < arcs.length; j++) {
    const { line, side, origin, seed } = arcs[j];
    line.visible = t > 0.26 && t < 0.55;
    if (!line.visible) continue;
    line.material.opacity = alpha * (0.78 + 0.22 * Math.sin(t * 143 + seed));
    _targetVec.set(side * 1.16, 8.5, 0.3);
    const pos = line.geometry.attributes.position;
    for (let i = 0; i < 13; i++) {
      const f = i / 12;
      _tmpVec.copy(origin).lerp(_targetVec, f);
      const w = Math.sin(Math.floor(t * 55) * 1.7 + i * 2.4 + seed) * Math.sin(f * Math.PI);
      pos.setXYZ(i, _tmpVec.x + w * 0.14, _tmpVec.y, _tmpVec.z + w * 0.10);
    }
    pos.needsUpdate = true;
  }
}

/**
 * Updates per-character emergence and gravitational wave undulation.
 * Uses pure GPU-composited opacity + translate3d on a tight active wake band.
 */
function updateGravitationalTextWave(engineScreenX, engineScreenY, t) {
  const waveSpan = layout.mobile ? 175 : 225;

  for (let i = 0; i < charItems.length; i++) {
    const item = charItems[i];
    if (item.settled) continue;

    const dy = item.cy - engineScreenY;
    const wakeFrontX = engineScreenX - Math.abs(dy) * 0.22 - dy * 0.08;
    const distBehind = wakeFrontX - item.cx;
    const u = (distBehind + 24) / waveSpan;

    if (u <= 0) {
      if (!item.hidden) {
        item.el.style.opacity = '0';
        item.hidden = true;
      }
      continue;
    }

    item.hidden = false;

    if (u >= 1 || t >= 0.95) {
      item.settled = true;
      item.el.style.opacity = '1';
      item.el.style.transform = 'none';
      continue;
    }

    const alpha = smooth(0, 0.32, u);
    const env = Math.sin(u * Math.PI) * Math.exp(-2.5 * u);
    const phase = u * 12.0 - item.cx * 0.02;
    const dyWave = Math.sin(phase) * (layout.mobile ? 7.5 : 10.5) * env;
    const dxWave = Math.cos(phase) * 2.8 * env;

    item.el.style.opacity = alpha.toFixed(2);
    item.el.style.transform = `translate3d(${dxWave.toFixed(1)}px,${dyWave.toFixed(1)}px,0)`;
  }
}

function render(t) {
  const p = clamp(t, 0, 1);
  const scale = evaluatePose(p, _pos, _quat);
  ship.position.copy(_pos);
  ship.quaternion.copy(_quat);
  ship.scale.setScalar(scale);

  updateWakeAndGravitationalField(t, p);
  updateWeapons(t);
  renderer.render(scene, camera);

  if (flightMode === 'hero') {
    evaluateEngineAt(p, _engWorld);
    _proj.copy(_engWorld).project(camera);
    const engineScreenX = (_proj.x * 0.5 + 0.5) * layout.width;
    const engineScreenY = (-_proj.y * 0.5 + 0.5) * layout.height;

    updateGravitationalTextWave(engineScreenX, engineScreenY, t);
  }
}

function tick(now) {
  if (!running) return;
  if (document.hidden) {
    finish();
    return;
  }
  const dt = Math.min(now - lastNow, 36);
  lastNow = now;
  elapsed += dt;

  let activeDuration = layout.duration;
  if (flightMode === 'capabilities') {
    activeDuration = layout.capDuration;
  } else if (flightMode === 'trayectoria') {
    activeDuration = layout.careerDuration;
  }
  const t = clamp(elapsed / activeDuration);
  try {
    render(t);
  } catch (error) {
    console.warn('No se pudo completar el vuelo 3D.', error);
    finish();
    return;
  }
  if (t < 1) {
    raf = requestAnimationFrame(tick);
  } else {
    finish();
  }
}

export function start(revealText = true) {
  if (!ready || reduced.matches || document.hidden) {
    finish();
    return;
  }
  const heroRect = hero.getBoundingClientRect();
  if (heroRect.bottom < 120 || heroRect.top > innerHeight * 0.85) {
    finish();
    return;
  }
  cancelAnimationFrame(raf);
  clearTimeout(watchdog);
  clearTimeout(careerLoopTimer);
  flightMode = 'hero';
  initialHeroPlayed = true;
  layout = measure(false);
  if (revealText) resetCharactersHidden();
  else revealAllCharactersInstantly();
  finished = false;
  running = true;
  layer.hidden = false;
  layer.classList.remove('ship-behind-content');
  root.classList.add('ship-intro-capable', 'ship-intro-running');
  root.classList.remove('ship-intro-complete');
  if (replay) replay.disabled = true;

  elapsed = 0;
  render(0);
  raf = requestAnimationFrame(now => {
    lastNow = now;
    raf = requestAnimationFrame(tick);
  });
  watchdog = setTimeout(finish, layout.duration + 2000);
}

function playInitialHero() {
  if (!autoPlayEnabled || !ready || initialHeroPlayed || running || reduced.matches || document.hidden) return;
  const rect = hero.getBoundingClientRect();
  if (rect.bottom > 120 && rect.top < innerHeight * 0.85) {
    start(true);
  } else if (rect.bottom <= 120) {
    finish();
  }
}

function setupHeroObserver() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(playInitialHero, { threshold: [0, 0.2, 0.5] });
  observer.observe(hero);
}

function startCapabilitiesFlyby() {
  if (!ready || reduced.matches || document.hidden || !capabilitiesSection) {
    return;
  }
  cancelAnimationFrame(raf);
  clearTimeout(watchdog);
  clearTimeout(careerLoopTimer);
  revealAllCharactersInstantly();
  root.classList.remove('ship-intro-capable', 'ship-intro-running');
  root.classList.add('ship-intro-complete');
  if (replay) replay.disabled = false;

  flightMode = 'capabilities';
  layout = measure(false);
  finished = false;
  running = true;
  layer.hidden = false;
  layer.classList.remove('ship-behind-content');

  elapsed = 0;
  render(0);
  raf = requestAnimationFrame(now => {
    lastNow = now;
    raf = requestAnimationFrame(tick);
  });
  watchdog = setTimeout(finish, layout.capDuration + 2000);
}

function setupCapabilitiesObserver() {
  if (!capabilitiesSection || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.20) {
        if (!capPlayedInView && ready && !reduced.matches) {
          if (!running || (flightMode === 'hero' && hero.getBoundingClientRect().bottom < innerHeight * 0.45)) {
            capPlayedInView = true;
            startCapabilitiesFlyby();
          }
        }
      } else if (!entry.isIntersecting) {
        capPlayedInView = false;
        if (running && flightMode === 'capabilities') {
          finish();
        }
      }
    }
  }, { threshold: [0, 0.20, 0.45] });
  observer.observe(capabilitiesSection);
}

function startCareerFlyby() {
  if (!ready || reduced.matches || document.hidden || !careerSection) {
    return;
  }
  cancelAnimationFrame(raf);
  clearTimeout(watchdog);
  clearTimeout(careerLoopTimer);
  revealAllCharactersInstantly();
  root.classList.remove('ship-intro-capable', 'ship-intro-running');
  root.classList.add('ship-intro-complete');
  if (replay) replay.disabled = false;

  flightMode = 'trayectoria';
  layout = measure(false);
  finished = false;
  running = true;
  layer.hidden = false;
  layer.classList.add('ship-behind-content');

  elapsed = 0;
  render(0);
  raf = requestAnimationFrame(now => {
    lastNow = now;
    raf = requestAnimationFrame(tick);
  });
  watchdog = setTimeout(finish, layout.careerDuration + 2000);
}

function setupCareerObserver() {
  if (!careerSection || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
        if (!careerInView && ready && !reduced.matches) {
          if (!running || (flightMode !== 'trayectoria' && hero.getBoundingClientRect().bottom < innerHeight * 0.45)) {
            careerInView = true;
            startCareerFlyby();
          }
        }
      } else if (!entry.isIntersecting) {
        careerInView = false;
        clearTimeout(careerLoopTimer);
        if (running && flightMode === 'trayectoria') {
          finish();
        }
      }
    }
  }, { threshold: [0, 0.08, 0.18, 0.35] });
  observer.observe(careerSection);
}

export async function init({ autoplay = true } = {}) {
  autoPlayEnabled = autoplay;
  if (!hero || !canvas || reduced.matches) {
    finish();
    return false;
  }

  try {
    // 1. Kick off network fetch & WASM decoder readiness immediately in parallel with WebGL setup
    const url = new URL('./media/nave-v7-web.glb', import.meta.url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const bufferPromise = fetch(url, { signal: controller.signal }).then(res => {
      if (!res.ok) throw new Error(`Modelo 3D: HTTP ${res.status}`);
      return res.arrayBuffer();
    });

    // 2. While the GLB downloads, measure natural character centers once and keep them hidden
    prepareCharacters();
    resetCharactersHidden();

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: innerWidth < 1440,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    scene.add(new THREE.HemisphereLight(0xc9deff, 0x1c1637, 2.0));
    const key = new THREE.DirectionalLight(0xffe6ce, 3.8);
    key.position.set(-6, 8, 12);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9692ff, 2.5);
    rim.position.set(6, -4, -6);
    scene.add(rim);

    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(environment, 0.04).texture;
    scene.environmentIntensity = 0.62;
    environment.dispose();
    pmrem.dispose();

    // Create ship group BEFORE setupEffects() so effects can attach to ship without error
    ship = new THREE.Group();
    scene.add(ship);

    setupEffects();
    layout = measure(false);

    // 3. Await the GLB buffer and parse it
    let gltf;
    try {
      const [buffer] = await Promise.all([bufferPromise, MeshoptDecoder.ready]);
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      gltf = await loader.parseAsync(buffer, new URL('.', url).href);
    } finally {
      clearTimeout(timeout);
    }

    ship.add(gltf.scene);

    gltf.scene.traverse(o => {
      if (o.isMesh) {
        o.frustumCulled = false;
        o.material.side = THREE.FrontSide;
        o.material.envMapIntensity = 0.68;
        if (o.material.map) {
          o.material.map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 2);
        }
      }
    });

    // Pre-compile ALL shaders (including rings, orbs, and lightning arcs) so there is zero mid-flight compilation hitch
    for (let i = 0; i < gravRings.length; i++) gravRings[i].mesh.visible = true;
    for (let i = 0; i < orbs.length; i++) orbs[i].group.visible = true;
    for (let i = 0; i < arcs.length; i++) arcs[i].line.visible = true;

    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);

    for (let i = 0; i < gravRings.length; i++) gravRings[i].mesh.visible = false;
    for (let i = 0; i < orbs.length; i++) orbs[i].group.visible = false;
    for (let i = 0; i < arcs.length; i++) arcs[i].line.visible = false;

    ready = true;
    root.classList.add('ship-intro-ready');
    setupHeroObserver();
    setupCapabilitiesObserver();
    setupCareerObserver();

    if (autoplay) {
      if (careerSection) {
        const carRect = careerSection.getBoundingClientRect();
        if (carRect.top < innerHeight * 0.75 && carRect.bottom > innerHeight * 0.25 && hero.getBoundingClientRect().bottom < 120) {
          careerInView = true;
          startCareerFlyby();
          return true;
        }
      }
      if (capabilitiesSection) {
        const capRect = capabilitiesSection.getBoundingClientRect();
        if (capRect.top < innerHeight * 0.7 && capRect.bottom > innerHeight * 0.3 && hero.getBoundingClientRect().bottom < 120) {
          capPlayedInView = true;
          startCapabilitiesFlyby();
          return true;
        }
      }
      playInitialHero();
    }

    return true;
  } catch (error) {
    console.warn('La introducción 3D no está disponible en este dispositivo.', error);
    finish();
    throw error;
  }
}

reduced.addEventListener('change', () => {
  if (reduced.matches) finish();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && running) finish();
  else if (!document.hidden) playInitialHero();
});
window.addEventListener('pagehide', finish);
window.addEventListener('resize', () => {
  // Mobile browser bars change the height while opening a page. Keep the flight.
  if (running && Math.abs(innerWidth - layout.width) > 2) finish();
}, { passive: true });
window.addEventListener('scroll', () => {
  if (running && flightMode === 'hero' && hero.getBoundingClientRect().bottom < innerHeight * 0.25) {
    finish();
  }
}, { passive: true });
canvas?.addEventListener('webglcontextlost', finish);
