import React from "react";
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Button,
  Text
} from "react-native";
import { ExpoLinksView } from "@expo/samples";
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
      resetForm: false
    };

    // setInterval(
    //   () =>
    //     this.setState(previousState => ({
    //       isShowingText: !previousState.isShowingText
    //     })),
    //   100
    // );
  }
  static navigationOptions = {
    title: "Create"
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
    this.setState({ songId: id }, this.submit);
  };

  submit = () => {
    if (!this.state.songId) {
      this.guid();
    } else {
      const songId = this.state.songId;
      const songName = this.state.songName;
      const lyrics = this.state.songLyrics;
      const additionalInfo = this.state.additionalInfo;

      let idO = songId + "_object";
      let idObj = {
        id: songId,
        name: songName,
        lyrics: lyrics,
        info: additionalInfo
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
          <Text>{this.state.fromHome}</Text>
          <Text>Song:</Text>
          <TextInput
            name="songName"
            defaultValue={this.state.tit}
            onChangeText={tit => {
              this.setState({ songName: tit });
            }}
          />
          <Text>lyrics:</Text>
          <TextInput
            name="songLyrics"
            defaultValue=""
            onChangeText={lyr => {
              this.setState({ songLyrics: lyr });
            }}
          />
          <Text>Additional info</Text>
          <TextInput
            name="additionalInfo"
            defaultValue={this.state.add}
            onChangeText={add => {
              this.setState({ additionalInfo: add });
            }}
          />
          <Button title="Submit" onPress={this.submit} />
          <Text>{this.state.songName}</Text>
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
    backgroundColor: "#fff"
  }
});
