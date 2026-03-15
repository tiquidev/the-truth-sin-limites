import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';

let isSetup = false;

export async function setupAudioPlayer(): Promise<void> {
  if (isSetup) return;

  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
    });

    isSetup = true;
  } catch (error) {
    // setupPlayer throws if called more than once
    if ((error as Error).message?.includes('already been initialized')) {
      isSetup = true;
    } else {
      console.error('Error setting up audio player:', error);
    }
  }
}
