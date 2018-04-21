import React from 'react';
import {
    Image,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import QuitButton from './QuitButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from "./Style";

const styles = style;

class VersionDetail extends React.Component{
    static navigationOptions = {
        title: '版本信息',
        header: null,
        drawerLabel: '版本信息',
        drawerIcon:({tintColor}) => (
            <Icon name="chevron-circle-right"/>
        ),
        drawerPosition: "left",
    };

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            versionCode: 2,
            versionName: '2.0',
            versionDetail: '',
        };
        this.handlePress = this.handlePress.bind(this)
    }

    handlePress(){
        fetch('https://www.xiaobenji.net/api/check-new?versionCode='+this.state.versionCode)
            .then((res)=> {
                if (res.status === 200) {
                    alert(JSON.stringify(res.json()));
                }
                else if(res.status === 202)
                    alert("接受请求，请求已经进入后台排队");
                else if(res.status === 203)
                    alert("未知错误");
                else if(res.status === 400)
                    alert("请求失败");
                else if(res.status === 500)
                    alert("服务器错误");
            })
            .then((res)=>{
                // this.state.navigation.navigate('AskForHelp',{latitude:this.state.latitude,longitude:this.state.longitude});
            })
            .catch((err)=>console.error(err));
    }

    // componentWillMount(){
    //     fetch('https://www.xiaobenji.net')
    // }

    render(){
        return(
            <View style={styles.container_C}>
                <View style={styles.header}>
                    <Icon.Button style={styles.icon} name="list" backgroundColor="rgb(247,92,47)"
                                 size={30} onPress={() => this.props.navigation.navigate('DrawerOpen')}/>
                    <Text style={styles.headerText_P}>版本信息</Text>
                    <QuitButton navigation={this.state.navigation}/>
                </View>
                <View style={styles.container_V}>
                <View style={styles.container_V_Body}>
                    <Image source={require('/Users/Aliez/WebstormProjects/CallingU/img/logo.png')}/>
                    <Text/>
                    <Text/>
                    <Text style={styles.versionText}>一键呼救 {this.state.versionName}</Text>
                    <Text/>
                    <Text/>
                    <Text/>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Feedback')}>
                        <Text style={styles.btnText_V}>反馈</Text>
                    </TouchableOpacity>
                    <Text/>
                    <Text/>
                    <TouchableOpacity onPress={this.handlePress.bind(this)}>
                        <Text style={styles.btnText_V}>检查更新</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        );
    }
}

export default VersionDetail;