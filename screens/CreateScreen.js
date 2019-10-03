import React from "react";
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Create"
  };
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      // isShowingText: true,
      songId: "",
      songLyrics: "",
      songName: "",
      additionalInfo: "",
      resetForm: false,
      testWidth: "99%",
      testWidthSong: "49%"
    };
  }
  static navigationOptions = {
    title: "Create"
  };

  componentDidMount() {
    /* Evidently, resizing triggers something that makes copy-paste work.
     * Timeout is mandatory for this hack, doesn't work otherwise.
     */
    setTimeout(() => {
      this.setState({ testWidth: "100%", testWidthSong: "50%" });
    }, 100);
  }

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
    this.setState({ songId: id }, this.submit);
  };

  submit = () => {
    if (!this.state.songId) {
      this.guid();
    } else if (this.state.songName) {
      const songId = this.state.songId;
      const songName = this.state.songName;
      const lyrics = this.state.songLyrics;
      const additionalInfo = this.state.additionalInfo;

      let idO = songName + songId + "_object";
      let idObj = {
        name: songName,
        id: songId,
        lyrics: lyrics,
        info: additionalInfo,
        audio: ""
      };

      AsyncStorage.setItem(idO, JSON.stringify(idObj), () => {
        AsyncStorage.getItem(idO, (err, result) => {
          const { navigate } = this.props.navigation;
          alert("Created!");
          this.toBeReset();
          navigate("Home", {
            home: true
          });
        });
      });
    } else {
      alert("Song Name Cannot Be Blank!");
    }
  };

  resetForm = () => {
    this.setState({
      songId: "",
      songLyrics: "",
      songName: "",
      additionalInfo: "",
      resetForm: false
    });
  };

  toBeReset = () => {
    this.setState({
      resetForm: true
    });
    this.resetForm();
  };

  render() {
    if (!this.state.resetForm) {
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.text}>{this.state.tit}</Text>

          {this.state.songName ? (
            <Text style={styles.text}>Song:</Text>
          ) : (
            <Text style={styles.textValidation}>
              Song: Please enter a song name!
            </Text>
          )}
          <TextInput
            name="songName"
            style={{
              borderColor: "#068587",
              borderWidth: 2,
              backgroundColor: "#C0C0C0",
              width: this.state.testWidthSong
            }}
            onChangeText={e => {
              this.setState({ songName: e });
            }}
          />

          <Text style={styles.text}>Lyrics:</Text>
          <TextInput
            name="songLyrics"
            multiline={true}
            style={{
              width: this.state.testWidth,
              borderColor: "#068587",
              borderWidth: 2,
              backgroundColor: "#C0C0C0"
            }}
            onChangeText={e => {
              this.setState({ songLyrics: e });
            }}
          />
          <Text style={styles.text}>Additional info</Text>
          <TextInput
            name="additionalInfo:"
            multiline={true}
            style={{
              width: this.state.testWidth,
              borderColor: "#068587",
              borderWidth: 2,
              backgroundColor: "#C0C0C0"
            }}
            onChangeText={e => {
              this.setState({ additionalInfo: e });
            }}
          />
          <View
            style={{
              color: "#c0c0c0",
              width: 150,
              marginTop: 20,
              alignSelf: "flex-end",
              marginBottom: 300
            }}
          >
            <TouchableOpacity onPress={this.submit} style={styles.submitButton}>
              <Text style={styles.textButton}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    } else {
      return <Text>""</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#000000"
  },
  submit: {
    backgroundColor: "#000000",
    margin: 20,
    width: 5
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
  }
});
