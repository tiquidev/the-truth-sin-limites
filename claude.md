# CLAUDE.md — Contexto del Proyecto "The Truth Sin Limites"

## Sobre este archivo

Este archivo contiene todo el contexto necesario para implementar el sistema de streaming de audio y video en la app React Native de **The Truth Sin Limites**. Léelo completo antes de ejecutar cualquier acción.

---

## 1. Descripción del Proyecto

**The Truth Sin Limites** es una plataforma de streaming católica (tipo Netflix) construida en React Native. La app ofrecerá videos, audiolibros, retiros espirituales, cursos, clubes de lectura y contenido espiritual en múltiples idiomas (español, inglés, coreano, italiano, etc.).

El app ya existe como cascarón en React Native, está en TestFlight (iOS) y tiene cuenta en App Store lista para submit.

---

## 2. Decisiones Técnicas Ya Tomadas

### Almacenamiento: Cloudflare R2

- **No usamos Mux ni Cloudflare Stream** — el presupuesto es <$100/mes y tenemos 100+ videos y 100+ audios.
- **Cloudflare R2** es nuestra solución: $0.015/GB/mes de storage, egress GRATIS.
- Los videos se pre-transcodifican con FFmpeg a 480p, 720p y 1080p antes de subir.
- Los audios se normalizan a AAC 128kbps (.m4a).
- Bucket: `thetruth-media` con acceso público via custom domain.

### Estructura de carpetas en R2

```
thetruth-media/
├── videos/
│   ├── 480p/{slug}.mp4
│   ├── 720p/{slug}.mp4
│   └── 1080p/{slug}.mp4
├── audios/
│   └── {slug}.m4a
├── thumbnails/
│   └── {slug}.jpg
└── subtitles/
    └── {slug}-{lang}.vtt
```

### URL base de los medios

```
https://media.thetruthsinlimites.app/{path}
```

> Nota: el dominio puede variar. Usamos una constante `R2_BASE_URL` en el código que se configura en un solo lugar.

### Librerías elegidas

- **Audio:** `react-native-track-player` — soporta background playback, lock screen controls, velocidad variable, queue de tracks.
- **Video:** `react-native-video@6` — soporta streaming progresivo, subtítulos .vtt, adaptive quality.

---

## 3. Plan de Implementación

### IMPORTANTE: Vamos a implementar en DOS fases:

1. **FASE ACTUAL → AUDIOS primero** (esta sesión)
2. **FASE SIGUIENTE → VIDEOS después** (próxima sesión)

La razón: los audios son más simples de integrar y nos permiten validar toda la pipeline (R2 → app → usuario) antes de agregar la complejidad del video.

---

## 4. FASE 1: Implementación de Audio

### 4.1 Instalar dependencias

```bash
npm install react-native-track-player
cd ios && pod install && cd ..
```

### 4.2 Configurar el servicio de audio

Crear `src/services/audioService.ts`:

- Función `setupAudioPlayer()` que inicializa TrackPlayer una sola vez al arrancar el app.
- Capabilities: Play, Pause, SkipToNext, SkipToPrevious, SeekTo.
- Habilitar reproducción en background (`AppKilledPlaybackBehavior.ContinuePlayback`).
- Habilitar `autoHandleInterruptions: true`.

### 4.3 Registrar el playback service

En `index.js` o el entry point del app:

```javascript
import TrackPlayer from "react-native-track-player";

// Al final del archivo
TrackPlayer.registerPlaybackService(() =>
  require("./src/services/playbackService"),
);
```

Crear `src/services/playbackService.ts`:

```typescript
import TrackPlayer, { Event } from "react-native-track-player";

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) =>
    TrackPlayer.seekTo(event.position),
  );
};
```

### 4.4 Crear el componente AudioPlayer

Crear `src/components/AudioPlayer.tsx` con estas funcionalidades:

**Props del componente:**

```typescript
interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  chapter?: string;
  thumbnailSlug: string;
  audioSlug: string;
}

interface AudioPlayerProps {
  tracks: AudioTrack[];
  initialTrackIndex?: number;
  initialPosition?: number;
  onProgressSave?: (trackId: string, position: number) => void;
}
```

**Funcionalidades requeridas:**

- Cargar lista de tracks desde R2 (`{R2_BASE_URL}/audios/{audioSlug}.m4a`)
- Play / Pause
- Skip -15s / +30s
- Track anterior / siguiente
- Velocidad variable: ciclo 0.75x → 1.0x → 1.25x → 1.5x → 1.75x → 2.0x
- Barra de progreso visual con tiempo actual / duración total
- Formateo de tiempo: `mm:ss` o `h:mm:ss` si dura más de 1 hora
- Guardar progreso automáticamente cada 30 segundos via `onProgressSave`
- Restaurar posición inicial con `initialPosition`
- Mostrar portada del track desde R2 (`{R2_BASE_URL}/thumbnails/{thumbnailSlug}.jpg`)
- Lista de capítulos si hay más de 1 track, con indicador de "Reproduciendo" en el activo
- Soporte para reproducción en background y controles en lock screen

**Hooks de react-native-track-player a usar:**

- `useProgress(1000)` — progreso cada segundo
- `usePlaybackState()` — estado play/pause/buffering
- `useTrackPlayerEvents([Event.PlaybackActiveTrackChanged])` — cambio de track

**Estilo visual:**

- Fondo oscuro (#0a0a0a)
- Acentos dorados (#C9A227) para botones de play, barra de progreso, track activo
- Portada con sombra dorada sutil
- Botón de play circular grande (64x64) con fondo dorado
- Texto blanco, subtextos en rgba(255,255,255,0.5)
- Border radius 16 en el container principal

### 4.5 Crear la constante de configuración

Crear `src/config/media.ts`:

```typescript
// Cambiar este valor cuando configuren el dominio público de R2
export const R2_BASE_URL = "https://media.thetruthsinlimites.app";

// Calidades de video disponibles (para Fase 2)
export const VIDEO_QUALITIES = ["480p", "720p", "1080p"] as const;
export type VideoQuality = (typeof VIDEO_QUALITIES)[number];
```

### 4.6 Inicializar el player al arrancar el app

En `App.tsx` o el componente raíz:

```typescript
import { useEffect } from "react";
import { setupAudioPlayer } from "./src/services/audioService";

// Dentro del componente:
useEffect(() => {
  setupAudioPlayer();
}, []);
```

### 4.7 Pantalla de prueba

Crear una pantalla temporal `src/screens/AudioTestScreen.tsx` para validar que todo funciona:

- Usar el componente AudioPlayer con 2-3 tracks de prueba hardcodeados.
- Los slugs de prueba pueden apuntar a URLs de audio público temporalmente hasta que configuremos R2.
- Verificar: play/pause, skip, velocidad, background playback, lock screen.

---

## 5. FASE 2: Implementación de Video (PRÓXIMA SESIÓN)

> **NO implementar esto todavía.** Solo está aquí como referencia de lo que viene después.

### Lo que se va a hacer:

- Instalar `react-native-video@6`
- Crear componente `VideoPlayer.tsx` con:
  - Streaming progresivo desde R2
  - Selector de calidad (480p / 720p / 1080p) con cambio sin perder posición
  - Subtítulos .vtt en múltiples idiomas
  - Controles: play/pause, seek -10s/+10s, barra de progreso, fullscreen
  - Guardar posición para "continuar viendo"
- Crear pantalla de prueba para video

### Dependencias futuras:

```bash
npm install react-native-video@6
```

---

## 6. Estructura de Archivos Esperada

```
src/
├── config/
│   └── media.ts                    ← Constantes R2_BASE_URL, etc.
├── services/
│   ├── audioService.ts             ← Setup de TrackPlayer
│   └── playbackService.ts          ← Event listeners para background
├── components/
│   ├── AudioPlayer.tsx             ← Componente completo de audio
│   └── VideoPlayer.tsx             ← (Fase 2, no crear aún)
├── screens/
│   └── AudioTestScreen.tsx         ← Pantalla de prueba temporal
└── ...resto del app existente
```

---

## 7. Notas Técnicas Importantes

### iOS específico

- Agregar `UIBackgroundModes: ["audio"]` en `Info.plist` para background playback.
- Después de `pod install`, verificar que TrackPlayer se linkeó correctamente.

### Android específico

- `react-native-track-player` ya configura el foreground service automáticamente.
- Verificar que el `AndroidManifest.xml` tiene el permiso de INTERNET.

### Manejo de errores

- Si un audio no carga (URL inválida, sin conexión), mostrar un estado de error amigable, no crash.
- Wrap del setup en try/catch porque `setupPlayer()` falla si se llama dos veces.

### Performance

- No cargar todos los 100+ tracks a la queue de una vez. Cargar solo los del audiolibro/playlist actual.
- Las imágenes de portada deben ser JPG optimizados, max 500x500px.

---

## 8. Checklist de Validación

Después de implementar, verificar:

- [ ] `npm install react-native-track-player` exitoso
- [ ] `cd ios && pod install` exitoso
- [ ] App compila sin errores en iOS
- [ ] El AudioPlayer se renderiza correctamente
- [ ] Play/Pause funciona
- [ ] Skip -15s y +30s funciona
- [ ] Cambio de velocidad funciona (0.75x a 2.0x)
- [ ] Barra de progreso se actualiza en tiempo real
- [ ] Track anterior/siguiente funciona
- [ ] Reproducción continúa en background (app minimizada)
- [ ] Controles aparecen en lock screen
- [ ] El callback `onProgressSave` se ejecuta cada 30s
- [ ] La lista de capítulos muestra el track activo

---

## 9. Pregúntale al usuario si...

- No encuentras el entry point del app (index.js, App.tsx) — pregunta dónde está.
- No estás seguro de la estructura de carpetas existente — pregunta antes de crear archivos.
- Necesitas saber si ya tienen alguna librería de navegación instalada (React Navigation, Expo Router, etc.).
- Necesitas acceso a URLs de audio de prueba — el usuario puede proporcionar links públicos temporales o puedes sugerir usar archivos de prueba libres de derechos.

---

## 10. Estilo de Código

- TypeScript estricto
- Functional components con hooks
- StyleSheet.create para estilos (no inline objects repetidos)
- Nombres en inglés para código, comentarios pueden ser en español
- Exports nombrados para servicios, default export para componentes de pantalla/UI
