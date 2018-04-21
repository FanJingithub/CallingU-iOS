import React from 'react';
import {View,Text,Modal} from 'react-native';
import {
    StackNavigator,
    DrawerNavigator,
    DrawerItems
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import style from './Style';

import GuidePage from "./Guide";
import WelcomePage from './WelcomePage';
import PasswordSignIn from './PasswordSignIn';
import SignUp from './SignUp';
import ForgetPassword from './ForgetPassword';
import ChangePhone from './ChangePhone';
import MainPage from './MainPage';
import PreferenceSelection from './PreferenceSelection';
import AskForHelp from './AskForHelp';
import Information from './Information';
import VersionDetail from './VersionDetail';
import HelpList from "./HelpList";
import Feedback from "./Feedback";
import Message from "./Message";
import TlistSet from "./TlistSet";

const styles = style;

const myContentComponent = (props) => (
    <View>
        <View style={{
            flexDirection: 'column',
        }}>
            <View style={{
                backgroundColor: '#f50057',
                height: 220,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{flexDirection: 'row',justifyContent: 'space-around' }}>
                    <Icon name="user-circle" size={50} color="white"/>
                    <View style={{flex: 0.25}}/>
                    <Text style={{paddingTop: 15}}>用户名</Text>
                </View>
            </View>
        </View>
        <DrawerItems {...props}/>
    </View>
);

const App_2 = DrawerNavigator({
    MainPage:{
      screen:MainPage,
    },
    Preference: {screen: PreferenceSelection},
    Information: {screen:Information},
    VersionDetail: {screen:VersionDetail},
    TlistSet: {screen:TlistSet},
},{
    contentComponent: myContentComponent,
    contentOptions:{
        initialRouteName: MainPage
    }
});


const App_1 = StackNavigator({
    Guide: {screen: GuidePage,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),},
    Welcome:{screen: WelcomePage,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    Password:{screen: PasswordSignIn,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    SignUp:{screen: SignUp,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    Forget:{screen: ForgetPassword,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    ChangePhone:{
        screen: ChangePhone,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
});

const App = StackNavigator({
    App:{
        screen: App_1,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    MainPage:{
        screen: App_2,
        // MainPage,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
            header: null,
        }),
    },
},{
    mode: 'modal',
});

const SimpleApp = StackNavigator({
    SimpleApp:{
        screen: App,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    AskForHelp:{
        screen: AskForHelp,
        navigationOptions:({navigation})=>({
            gesturesEnabled:false,
        }),
    },
    HelpList: {
        screen: HelpList,
        navigationOptions: ({navigation}) => ({
            gesturesEnabled: false,
        }),
    },
    Feedback: {
        screen: Feedback,
        navigationOptions: ({navigation}) => ({
            gesturesEnabled: false,
        }),
    },
    Message: {
        screen: Message,
        navigationOptions: ({navigation}) => ({
            gesturesEnabled: false,
        }),
    },
});

export default SimpleApp;