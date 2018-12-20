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
    const lyrics = dataParse.lyrics;
    const name = dataParse.name;
    const info = dataParse.info;

    this.state = {
      isShowingText: true,
      songId: dataParse.id,
      songObject: {},
      songsArr: [],
      songLyrics: lyrics,
      lyr: lyrics,
      songName: name,
      tit: name,
      additionalInfo: info,
      add: info,
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

  componentWillUnmount = () => {
    console.log("unmount");
    this.setState({
      resetForm: true
    });
    this.resetForm();
  };

  componentWillReceiveProps = () => {
    if (!this.state.resetForm) {
      const d = JSON.parse(this.props.navigation.state.params.data);
      console.log("IIIIIIIIIDF", d);
      this.setState({
        fromHome: this.props.navigation.state.params.data
      });
      this.setState({ tit: d.name, lyr: d.lyrics, add: d.info });
    } else {
      const d = JSON.parse(this.props.navigation.state.params.data);
      console.log("ELSSSSSE", d);
      this.setState({
        tit: d.name,
        lyr: d.lyrics,
        add: d.info
      });
    }
  };

  submit = () => {
    const songId = JSON.parse(this.props.navigation.state.params.data).id;
    const songName = this.state.tit;
    const lyrics = this.state.lyr;
    const additionalInfo = this.state.additionalInfo;

    let idO = songId + "_object";
    let idObj = {
      id: songId,
      name: songName,
      lyrics: lyrics,
      info: additionalInfo
    };
    console.log("in submit:", songId);

    AsyncStorage.removeItem(this.props.navigation.state.params.data, () => {
      AsyncStorage.setItem(idO, JSON.stringify(idObj), () => {
        AsyncStorage.getItem(idO, (err, result) => {
          const { navigate } = this.props.navigation;
          alert("Created!", songId);
          console.log("in async", idO, idObj);
          this.componentWillUnmount();
          this.resetForm;
          navigate("Home", { home: true });
        });
      });
    });
  };

  toGoBack = () => {
    this.resetForm();
  };

  resetForm = () => {
    const { navigate } = this.props.navigation;
    this.setState({
      songObject: {},
      songId: "",
      songsArr: [],
      songLyrics: "",
      songName: "",
      additionalInfo: "",
      resetForm: false,
      fromHome: "",
      tit: "",
      lyr: "",
      add: ""
    });
    navigate("Home");
  };

  render() {
    // if (!this.state.resetForm) {
    const dataP = JSON.parse(this.props.navigation.state.params.data);
    return (
      <ScrollView style={styles.container}>
        <Text>{this.state.fromHome}</Text>
        <Text>{this.props.navigation.state.params.data}</Text>
        <Text>Song:</Text>
        <TextInput
          name="songName"
          defaultValue={dataP.name}
          onChangeText={tit => {
            this.setState({ tit: tit });
          }}
        />
        <Text>lyrics:</Text>
        <TextInput
          name="songLyrics"
          defaultValue={dataP.lyrics}
          onChangeText={lyr => {
            this.setState({ lyr: lyr });
          }}
        />

        <Text>Additional info</Text>
        <TextInput
          name="additionalInfo"
          defaultValue={dataP.info}
          onChangeText={add => {
            this.setState({ add: add });
          }}
        />
        <Button title="Submit" onPress={this.submit} />
        <Button title="back" onPress={this.toGoBack} />
        <Text>{this.state.songName}</Text>
      </ScrollView>
    );
    // } else {
    //   return <Text>""</Text>;
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
