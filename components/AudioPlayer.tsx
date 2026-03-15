import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import { R2_BASE_URL } from '@/config/media';

// --- Types ---

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  chapter?: string;
  thumbnailSlug: string;
  audioSlug: string;
}

export interface AudioPlayerProps {
  tracks: AudioTrack[];
  initialTrackIndex?: number;
  initialPosition?: number;
  onProgressSave?: (trackId: string, position: number) => void;
}

// --- Constants ---

const GOLD = '#C9A227';
const BG = '#0a0a0a';
const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

// --- Helpers ---

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// --- Component ---

export default function AudioPlayer({
  tracks,
  initialTrackIndex = 0,
  initialPosition = 0,
  onProgressSave,
}: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [speedIndex, setSpeedIndex] = useState(1); // 1.0x default
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSaveRef = useRef(0);
  const hasRestoredPosition = useRef(false);

  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(1000);

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering || playbackState.state === State.Loading;

  const currentTrack = tracks[currentTrackIndex];

  // Load tracks into the queue
  useEffect(() => {
    let cancelled = false;

    async function loadTracks() {
      try {
        setError(null);
        await TrackPlayer.reset();

        const queue = tracks.map((t) => ({
          id: t.id,
          url: `${R2_BASE_URL}/audios/${t.audioSlug}.m4a`,
          title: t.title,
          artist: t.artist,
          artwork: `${R2_BASE_URL}/thumbnails/${t.thumbnailSlug}.jpg`,
        }));

        await TrackPlayer.add(queue);

        if (initialTrackIndex > 0) {
          await TrackPlayer.skip(initialTrackIndex);
        }

        if (!cancelled) setIsReady(true);
      } catch (e) {
        if (!cancelled) setError('No se pudo cargar el audio. Verifica tu conexión.');
        console.error('Error loading tracks:', e);
      }
    }

    loadTracks();
    return () => { cancelled = true; };
  }, [tracks, initialTrackIndex]);

  // Restore initial position once
  useEffect(() => {
    if (isReady && initialPosition > 0 && !hasRestoredPosition.current) {
      hasRestoredPosition.current = true;
      TrackPlayer.seekTo(initialPosition);
    }
  }, [isReady, initialPosition]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!onProgressSave || !isPlaying || !currentTrack) return;
    const now = Date.now();
    if (now - lastSaveRef.current >= 30000) {
      lastSaveRef.current = now;
      onProgressSave(currentTrack.id, position);
    }
  }, [position, isPlaying, currentTrack, onProgressSave]);

  // Track change listener
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.index != null) {
      setCurrentTrackIndex(event.index);
    }
  });

  // Controls
  const handlePlayPause = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }, [isPlaying]);

  const handleSkipBack = useCallback(async () => {
    const newPos = Math.max(0, position - 15);
    await TrackPlayer.seekTo(newPos);
  }, [position]);

  const handleSkipForward = useCallback(async () => {
    const newPos = Math.min(duration, position + 30);
    await TrackPlayer.seekTo(newPos);
  }, [position, duration]);

  const handlePrevTrack = useCallback(async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch {
      // Already at first track
    }
  }, []);

  const handleNextTrack = useCallback(async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch {
      // Already at last track
    }
  }, []);

  const handleCycleSpeed = useCallback(async () => {
    const nextIndex = (speedIndex + 1) % SPEED_OPTIONS.length;
    setSpeedIndex(nextIndex);
    await TrackPlayer.setRate(SPEED_OPTIONS[nextIndex]);
  }, [speedIndex]);

  const handleSeek = useCallback(
    async (ratio: number) => {
      const newPos = ratio * duration;
      await TrackPlayer.seekTo(newPos);
    },
    [duration],
  );

  const handleSelectTrack = useCallback(async (index: number) => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  }, []);

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Loading state
  if (!isReady) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={GOLD} />
        <Text style={styles.loadingText}>Cargando audio...</Text>
      </View>
    );
  }

  const progressRatio = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.container}>
      {/* Artwork */}
      <View style={styles.artworkWrapper}>
        <Image
          source={{ uri: `${R2_BASE_URL}/thumbnails/${currentTrack.thumbnailSlug}.jpg` }}
          style={styles.artwork}
          contentFit="cover"
        />
      </View>

      {/* Track info */}
      <Text style={styles.trackTitle} numberOfLines={2}>
        {currentTrack.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {currentTrack.artist}
      </Text>
      {currentTrack.chapter && (
        <Text style={styles.trackChapter} numberOfLines={1}>
          {currentTrack.chapter}
        </Text>
      )}

      {/* Progress bar */}
      <Pressable
        style={styles.progressContainer}
        onPress={(e) => {
          const { locationX } = e.nativeEvent;
          const width = 300; // approximate, will be measured
          handleSeek(Math.max(0, Math.min(1, locationX / width)));
        }}
        onLayout={() => {}}
      >
        <ProgressBar ratio={progressRatio} />
      </Pressable>

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <Pressable onPress={handleCycleSpeed} style={styles.speedButton}>
          <Text style={styles.speedText}>{SPEED_OPTIONS[speedIndex]}x</Text>
        </Pressable>

        <Pressable onPress={handlePrevTrack} style={styles.controlButton}>
          <Text style={styles.controlIcon}>⏮</Text>
        </Pressable>

        <Pressable onPress={handleSkipBack} style={styles.controlButton}>
          <Text style={styles.skipText}>-15</Text>
        </Pressable>

        <Pressable onPress={handlePlayPause} style={styles.playButton}>
          {isBuffering ? (
            <ActivityIndicator size="small" color={BG} />
          ) : (
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          )}
        </Pressable>

        <Pressable onPress={handleSkipForward} style={styles.controlButton}>
          <Text style={styles.skipText}>+30</Text>
        </Pressable>

        <Pressable onPress={handleNextTrack} style={styles.controlButton}>
          <Text style={styles.controlIcon}>⏭</Text>
        </Pressable>

        {/* Spacer to balance speed button */}
        <View style={styles.speedButton} />
      </View>

      {/* Chapter list (if multiple tracks) */}
      {tracks.length > 1 && (
        <View style={styles.chapterSection}>
          <Text style={styles.chapterHeader}>
            Capítulos · {tracks.length} pistas
          </Text>
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const isActive = index === currentTrackIndex;
              return (
                <Pressable
                  style={[styles.chapterRow, isActive && styles.chapterRowActive]}
                  onPress={() => handleSelectTrack(index)}
                >
                  <Text
                    style={[styles.chapterNumber, isActive && styles.chapterTextActive]}
                  >
                    {index + 1}
                  </Text>
                  <View style={styles.chapterInfo}>
                    <Text
                      style={[styles.chapterTitle, isActive && styles.chapterTextActive]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {item.chapter && (
                      <Text style={styles.chapterSubtitle}>{item.chapter}</Text>
                    )}
                  </View>
                  {isActive && (
                    <Text style={styles.chapterPlaying}>Reproduciendo</Text>
                  )}
                </Pressable>
              );
            }}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

// --- Progress Bar Sub-component ---

function ProgressBar({ ratio }: { ratio: number }) {
  const [barWidth, setBarWidth] = useState(0);

  return (
    <View
      style={styles.progressTrack}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      <View style={[styles.progressFill, { width: barWidth * ratio }]} />
      <View
        style={[
          styles.progressThumb,
          { left: barWidth * ratio - 6 },
        ]}
      />
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    minHeight: 300,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 12,
  },

  // Artwork
  artworkWrapper: {
    width: 240,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },

  // Track info
  trackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: 2,
  },
  trackChapter: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 4,
  },

  // Progress
  progressContainer: {
    width: '100%',
    paddingVertical: 12,
    marginTop: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    width: '100%',
  },
  progressFill: {
    height: 4,
    backgroundColor: GOLD,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GOLD,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },

  // Controls
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  controlButton: {
    padding: 8,
  },
  controlIcon: {
    fontSize: 24,
    color: '#fff',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 28,
    color: BG,
  },
  speedButton: {
    minWidth: 44,
    padding: 6,
    alignItems: 'center',
  },
  speedText: {
    fontSize: 13,
    fontWeight: '700',
    color: GOLD,
  },

  // Chapter list
  chapterSection: {
    width: '100%',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  chapterHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  chapterRowActive: {
    backgroundColor: 'rgba(201,162,39,0.1)',
  },
  chapterNumber: {
    width: 28,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  chapterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  chapterSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  chapterTextActive: {
    color: GOLD,
  },
  chapterPlaying: {
    fontSize: 11,
    fontWeight: '600',
    color: GOLD,
    marginLeft: 8,
  },
});
