class Sound {
  sound: HTMLAudioElement;
  isPlaying: boolean;

  constructor(src: string) {
    this.sound = new Audio(src);

    this.sound.onplay = () => {
      console.log("sound starts playing");
      this.isPlaying = true;
    };

    this.sound.onended = () => {
      setTimeout(() => {
        console.log("sound has ended");
        this.isPlaying = false;
      }, 1000);
    };

    this.isPlaying = false;
  }

  play(): void {
    if (!this.isPlaying) {
      try {
        this.sound.play();
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default Sound;
