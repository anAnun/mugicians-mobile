import React from "react";
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  View,
  Button,
  Text
} from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { TextInput } from "react-native-gesture-handler";

export default class EditScreen extends React.Component {
  static navigationOptions = {
    title: "Edit"
  };
  constructor(props) {
    super(props);
    this._isMounted = false;
    const dataParse = JSON.parse(this.props.navigation.state.params.data);

    this.state = {
      isShowingText: true,
      songId: dataParse.id,
      songObject: {},
      songsArr: [],
      songLyrics: dataParse.lyrics,
      lyr: dataParse.lyrics,
      songName: dataParse.name,
      tit: dataParse.name,
      additionalInfo: dataParse.info,
      add: dataParse.info,
      resetForm: false,
      fromHome: this.props.navigation.state.params.data
    };
    console.log("DATA FROM PROPS", this.state.fromHome);

    setInterval(
      () =>
        this.setState(previousState => ({
          isShowingText: !previousState.isShowingText,
          fromHome: this.props.navigation.state.params.data
        })),
      100
    );
  }
  static navigationOptions = {
    title: "Edit"
  };

  componentDidMount = () => {
    this._isMounted = true;
    console.log("mountlink");
  };

  componentWillUnmount = () => {
    console.log("unmount");
    this.setState({
      resetForm: true
    });
    this.resetForm();
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
          this.componentWillUnmount();
          navigate("Home");
        });
      });
    }
  };

  toBeReset = () => {
    this.resetForm();
  };

  resetForm = () => {
    this.setState({
      songObject: {},
      songId: "",
      songsArr: [],
      songLyrics: "",
      songName: "",
      additionalInfo: "",
      resetForm: false
    });
  };

  render() {
    if (!this.state.resetForm) {
      return (
        <ScrollView style={styles.container}>
          <Text>{this.state.fromHome}</Text>
          <Text>Song:</Text>
          <TextInput
            name="songName"
            value={this.state.tit}
            onChangeText={tit => {
              this.setState({ songName: tit });
            }}
          />
          <Text>lyrics:</Text>
          <TextInput
            name="songLyrics"
            value={this.state.lyr}
            onChangeText={lyr => {
              this.setState({ songLyrics: lyr });
            }}
          />
          <Text>Additional info</Text>
          <TextInput
            name="additionalInfo"
            value={this.state.add}
            onChangeText={add => {
              this.setState({ additionalInfo: add });
            }}
          />
          <Button title="Submit" onPress={this.submit} />
          <Button title="Reset Form" onPress={this.toBeReset} />
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
