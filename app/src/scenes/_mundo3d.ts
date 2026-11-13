// MUNDO 3D — base para videos en 3D (three.js) con la identidad Icesi.
// Un solo diorama de papel compartido por todas las escenas: cada escena pone el estado del mundo
// (qué se ve, dónde está cada cosa) y la cámara en función del tiempo, y encima dibuja la capa 2D
// (textos en papel rasgado, puppets, footer) igual que una Plate normal.
// Todo es función pura del tiempo: el mundo se reinicia en cada cuadro con reset().
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D, makeRT } from '../engine/gl';
import { C, Script, clamp, drawFooter, ease, lerp, loadJakarta } from './_kit';

// ---------- materiales ----------
const MATS = new Map<string, THREE.MeshLambertMaterial>();
export function mat(col: string) {
  let m = MATS.get(col);
  if (!m) { m = new THREE.MeshLambertMaterial({ color: new THREE.Color(col), flatShading: true }); MATS.set(col, m); }
  return m;
}
const PAL = {
  papel: '#FBF9F4', borde: '#E9E2D2', tierra: '#9C6B47', pasto: '#4CB979', pastoOsc: '#23804B', cafe: '#1F6B41',
  blanco: '#FFFFFF', azul: '#5454E9', azulOsc: '#3B3BC4', naranja: '#E9683B', amarillo: '#E4EB60', morado: '#865CF0', negro: '#1E1B3A', gris: '#B8B9C2',
};
function mesh(g: THREE.BufferGeometry, col: string, sombra = true) {
  const m = new THREE.Mesh(g, mat(col));
  m.castShadow = sombra; m.receiveShadow = true;
  return m;
}
function techo(w: number, h: number, d: number, col: string) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
  return mesh(g, col);
}
/** Casita: paredes blancas + techo de color. Origen en el piso. */
function casa(col: string, w = 1.2, h = 0.9, d = 1.0) {
  const g = new THREE.Group();
  const p = mesh(new THREE.BoxGeometry(w, h, d), PAL.blanco); p.position.y = h / 2; g.add(p);
  const t = techo(w * 1.18, h * 0.62, d * 1.1, col); t.position.y = h; g.add(t);
  const pu = mesh(new THREE.BoxGeometry(w * 0.22, h * 0.48, 0.04), col, false); pu.position.set(0, h * 0.24, d / 2 + 0.02); g.add(pu);
  return g;
}
function banco() {
  const g = new THREE.Group();
  const base = mesh(new THREE.BoxGeometry(1.9, 0.18, 1.3), PAL.blanco); base.position.y = 0.09; g.add(base);
  for (let i = 0; i < 4; i++) { const c = mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.0, 8), PAL.blanco); c.position.set(-0.66 + i * 0.44, 0.68, 0.45); g.add(c); }
  const cuerpo = mesh(new THREE.BoxGeometry(1.6, 1.0, 0.7), PAL.blanco); cuerpo.position.set(0, 0.68, -0.15); g.add(cuerpo);
  const viga = mesh(new THREE.BoxGeometry(1.9, 0.16, 1.3), PAL.azul); viga.position.y = 1.26; g.add(viga);
  const t = techo(2.0, 0.55, 1.3, PAL.azul); t.position.y = 1.34; g.add(t);
  return g;
}
function bodega() {
  const g = new THREE.Group();
  const b = mesh(new THREE.BoxGeometry(1.8, 0.95, 1.2), PAL.naranja); b.position.y = 0.475; g.add(b);
  const t = techo(1.95, 0.45, 1.3, PAL.amarillo); t.position.y = 0.95; g.add(t);
  const pu = mesh(new THREE.BoxGeometry(0.7, 0.6, 0.04), PAL.blanco, false); pu.position.set(0, 0.3, 0.62); g.add(pu);
  // camioncito
  const cam = new THREE.Group();
  const cj = mesh(new THREE.BoxGeometry(0.7, 0.45, 0.45), PAL.blanco); cj.position.set(0, 0.32, 0); cam.add(cj);
  const cb = mesh(new THREE.BoxGeometry(0.3, 0.32, 0.42), PAL.azul); cb.position.set(0.5, 0.26, 0); cam.add(cb);
  for (const [x, z] of [[-0.2, 0.22], [0.45, 0.22], [-0.2, -0.22], [0.45, -0.22]] as const) { const r = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), PAL.negro); r.rotation.x = Math.PI / 2; r.position.set(x, 0.1, z); cam.add(r); }
  cam.position.set(1.4, 0, 0.6); cam.rotation.y = -0.4; g.add(cam);
  return g;
}
function escudo() {
  const g = new THREE.Group();
  const poste = mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), PAL.gris); poste.position.y = 0.8; g.add(poste);
  const s = new THREE.Shape();
  s.moveTo(0, 0.55); s.lineTo(0.45, 0.38); s.lineTo(0.42, -0.05); s.quadraticCurveTo(0.35, -0.4, 0, -0.6); s.quadraticCurveTo(-0.35, -0.4, -0.42, -0.05); s.lineTo(-0.45, 0.38); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 });
  const e = mesh(geo, PAL.morado); e.position.y = 2.0; g.add(e);
  const ch = new THREE.Shape(); ch.moveTo(-0.2, 0); ch.lineTo(-0.06, -0.15); ch.lineTo(0.22, 0.15); ch.lineTo(0.17, 0.2); ch.lineTo(-0.06, -0.04); ch.lineTo(-0.15, 0.05); ch.closePath();
  const chk = mesh(new THREE.ExtrudeGeometry(ch, { depth: 0.04, bevelEnabled: false }), PAL.blanco, false); chk.position.set(0, 2.0, 0.19); g.add(chk);
  return g;
}
function antena() {
  const g = new THREE.Group();
  const m = mesh(new THREE.CylinderGeometry(0.05, 0.14, 2.6, 6), PAL.gris); m.position.y = 1.3; g.add(m);
  for (let i = 0; i < 3; i++) { const b = mesh(new THREE.BoxGeometry(0.5 - i * 0.1, 0.04, 0.04), PAL.gris); b.position.y = 0.8 + i * 0.6; g.add(b); }
  const luz = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.amarillo) }));
  luz.position.y = 2.7; luz.name = 'luz'; g.add(luz);
  return g;
}
function mata(alto = 0.5) {
  const g = new THREE.Group();
  const c = mesh(new THREE.IcosahedronGeometry(alto * 0.55, 0), PAL.cafe); c.position.y = alto * 0.6; c.scale.set(1, 1.25, 1); g.add(c);
  return g;
}
function sensor() {
  const g = new THREE.Group();
  const p = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), PAL.gris); p.position.y = 0.35; g.add(p);
  const caja = mesh(new THREE.BoxGeometry(0.18, 0.14, 0.12), PAL.naranja); caja.position.y = 0.72; g.add(caja);
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 6, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.azul), transparent: true }));
  anillo.rotation.x = Math.PI / 2; anillo.position.y = 0.72; anillo.name = 'anillo'; g.add(anillo);
  return g;
}
function carpeta() {
  const g = new THREE.Group();
  const b = mesh(new RoundedBoxGeometry(0.8, 0.56, 0.1, 2, 0.03), PAL.amarillo); g.add(b);
  const tab = mesh(new THREE.BoxGeometry(0.28, 0.1, 0.1), PAL.amarillo); tab.position.set(-0.22, 0.31, 0); g.add(tab);
  const hoja = mesh(new THREE.BoxGeometry(0.62, 0.4, 0.02), PAL.blanco, false); hoja.position.set(0, 0.02, 0.06); g.add(hoja);
  for (let i = 0; i < 3; i++) { const l = mesh(new THREE.BoxGeometry(0.44 - i * 0.08, 0.035, 0.01), PAL.azul, false); l.position.set(-0.05, 0.12 - i * 0.1, 0.075); g.add(l); }
  return g;
}
function moneda() {
  const g = new THREE.Group();
  const m = mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 20), PAL.amarillo); m.rotation.x = Math.PI / 2; g.add(m);
  const s = mesh(new THREE.TorusGeometry(0.2, 0.03, 6, 20), PAL.azulOsc, false); s.position.z = 0.05; g.add(s);
  return g;
}

/** Un nodo del ecosistema: edificio + islita propia (para cuando están separados). */
export interface Nodo { g: THREE.Group; isla: THREE.Mesh; sep: THREE.Vector3; junto: THREE.Vector3; alto: number }

export class Mundo {
  scene = new THREE.Scene();
  cam = new THREE.PerspectiveCamera(36, 1920 / 1080, 0.1, 200);
  rt!: THREE.WebGLRenderTarget;
  sol = new THREE.DirectionalLight(0xffffff, 2.2);
  amb = new THREE.HemisphereLight(0xffffff, 0xdcd6ff, 1.9);
  isla = new THREE.Group();
  coop!: THREE.Group; coopB!: THREE.Group;
  nodos: Record<'productor' | 'banco' | 'comprador' | 'supervisor', Nodo> = {} as any;
  fincas: THREE.Group[] = [];
  matas: THREE.Group[] = [];
  sensores: THREE.Group[] = [];
  antena!: THREE.Group;
  redes: { curva: THREE.QuadraticBezierCurve3; tubo: THREE.Mesh; mat: THREE.MeshBasicMaterial; paquete: THREE.Mesh }[] = [];
  carpeta!: THREE.Group;
  monedas: THREE.Group[] = [];
  flecha!: THREE.Group;
  anilloPacto!: THREE.Mesh;
  domo!: THREE.Mesh;
  barras: THREE.Mesh[] = [];
  telefono!: THREE.Group; pantalla!: HTMLCanvasElement; pantallaTex!: THREE.CanvasTexture;
  private listo = false;

  async init() {
    if (this.listo) return; this.listo = true;
    this.rt = makeRT(1920, 1080, { samples: 4 });
    const s = this.scene;
    this.sol.position.set(8, 14, 6); this.sol.castShadow = true;
    const sc = this.sol.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.near = 1; sc.far = 40;
    this.sol.shadow.mapSize.set(2048, 2048); this.sol.shadow.bias = -0.0008; this.sol.shadow.radius = 4;
    s.add(this.sol, this.amb);

    // --- isla principal (diorama de papel)
    const base = mesh(new THREE.CylinderGeometry(9, 8.6, 0.9, 9), PAL.borde); base.position.y = -0.45; this.isla.add(base);
    const tierra = mesh(new THREE.CylinderGeometry(8.6, 8.2, 0.5, 9), PAL.tierra); tierra.position.y = -1.1; this.isla.add(tierra);
    const pasto = mesh(new THREE.CylinderGeometry(8.8, 9, 0.12, 9), PAL.pasto); pasto.position.y = 0.0; this.isla.add(pasto);
    for (const [x, z, r, h] of [[-5.2, 3.6, 2.6, 0.9], [5.6, 3.8, 2.4, 0.7], [-1.5, -5.6, 2.8, 0.8], [4.8, -4.4, 2.0, 0.6]] as const) {
      const lo = mesh(new THREE.IcosahedronGeometry(1, 1), PAL.pastoOsc); lo.scale.set(r, h, r * 0.85); lo.position.set(x, -0.1, z); this.isla.add(lo);
    }
    s.add(this.isla);
    // matas de café en hileras
    for (let f = 0; f < 4; f++) for (let k = 0; k < 6; k++) {
      const m = mata(0.5); m.position.set(-6.4 + k * 0.62 + (f % 2) * 0.3, 0.05, 0.6 + f * 0.75); this.isla.add(m); this.matas.push(m);
    }
    // cooperativa (centro) y una segunda cooperativa (para el historial)
    this.coop = casa(PAL.pasto, 2.2, 1.4, 1.8); this.isla.add(this.coop);
    const letrero = mesh(new THREE.BoxGeometry(1.4, 0.36, 0.06), PAL.amarillo, false); letrero.position.set(0, 1.0, 0.95); this.coop.add(letrero);
    this.coopB = casa(PAL.pastoOsc, 1.7, 1.1, 1.4); this.coopB.position.set(5.6, 0, 1.4); this.isla.add(this.coopB);
    // fincas
    for (const [x, z, ry] of [[-3.6, 4.6, 0.3], [-6.2, -1.2, 0.9], [2.6, 5.4, -0.2], [-4.2, -4.2, 0.6]] as const) {
      const f = casa(PAL.naranja, 1.0, 0.75, 0.85); f.position.set(x, 0, z); f.rotation.y = ry; this.isla.add(f); this.fincas.push(f);
    }
    // sensores
    for (const [x, z] of [[-5.6, 1.1], [-3.4, 2.5], [-2.0, 4.0], [1.4, 4.4], [-5.0, -2.6], [-2.6, -3.2]] as const) {
      const se = sensor(); se.position.set(x, 0.05, z); this.isla.add(se); this.sensores.push(se);
    }
    this.antena = antena(); this.antena.position.set(3.4, 0, -2.2); this.isla.add(this.antena);

    // nodos que llegan a la cooperativa (posición separada = islas flotantes lejanas)
    const nodo = (g: THREE.Group, sep: [number, number, number], junto: [number, number, number], r = 1.9, alto = 2): Nodo => {
      const isla = mesh(new THREE.CylinderGeometry(r, r * 0.75, 0.6, 8), PAL.borde); isla.position.y = -0.3;
      const top = mesh(new THREE.CylinderGeometry(r * 1.02, r * 1.02, 0.1, 8), PAL.pasto); top.position.y = 0.02; isla.add(top);
      g.add(isla); s.add(g);
      return { g, isla, sep: new THREE.Vector3(...sep), junto: new THREE.Vector3(...junto), alto };
    };
    const prod = new THREE.Group(); const pc = casa(PAL.naranja, 1.0, 0.75, 0.85); prod.add(pc);
    for (let k = 0; k < 4; k++) { const m = mata(0.45); m.position.set(-0.9 + k * 0.6, 0, 1.0); prod.add(m); }
    this.nodos.productor = nodo(prod, [-7.5, 1.2, 1], [-1.6, 0, 2.6], 1.9, 1.6);
    this.nodos.banco = nodo(banco(), [0, 0.6, -6], [-3.6, 0, -1.6], 1.8, 2.2);
    this.nodos.comprador = nodo(bodega(), [7.5, 0.6, 0.5], [3.2, 0, 1.6], 2.1, 1.8);
    this.nodos.supervisor = nodo(escudo(), [0, 8, -4], [0.6, 0, -3.4], 1.0, 2.8);

    // red: curvas desde la cooperativa a cada nodo y fincas
    const destinos: [number, number][] = [[-3.6, -1.6], [3.2, 1.6], [0.6, -3.4], [-1.6, 2.6], [-3.6, 4.6], [2.6, 5.4], [-4.2, -4.2], [5.6, 1.4]];
    destinos.forEach(([x, z], i) => {
      const a = new THREE.Vector3(0, 1.9, 0), b = new THREE.Vector3(x, 1.2, z);
      const mid = a.clone().lerp(b, 0.5); mid.y += 1.6 + (i % 3) * 0.3;
      const curva = new THREE.QuadraticBezierCurve3(a, mid, b);
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.azul) });
      const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, 48, 0.045, 6, false), m);
      const paquete = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.amarillo) }));
      s.add(tubo, paquete); this.redes.push({ curva, tubo, mat: m, paquete });
    });
    this.carpeta = carpeta(); s.add(this.carpeta);
    for (let i = 0; i < 4; i++) { const m = moneda(); s.add(m); this.monedas.push(m); }
    // flecha que baja (márgenes)
    this.flecha = new THREE.Group();
    const fc = mesh(new THREE.BoxGeometry(0.4, 1.6, 0.4), PAL.naranja); fc.position.y = 0.8; this.flecha.add(fc);
    const fp = mesh(new THREE.ConeGeometry(0.55, 0.8, 4), PAL.naranja); fp.rotation.x = Math.PI; fp.position.y = -0.4; this.flecha.add(fp);
    s.add(this.flecha);
    this.anilloPacto = new THREE.Mesh(new THREE.TorusGeometry(3, 0.12, 8, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.amarillo) }));
    this.anilloPacto.rotation.x = Math.PI / 2; s.add(this.anilloPacto);
    this.domo = new THREE.Mesh(new THREE.SphereGeometry(9.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.morado), transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }));
    s.add(this.domo);
    for (let i = 0; i < 5; i++) { const b = mesh(new THREE.BoxGeometry(0.7, 1, 0.7), PAL.azul); s.add(b); this.barras.push(b); }
    // teléfono con pantalla dibujada en canvas
    this.pantalla = document.createElement('canvas'); this.pantalla.width = 540; this.pantalla.height = 1080;
    this.pantallaTex = new THREE.CanvasTexture(this.pantalla); this.pantallaTex.colorSpace = THREE.SRGBColorSpace;
    this.telefono = new THREE.Group();
    const cuerpo = mesh(new RoundedBoxGeometry(2.3, 4.5, 0.26, 4, 0.28), PAL.negro); this.telefono.add(cuerpo);
    const pan = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 4.1), new THREE.MeshBasicMaterial({ map: this.pantallaTex, toneMapped: false }));
    pan.position.z = 0.135; this.telefono.add(pan);
    s.add(this.telefono);
    this.reset(C.blanco);
  }

  /** Estado por defecto: isla y cooperativa visibles; todo lo demás apagado. */
  reset(bg: string) {
    this.scene.background = new THREE.Color(bg);
    this.scene.fog = new THREE.Fog(new THREE.Color(bg), 30, 70);
    this.isla.visible = true; this.isla.position.set(0, 0, 0); this.isla.scale.setScalar(1);
    this.coop.visible = true; this.coop.scale.setScalar(1); this.coop.position.set(0, 0, 0);
    this.coopB.visible = false;
    for (const n of Object.values(this.nodos)) { n.g.visible = false; n.g.position.copy(n.junto); n.g.scale.setScalar(1); n.g.rotation.set(0, 0, 0); n.isla.visible = false; }
    this.fincas.forEach((f) => (f.visible = true));
    this.matas.forEach((m) => (m.visible = true));
    this.sensores.forEach((s) => { s.visible = false; s.scale.setScalar(1); });
    this.antena.visible = true; (this.antena.getObjectByName('luz') as THREE.Mesh).visible = true;
    this.redes.forEach((r) => { r.tubo.visible = false; r.paquete.visible = false; r.mat.color.set(PAL.azul); r.tubo.geometry.setDrawRange(0, Infinity); });
    this.carpeta.visible = false; this.carpeta.rotation.set(0, 0, 0); this.carpeta.scale.setScalar(1);
    this.monedas.forEach((m) => (m.visible = false));
    this.flecha.visible = false;
    this.anilloPacto.visible = false; this.domo.visible = false;
    this.barras.forEach((b) => (b.visible = false));
    this.telefono.visible = false;
  }

  /** Muestra los nodos: k=0 separados en sus islas flotantes, k=1 juntos en la isla principal. */
  nodo(id: keyof Mundo['nodos'], k: number, t: number, aparece = 1) {
    const n = this.nodos[id];
    if (aparece <= 0) return;
    n.g.visible = true;
    const e = ease.inOutCubic(clamp(k));
    n.g.position.lerpVectors(n.sep, n.junto, e);
    n.g.position.y += (1 - e) * Math.sin(t * 1.2 + n.sep.x) * 0.25 + Math.sin(e * Math.PI) * 2.2;
    n.g.scale.setScalar(ease.outBack(clamp(aparece), 1.6));
    n.isla.visible = e < 0.98; n.isla.scale.setScalar(1 - e * 0.95);
  }
  /** Red: g = 0..1 cuánto creció cada línea (índices en lista), paquetes viajando si `flujo`. */
  red(ids: number[], g: number, t: number, flujo = false, color?: string) {
    ids.forEach((i, j) => {
      const r = this.redes[i]!; const k = clamp(g * 1.4 - j * 0.08);
      if (k <= 0) return;
      r.tubo.visible = true;
      const total = (r.tubo.geometry.index?.count ?? 0);
      r.tubo.geometry.setDrawRange(0, Math.floor(total * k / 6) * 6);
      if (color) r.mat.color.set(color);
      if (flujo && k >= 1) { r.paquete.visible = true; r.paquete.position.copy(r.curva.getPoint((t * 0.45 + j * 0.37) % 1)); }
    });
  }
  sensoresOn(k: number, t: number) {
    this.sensores.forEach((s, i) => {
      const a = clamp(k * 1.5 - i * 0.08); if (a <= 0) return;
      s.visible = true; s.scale.setScalar(ease.outBack(a, 1.8));
      const an = s.getObjectByName('anillo') as THREE.Mesh; const u = (t * 0.8 + i * 0.17) % 1;
      an.scale.setScalar(0.4 + u * 1.6); (an.material as THREE.MeshBasicMaterial).opacity = 1 - u;
    });
  }
  camara(pos: [number, number, number], mira: [number, number, number], fov = 36) {
    this.cam.position.set(...pos); this.cam.fov = fov; this.cam.updateProjectionMatrix(); this.cam.lookAt(...mira);
  }
  /** Proyecta un punto 3D a coordenadas de la capa 2D (1920×1080). */
  pantallaDe(x: number, y: number, z: number) {
    const v = new THREE.Vector3(x, y, z).project(this.cam);
    return { x: (v.x * 0.5 + 0.5) * 1920, y: (-v.y * 0.5 + 0.5) * 1080, visible: v.z < 1 };
  }
  render(renderer: THREE.WebGLRenderer, out: THREE.WebGLRenderTarget, comp: { draw: (r: THREE.WebGLRenderer, tex: THREE.Texture, t: THREE.WebGLRenderTarget, o?: any) => void }) {
    const prevShadow = renderer.shadowMap.enabled;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setRenderTarget(this.rt);
    renderer.setClearColor(this.scene.background as THREE.Color, 1);
    renderer.clear(true, true, true);
    renderer.render(this.scene, this.cam);
    renderer.shadowMap.enabled = prevShadow;
    comp.draw(renderer, this.rt.texture, out, { mode: 'replace' });
  }
}

let MUNDO: Mundo | null = null;
export const mundo = () => (MUNDO ??= new Mundo());

/** Cámara orbitando alrededor de un punto: ángulo (rad), distancia, altura. */
export function orbita(cx: number, cz: number, ang: number, dist: number, alto: number, miraY = 0.8): [[number, number, number], [number, number, number]] {
  return [[cx + Math.sin(ang) * dist, alto, cz + Math.cos(ang) * dist], [cx, miraY, cz]];
}

/** Escena 3D: el mundo en 3D abajo y una capa 2D (textos, puppets, footer) encima. */
export abstract class Plate3D extends Scene {
  L = new Layer2D();
  S!: Script;
  M = mundo();
  /** Fondo del mundo 3D en esta escena. */
  bg: string = C.blanco;
  prevBg?: string;
  revealDur = 0.55;
  footer = true;
  override async init() {
    await loadJakarta();
    this.S = new Script(this.ctx.lyrics);
    await this.M.init();
    await this.load();
    this.setup();
  }
  async load(): Promise<void> {}
  setup(): void {}
  /** Pon el estado del mundo y la cámara para el tiempo t. */
  abstract mundo3d(t: number, m: Mundo): void;
  /** Capa 2D encima del 3D (fondo transparente). */
  abstract draw(c: CanvasRenderingContext2D, t: number): void;
  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const t = f.t, m = this.M;
    m.reset(this.bg);
    this.mundo3d(t, m);
    m.render(this.ctx.renderer, out, this.ctx.comp);
    const c = this.L.ctx;
    this.L.clear();
    c.lineCap = 'round'; c.lineJoin = 'round';
    const r = this.prevBg ? ease.inOutCubic(clamp((t - this.ctx.start) / this.revealDur)) : 1;
    c.save();
    if (r < 1) { c.beginPath(); c.arc(960, 540, 2300 * r, 0, Math.PI * 2); c.clip(); }
    this.draw(c, t);
    c.restore();
    if (r < 1) {
      c.save(); c.beginPath(); c.rect(0, 0, 1920, 1080); c.arc(960, 540, 2300 * r, 0, Math.PI * 2, true);
      c.fillStyle = this.prevBg!; c.fill('evenodd'); c.restore();
    }
    if (this.footer) drawFooter(c, f.t, (this.ctx.lyrics.lines[0]?.start ?? 0.9) - 0.5);
    this.ctx.comp.draw(this.ctx.renderer, this.L.upload(), out, { mode: 'normal' });
    return { bloom: 0, halation: 0, ca: 0, grain: 0, vignette: 0, hud: 0, flat: 1 };
  }
}
export { lerp };
