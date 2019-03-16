import React from "react";
import {
  AsyncStorage,
  BackHandler,
  Button,
  Dimensions,
  Image,
  LayoutAnimation,
  ScrollView,
  Slider,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from "expo";
import { MaterialIcons } from "@expo/vector-icons";

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

// class PlaylistItem {
//   constructor(name, uri) {
//     this.name = name;
//     this.uri = uri;
//   }
// }

// const PLAYLIST = [new PlaylistItem("asdf", this.state.fileUri)];

const ICON_RECORD_BUTTON = new Icon(
  require("./assets/images/record_button.png"),
  70,
  119
);
const ICON_RECORDING = new Icon(
  require("./assets/images/record_icon.png"),
  20,
  14
);

const ICON_PLAY_BUTTON = new Icon(
  require("./assets/images/play_button.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("./assets/images/pause_button.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("./assets/images/stop_button.png"),
  22,
  22
);

const ICON_MUTED_BUTTON = new Icon(
  require("./assets/images/muted_button.png"),
  67,
  58
);
const ICON_UNMUTED_BUTTON = new Icon(
  require("./assets/images/unmuted_button.png"),
  67,
  58
);

const ICON_TRACK_1 = new Icon(require("./assets/images/track_1.png"), 166, 5);
const ICON_THUMB_1 = new Icon(require("./assets/images/thumb_1.png"), 18, 19);
const ICON_THUMB_2 = new Icon(require("./assets/images/thumb_2.png"), 15, 19);

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFFFFF";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "Loading...";
const BUFFERING_STRING = "Buffering...";
const LIVE_COLOR = "#FF0000";
const RATE_SCALE = 3.0;

export default class EditScreen extends React.Component {
  static navigationOptions = {
    title: "Edit"
  };
  constructor(props) {
    super(props);
    this.index = 0;
    this._isMounted = false;
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    const data = JSON.parse(this.props.navigation.state.params.data);

    this.state = {
      backgroundColor1: "#CCC",
      backgroundColor2: "#CCC",
      backgroundColor3: "#CCC",
      borderColor1: "#068587",
      borderColor2: "#068587",
      borderColor3: "#068587",
      complete: data,
      deleteOption: false,
      fontLoaded: false,
      songId: data.id,
      songLyrics: data.lyrics,
      songName: data.name,
      songInfo: data.info,
      fileInfo: data.audio,
      fileUri: data.audio,
      goBackOption: false,
      haveRecordingPermissions: false,
      isLoading: true,
      isLoadingz: false,
      isPlaybackAllowed: false,
      isPlaying: false,
      isRecording: false,
      muted: false,
      playbackInstanceName: LOADING_STRING,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      portrait: null,
      recordingDuration: null,
      shouldCorrectPitch: true,
      shouldPlay: false,
      soundDuration: null,
      soundPosition: null,
      testWidth: "99%",
      testWidthSong: "49%",
      volume: 1.0,
      rate: 1.0
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  static navigationOptions = {
    title: "Edit"
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const data = JSON.parse(nextProps.navigation.state.params.data);
    console.log(data.audio, "S:DFLKJ:SDLFKJ");
    if (data.id && data.id !== prevState.songId) {
      return {
        songId: data.id,
        songLyrics: data.lyrics,
        songName: data.name,
        songInfo: data.info,
        songFile: data.audio
      };
    }
    return {
      songId: prevState.songId,
      songLyrics: prevState.songLyrics,
      songName: prevState.songName,
      songInfo: prevState.songInfo,
      songFile: prevState.audio
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    setTimeout(() => {
      this.setState({ testWidth: "100%", testWidthSong: "50%" });
    }, 100);
    this._askForPermissions();
    Audio.setAudioModeAsync({
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });

    this._loadNewPlaybackInstance(false);
  }

  // ============player begin======================

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    const source = { uri: this.state.fileUri };
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      volume: this.state.volume
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;

    this._updateScreenForLoading(false);
  }

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true
      });
    } else {
      this.setState({
        playbackInstanceName: PLAYLIST[this.index].name,
        portrait: PLAYLIST[this.index].image,
        isLoading: false
      });
    }
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        volume: status.volume
      });
      if (status.didJustFinish) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _advanceIndex(forward) {
    this.index =
      (this.index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length;
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);

    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
    }
  };

  _onForwardPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(true);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onBackPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(false);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.playbackInstance != null) {
      this.playbackInstance.setVolumeAsync(value);
    }
  };

  _trySetRate = async rate => {
    if (this.playbackInstance != null) {
      try {
        await this.playbackInstance.setRateAsync(rate);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(value * RATE_SCALE);
  };

  _onSeekSliderValueChange = value => {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return "";
  }
  //=============player end==================

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted"
    });
  };

  //==============record begin=====================

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis
      });
      if (!this.state.isLoadingz) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoadingz: true
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoadingz: false
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoadingz: true
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(
      `FILE INFO: ${JSON.stringify(info)}`,
      "YESSSSSSSSSSSSSSSSSSSSSSS",
      info.uri
    );
    const arr = [];
    const xFileInfo = JSON.stringify(info);
    arr.push(xFileInfo);
    this.setState({ fileInfo: arr, fileUri: info.uri });
    console.log(arr);
    const movedFile =
      FileSystem.documentDirectory + "audiorecordings/" + this.state.newSongId;
    await FileSystem.moveAsync({
      from: info.uri,
      to:
        FileSystem.documentDirectory + "audiorecordings/" + this.state.newSongId
    });

    this.setState({
      newUri:
        FileSystem.documentDirectory + "audiorecordings/" + this.state.newSongId
    });

    // FileSystem.downloadAsync(
    //   info.uri,
    //   FileSystem.documentDirectory + "small.mp4"
    // )
    //   .then(({ uri }) => {
    //     console.log("Finished downloading to ", uri);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    this.donwloadFile();

    await Audio.setAudioModeAsync({
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });

    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoadingz: false
    });
  }

  donwloadFile = async () => {
    let downloadObject = FileSystem.writeAsStringAsync();
    const file = await downloadObject.downloadAsync();
  };

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  _onPitchCorrectionPressed = async value => {
    this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };

  _onSeekSliderValueChange = value => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return "";
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  //=================record end =========================

  // componentWillReceiveProps = () => {
  //   BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  //   console.log(this.uri, "SDFSDFSDF");
  // };

  confirmDelete = () => {
    this.setState({
      deleteOption: true
    });
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  };

  confirmGoBack = () => {
    this.setState({
      goBackOption: true
    });
    FileSystem.getInfoAsync(FileSystem.documentDirectory).then(info =>
      console.log(
        "SDFSDFSDFSDFDSasdfasdfasdfasdfasdfasdfasdf",
        info,
        this.state
      )
    );

    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  };

  deleteSong = () => {
    this.setState({
      deleteOption: false
    });
    const data = JSON.parse(this.props.navigation.state.params.data);
    AsyncStorage.removeItem(data.name + data.id + "_object", () => {
      const { navigate } = this.props.navigation;
      alert("Deleted!");
      navigate("Home", { home: true });
    });
  };

  deleteBeforePost = () => {
    if (!this.state.songName) {
      alert("Song Name Cannot Be Blank!");
    }
    if (this.state.songName.length > 0) {
      const data = JSON.parse(this.props.navigation.state.params.data);
      AsyncStorage.removeItem(
        data.name + data.id + "_object",
        this.setState({ goodToGo: true }, this.guid())
      );
    }
  };
  goBack = () => {
    const { navigate } = this.props.navigation;
    navigate("Home", { home: true });
  };
  guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    const id =
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4();
    id.toString();
    this.setState({ newSongId: id }, this.submit);
  };

  guidSound = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    const id =
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4();
    id.toString();
    const idArr = [];
    idArr.push(id);
    this.setState({ soundId: idArr });
  };

  handleBackPress = () => {
    ToastAndroid.show(
      "Back button is disabled on this screen",
      ToastAndroid.SHORT
    );
    return true;
  };

  submit = () => {
    let idO = this.state.songName + this.state.newSongId + "_object";

    let idObj = {
      name: this.state.songName,
      id: this.state.newSongId,
      lyrics: this.state.songLyrics,
      info: this.state.songInfo,
      audio: movedFile
    };

    FileSystem.moveAsync({
      from: this.state.fileUri,
      to:
        FileSystem.documentDirectory + "audiorecordings/" + this.state.newSongId
    });

    console.log("new file blah blah", movedFile);

    AsyncStorage.setItem(idO, JSON.stringify(idObj), () => {
      AsyncStorage.getItem(idO, (err, result) => {
        const { navigate } = this.props.navigation;
        alert("Updated!");
        navigate("Home", { home: true });
      });
    });
  };

  onBlur1 = () => {
    this.setState({
      backgroundColor1: "#CCC",
      borderColor1: "#068587"
    });
  };

  onBlur2 = () => {
    this.setState({
      backgroundColor2: "#CCC",
      borderColor2: "#068587"
    });
  };

  onBlur3 = () => {
    this.setState({
      backgroundColor3: "#CCC",
      borderColor3: "#068587"
    });
  };

  onFocus1 = () => {
    this.setState({
      backgroundColor1: "#FFFFFF",
      borderColor1: "#CCC"
    });
  };

  onFocus2 = () => {
    this.setState({
      backgroundColor2: "#FFFFFF",
      borderColor2: "#CCC"
    });
  };

  onFocus3 = () => {
    this.setState({
      backgroundColor3: "#FFFFFF",
      borderColor3: "#CCC"
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            color: "#c0c0c0",
            width: 100,
            marginTop: 20,
            alignSelf: "flex-end"
          }}
        >
          <TouchableOpacity
            onPress={this.confirmGoBack}
            style={styles.submitButton}
          >
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
        {!this.state.deleteOption & !this.state.goBackOption ? (
          <View>
            {this.state.songName ? (
              <Text style={styles.text}>Song:</Text>
            ) : (
              <Text style={styles.textValidation}>
                Song: Please enter a song name!
              </Text>
            )}
            <TextInput
              name="songName"
              onBlur={() => this.onBlur1()}
              onFocus={() => this.onFocus1()}
              style={{
                borderColor: this.state.borderColor1,
                borderWidth: 2,
                backgroundColor: this.state.backgroundColor1,
                width: this.state.testWidthSong
              }}
              value={this.state.songName}
              onChangeText={e => {
                this.setState({ songName: e });
              }}
            />
            <Text style={styles.text}>Lyrics:</Text>
            <TextInput
              name="songLyrics"
              onBlur={() => this.onBlur2()}
              onFocus={() => this.onFocus2()}
              multiline={true}
              defaultValue={this.state.songLyrics}
              style={{
                width: this.state.testWidth,
                borderColor: this.state.borderColor2,
                borderWidth: 2,
                backgroundColor: this.state.backgroundColor2
              }}
              onChangeText={e => {
                this.setState({ songLyrics: e });
              }}
            />

            <Text style={styles.text}>Additional info</Text>
            <TextInput
              name="additionalInfo"
              onBlur={() => this.onBlur3()}
              onFocus={() => this.onFocus3()}
              multiline={true}
              style={{
                width: this.state.testWidth,
                borderColor: this.state.borderColor3,
                borderWidth: 2,
                backgroundColor: this.state.backgroundColor3
              }}
              defaultValue={this.state.songInfo}
              onChangeText={e => {
                this.setState({ songInfo: e });
              }}
            />
            <View
              style={{
                color: "#c0c0c0",
                width: 150,
                marginTop: 20,
                alignSelf: "flex-end"
              }}
            >
              <TouchableOpacity
                onPress={this.deleteBeforePost}
                style={styles.submitButton}
              >
                <Text style={styles.textButton}>Update</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                color: "#c0c0c0",
                width: 150,
                marginTop: 20,
                alignSelf: "flex-end"
                // marginBottom: 300
              }}
            >
              <TouchableOpacity
                onPress={this.confirmDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
            </View>
            <Text>
              play
              begin=========================================================
            </Text>
            {this.state.fileInfo.length > 0 && (
              <View style={styles.container}>
                <View style={styles.portraitContainer}>
                  <Image
                    style={styles.portrait}
                    source={{
                      uri: this.state.portrait
                    }}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Text>{this.state.playbackInstanceName}</Text>
                  {/* <Text>
                    {this.state.isBuffering
                      ? BUFFERING_STRING
                      : this._getTimestamp()}
                  </Text> */}
                </View>
                <View
                  style={[
                    styles.buttonsContainerBase,
                    styles.buttonsContainerTopRow,
                    {
                      opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                    }
                  ]}
                >
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={this._onBackPressed}
                    // disabled={this.state.isLoading}
                  >
                    <View>
                      <MaterialIcons
                        name="fast-rewind"
                        size={40}
                        color="#56D5FA"
                      />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={this._onPlayPausePressed}
                    // disabled={this.state.isLoading}
                  >
                    <View>
                      {this.state.isPlaying ? (
                        <MaterialIcons name="pause" size={40} color="#56D5FA" />
                      ) : (
                        <MaterialIcons
                          name="play-arrow"
                          size={40}
                          color="#56D5FA"
                        />
                      )}
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={this._onStopPressed}
                    // disabled={this.state.isLoading}
                  >
                    <View>
                      <MaterialIcons name="stop" size={40} color="#56D5FA" />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={this._onForwardPressed}
                    // disabled={this.state.isLoading}
                  >
                    <View>
                      <MaterialIcons
                        name="fast-forward"
                        size={40}
                        color="#56D5FA"
                      />
                    </View>
                  </TouchableHighlight>
                </View>
                <View
                  style={[
                    styles.playbackContainer,
                    {
                      opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                    }
                  ]}
                >
                  <Slider
                    style={styles.playbackSlider}
                    value={this._getSeekSliderPosition()}
                    onValueChange={this._onSeekSliderValueChange}
                    onSlidingComplete={this._onSeekSliderSlidingComplete}
                    thumbTintColor="#000000"
                    minimumTrackTintColor="#4CCFF9"
                    // disabled={this.state.isLoading}
                  />
                </View>
                <View
                  style={[
                    styles.buttonsContainerBase,
                    styles.buttonsContainerMiddleRow
                  ]}
                >
                  <View style={styles.volumeContainer}>
                    <View>
                      <MaterialIcons
                        name="volume-down"
                        size={40}
                        color="#56D5FA"
                      />
                    </View>
                    <Slider
                      style={styles.volumeSlider}
                      value={1}
                      onValueChange={this._onVolumeSliderValueChange}
                      thumbTintColor="#000000"
                      minimumTrackTintColor="#4CCFF9"
                    />
                    <View>
                      <MaterialIcons
                        name="volume-up"
                        size={40}
                        color="#56D5FA"
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.buttonsContainerBase,
                    styles.buttonsContainerBottomRow
                  ]}
                >
                  <View>
                    <MaterialIcons
                      name="call-received"
                      size={40}
                      color="#56D5FA"
                    />
                  </View>
                  <Slider
                    style={styles.rateSlider}
                    value={this.state.rate / RATE_SCALE}
                    onSlidingComplete={this._onRateSliderSlidingComplete}
                    thumbTintColor="#000000"
                    minimumTrackTintColor="#4CCFF9"
                  />
                  <View>
                    <MaterialIcons name="call-made" size={40} color="#56D5FA" />
                  </View>
                </View>
              </View>
            )}
            <Text>
              play
              end===========================================================
            </Text>
            <Text>
              record begin=================================================
            </Text>
            <View style={styles.container}>
              <View
                style={[
                  styles.halfScreenContainer,
                  {
                    opacity: this.state.isLoadingz ? DISABLED_OPACITY : 1.0
                  }
                ]}
              >
                <View />
                <View style={styles.recordingContainer}>
                  <View />
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={this._onRecordPressed}
                    disabled={this.state.isLoadingz}
                  >
                    <Image
                      style={styles.image}
                      source={ICON_RECORD_BUTTON.module}
                    />
                  </TouchableHighlight>
                  <View style={styles.recordingDataContainer}>
                    <View />
                    <Text style={[styles.liveText]}>
                      {this.state.isRecording ? "LIVE" : ""}
                    </Text>
                    <View style={styles.recordingDataRowContainer}>
                      <Image
                        style={[
                          styles.image,
                          { opacity: this.state.isRecording ? 1.0 : 0.0 }
                        ]}
                        source={ICON_RECORDING.module}
                      />
                      <Text style={[styles.recordingTimestamp]}>
                        {this._getRecordingTimestamp()}
                      </Text>
                    </View>
                    <View />
                  </View>
                  <View />
                </View>
                <View />
              </View>
              <View
                style={[
                  styles.halfScreenContainer,
                  {
                    opacity:
                      !this.state.isPlaybackAllowed || this.state.isLoadingz
                        ? DISABLED_OPACITY
                        : 1.0
                  }
                ]}
              >
                <View />
              </View>
              <View />
            </View>
            <Text>
              record end====================================================
            </Text>
          </View>
        ) : this.state.deleteOption ? (
          <View style={styles.confirmContainer}>
            <Text style={styles.textValidation}>Are you sure?</Text>
            <Text style={styles.textValidation}>
              Press DELETE to delete song
            </Text>
            <View
              style={{
                color: "#c0c0c0",
                width: 150,
                marginTop: 20,
                marginBottom: 30,
                alignSelf: "flex-end"
              }}
            >
              <TouchableOpacity
                onPress={this.deleteSong}
                style={styles.deleteButton}
              >
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
            </View>
            <Button
              title="Cancel"
              onPress={() => {
                this.setState({ deleteOption: false });
              }}
            />
          </View>
        ) : (
          this.state.goBackOption && (
            <View style={styles.confirmContainer}>
              <Text style={styles.textValidation}>
                All unsaved progress will be lost if you go back
              </Text>
              <Text style={styles.textValidation}>
                Press GO BACK to go back to home
              </Text>
              <View
                style={{
                  color: "#c0c0c0",
                  width: 150,
                  marginTop: 20,
                  marginBottom: 30,
                  alignSelf: "flex-end"
                }}
              >
                <TouchableOpacity
                  onPress={this.goBack}
                  style={styles.deleteButton}
                >
                  <Text style={styles.textButton}>GO BACK</Text>
                </TouchableOpacity>
              </View>
              <Button
                title="Cancel"
                onPress={() => {
                  this.setState({ goBackOption: false });
                }}
              />
            </View>
          )
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    fontSize: 15,
    color: "#c0c0c0",
    textAlign: "center"
  },
  confirmContainer: {
    marginTop: 30
  },
  container: {
    flex: 1,
    paddingTop: 35
    // backgroundColor: "#000000"
  },
  deleteButton: {
    backgroundColor: "#ED553B",
    padding: 10,
    fontSize: 17
  },
  submitButton: {
    backgroundColor: "#068587",
    padding: 10,
    fontSize: 17
  },
  text: {
    fontSize: 20,
    color: "#F0F0F0"
  },
  textButton: {
    fontSize: 20,
    color: "#c0c0c0",
    textAlign: "center"
  },
  textInputSong: {
    borderColor: "#068587",
    borderWidth: 2,
    backgroundColor: "#C0C0C0",
    width: 150,
    margin: 10
  },
  textValidation: {
    color: "#ED553B",
    fontSize: 20
  },
  noPermissionsText: {
    textAlign: "center"
  },
  wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: DEVICE_HEIGHT / 2.0,
    maxHeight: DEVICE_HEIGHT / 2.0
  },
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_RECORD_BUTTON.height,
    maxHeight: ICON_RECORD_BUTTON.height
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: ICON_RECORD_BUTTON.height,
    maxHeight: ICON_RECORD_BUTTON.height,
    minWidth: ICON_RECORD_BUTTON.width * 3.0,
    maxWidth: ICON_RECORD_BUTTON.width * 3.0
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: ICON_RECORDING.height,
    maxHeight: ICON_RECORDING.height
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0
  },
  playbackSlider: {
    alignSelf: "stretch"
  },
  liveText: {
    color: LIVE_COLOR
  },
  recordingTimestamp: {
    paddingLeft: 20
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20
  },
  image: {
    backgroundColor: BACKGROUND_COLOR
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20
  },
  playStopContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: ((ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0) / 2.0,
    maxWidth: ((ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0) / 2.0
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width
  },
  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0
  },
  portraitContainer: {
    marginTop: 80
  },
  portrait: {
    height: 200,
    width: 200
  },
  detailsContainer: {
    height: 40,
    marginTop: 40,
    alignItems: "center"
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch"
  },
  buttonsContainerMiddleRow: {
    maxHeight: 40,
    alignSelf: "stretch",
    paddingRight: 20
  }
});
// Expo.registerRootComponent(App);
