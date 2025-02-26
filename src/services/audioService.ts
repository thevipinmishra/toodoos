/**
 * Audio service for playing notification sounds
 */
export class AudioService {
  private static instance: AudioService;
  private audio: HTMLAudioElement | null = null;
  private initialized: boolean = false;

  private constructor() {
    // Audio will be created on first user interaction
    this.initializeAudio();
  }

  private initializeAudio(): void {
    if (typeof window !== 'undefined' && !this.initialized) {
      this.audio = new Audio('/notification-sound.mp3');
      
      // Preload the audio file
      if (this.audio) {
        this.audio.preload = 'auto';
        this.audio.load();
      }
      
      this.initialized = true;
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public async playNotification(): Promise<void> {
    try {
      // Re-initialize if needed (for mobile devices that might require user interaction)
      if (!this.initialized) {
        this.initializeAudio();
      }
      
      if (this.audio) {
        // Reset playback position
        this.audio.currentTime = 0;
        
        // Create and play a new audio instance if the current one is already playing
        // This ensures multiple notifications can play sounds even if they occur very close together
        if (this.audio.paused) {
          await this.audio.play();
        } else {
          const tempAudio = new Audio('/notification-sound.mp3');
          await tempAudio.play();
        }
      }
    } catch (error) {
      console.error('Failed to play notification sound:', error);
      // Re-initialize on error
      this.initialized = false;
    }
  }
}

export const audioService = AudioService.getInstance();
