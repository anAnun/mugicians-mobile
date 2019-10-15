import React from "react";
import {
  Image,
  Button,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  BackHandler,
  Clipboard,
  ToastAndroid
} from "react-native";
import { WebBrowser } from "expo";
import { MonoText } from "../components/StyledText";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor(props) {
    super(props);
    this.state = {
      songsArr: [],
      completeArray: [],
      copy: false
    };

    // if (!this.state.isFocused){
    //   this.setState({isFocused: this.props.navigation.state.params.home})
    //   console.log(this.state.isFocused)
    // }

    // setInterval(
    //   () =>
    //     this.setState(previousState => ({
    //       isShowingText: !previousState.i+sShowingText
    //     })),
    //   1000
    // );
  }

  componentDidMount = () => {
    this.item();
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  };

  componentWillReceiveProps = () => {
    //maybe it's expo but componentDidUpdate
    //leaves the screen blank when app is loaded
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    this.item();
  };

  handleBackPress = () => {
    const { navigate } = this.props.navigation;
    navigate("Home");
    return true;

    // Alert.alert(
    //   "Exit App",
    //   "Exiting the application?",
    //   [
    //     {
    //       text: "Cancel",
    //       // onPress: () => {
    //       //   BackHandler.removeEventListener(
    //       //     "hardwareBackPress",
    //       //     this.handleBackPress
    //       //   );
    //       // },
    //       onPress: () => {
    //         null;
    //       },
    //       style: "cancel"
    //     },
    //     {
    //       text: "OK",
    //       onPress: () => BackHandler.exitApp()
    //     }
    //   ],
    //   {
    //     cancelable: false
    //   }
    // );
    // return true;
  };

  // clearAsyncStorage = async () => {
  //   AsyncStorage.clear();
  // };

  item = async () => {
    this.setState({ songsArr: [] });
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          let value = store[i][1];
          let key = store[i][0];
          let song = this.state.songsArr;
          song.push(value);

          this.setState({
            songsArr: song
          });
        });
      });
    });
  };
  copyToClipboard = () => {
    this.item();
    const arr = this.state.songsArr;
    const arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      arr2.push(
        "Name: " +
          JSON.parse(arr[i]).name +
          "\n Lyrics: " +
          JSON.parse(arr[i]).lyrics +
          "\n Info: " +
          JSON.parse(arr[i]).info +
          "\n" +
          "\n"
      );
    }
    console.log(arr2);
    Clipboard.setString(String(arr2));
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
    return true;
  };
  // Clipboard.getString(this.state.completeArray);
  //   writeToClipboard = async () => {
  //     await Clipboard.setString("this.state.completeArray");
  //   };
  //   // setContent = async () => {
  //   //   const clipboardContent = await Clipboard.getString();
  //   //   this.setState({ clipboardContent });
  //   // };
  //   console.log(
  //     "COMPLETE ARRAY",
  //     this.state.completeArray,
  //     "SONGS ARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
  //     this.state.songsArr
  //   );
  //   this.setState({ copy: false });
  // }

  handleSongClick = data => {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    const { navigate } = this.props.navigation;
    navigate("Edit", { data: data });
  };

  newSong = () => {
    const { navigate } = this.props.navigation;
    navigate("Create");
  };

  render() {
    const songs = this.state.songsArr.map(song => {
      return (
        <View
          style={{ color: "#c0c0c0", margin: 10 }}
          key={JSON.parse(song).id}
        >
          <TouchableOpacity onPress={() => this.handleSongClick(song)}>
            <Text style={styles.textButton}>{JSON.parse(song).name}</Text>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <View style={styles.copyButton}>
              <TouchableOpacity onPress={() => this.copyToClipboard()}>
                <Text style={styles.tabBarInfoText}>
                  Copy all data to clipboard
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.copyButton}>
              <TouchableOpacity onPress={() => this.copyToClipboard()}>
                <Text style={styles.tabBarInfoText}>
                  Copy all data to clipboard
                </Text>
              </TouchableOpacity>
            </View> */}
            {this.state.songsArr.length < 1 && (
              <View style={styles.getStartedText}>
                <Text style={styles.codeHighlightText}>
                  Welcome to Mugicians! Where you can organize all of your song
                  ideas!
                </Text>
              </View>
            )}
            {/* <Button title="DELETE ALL" onPress={this.clearAsyncStorage} /> */}
            {songs}
            <View style={styles.space} />
          </View>
        </ScrollView>
        {this.state.songsArr.length < 1 && (
          <View style={styles.tabBarInfoContainer}>
            <TouchableOpacity onPress={() => this.newSong()}>
              <Text style={styles.tabBarInfoText}>
                Press Create to get started!
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  // welcomeImage: {
  //   width: 100,
  //   height: 80,
  //   resizeMode: "contain",
  //   marginTop: 3,
  //   marginLeft: -10
  // },
  codeHighlightText: {
    color: "#068587",
    margin: 20,
    fontSize: 18
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#068587",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 20,
    color: "#F3B134",
    textAlign: "center"
  },
  textButton: {
    fontSize: 20,
    color: "#c0c0c0",
    textAlign: "center"
  },
  copyButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "grey",
    paddingVertical: 20
  },
  space: {
    padding: 40
  }
});
