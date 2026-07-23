// Lógica de autenticación: registro, login, logout, y creación del perfil en Firestore
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

/**
 * Crea el perfil en Firestore la primera vez que alguien entra (por correo o por Google).
 * Si el perfil ya existe, no lo sobreescribe.
 */
async function asegurarPerfil(user, nombreSugerido) {
  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    nombre: nombreSugerido || user.displayName || user.email,
    email: user.email,
    rol: "miembro",
    avatar: "neutral",
    libros_leidos: [],
    fecha_ingreso: serverTimestamp(),
  });

  const colaRef = doc(db, "config", "cola_curadores");
  const colaSnap = await getDoc(colaRef);
  const ordenActual = colaSnap.exists() ? colaSnap.data().orden || [] : [];
  await setDoc(colaRef, { orden: [...ordenActual, user.uid] }, { merge: true });
}

/**
 * Inicia sesión (o registra, si es la primera vez) con una cuenta de Google.
 */
export async function iniciarSesionConGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await asegurarPerfil(cred.user);
  return cred.user;
}

/**
 * Registra un nuevo lector: crea su cuenta en Auth y su perfil en Firestore (colección "usuarios").
 * Entra automáticamente al final de la cola de curadores.
 */
export async function registrarLector({ nombre, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, "usuarios", uid), {
    nombre,
    email,
    rol: "miembro",           // miembro | moderador | admin
    avatar: "neutral",
    libros_leidos: [],
    fecha_ingreso: serverTimestamp(),
  });

  // Se agrega al final de la cola de curadores
  const colaRef = doc(db, "config", "cola_curadores");
  const colaSnap = await getDoc(colaRef);
  const ordenActual = colaSnap.exists() ? colaSnap.data().orden || [] : [];
  await setDoc(colaRef, { orden: [...ordenActual, uid] }, { merge: true });

  return cred.user;
}

export async function iniciarSesion({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}

/**
 * Envía un correo para restablecer la contraseña.
 */
export async function recuperarContrasena(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Escucha cambios de sesión. callback recibe (user | null).
 */
export function observarSesion(callback) {
  onAuthStateChanged(auth, callback);
}

/**
 * Trae el perfil completo (Firestore) del usuario autenticado.
 */
export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data() : null;
}

/** Actualiza el propio nombre y/o avatar. Cualquier miembro puede hacerlo sobre su propio perfil. */
export async function actualizarMiPerfil(uid, datos) {
  await setDoc(doc(db, "usuarios", uid), datos, { merge: true });
}
