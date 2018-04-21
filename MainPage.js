/**
 * Created by Aliez on 2018/3/30.
 */
import React from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    Modal
} from 'react-native';
import Geolocation from 'Geolocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import QuitButton from './QuitButton';
import qs from 'qs';
import style from "./Style";

const styles = style;

class MainPage extends React.Component{
    static navigationOptions = {
        title: '主界面',
        header: null,
        drawerLabel: '主界面',
        drawerIcon:({tintColor}) => (
            <Icon name="chevron-circle-right"/>
        ),
        drawerPosition: "left",
    };

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            number: '',
            latitude: '',
            longitude: '',
            sos: '',
            state: '',
            isModal: false,
            isModal_btn: false,
            transparent: true,
            transparent_btn: true,
        };

        this.handlePress = this.handlePress.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    showModal() {
        this.setState({
            isModal: true
        })
    }

    handlePress(event){
        event.preventDefault();
        this.setState({
            isModal: false,
        });
        Geolocation.getCurrentPosition(
          location => {
              this.setState({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
              });
          },
            error => {
                alert("获取位置失败："+ error)
            }
        );
        this.setState({
            number:'',
            sos:'1',
            state:'0',
        });

        let transfer_json_to_form = (params) => { return qs.stringify(params) };
        let text={"number":this.state.number,"latitude":this.state.latitude,"longitude":this.state.longitude,
                    "sos":this.state.sos,"state":this.state.state};
        let data=transfer_json_to_form(text);
        fetch('https://www.xiaobenji.net/api/get-help',{
            method:'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        })
            .then((res)=>{
            if(res.status === 200)
                res.json();
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
            // alert(res);
                this.state.navigation.navigate('AskForHelp',
                    {number:this.state.number,latitude:this.state.latitude,longitude:this.state.longitude});
            })
            .catch((err)=>console.error(err));
    }

    render(){
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 20 }
            : null;
        return(
            <View style={styles.container_M}>
                <View style={styles.header_M}>
                    <Icon.Button style={styles.icon} name="list" backgroundColor="rgb(247,92,47)"
                                 size={30} onPress={() => this.props.navigation.navigate('DrawerOpen')}/>
                    <Text style={styles.headerText_P}>CallingU</Text>
                    <QuitButton navigation={this.state.navigation}/>
                </View>

                <Modal animationType={"fade"} transparent={ true } visible={this.state.isModal}
                        onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={[styles.container_Modal, modalBackgroundStyle]}>
                        <View style={[styles.inner_Modal, innerContainerTransparentStyle]}>

                            <Text style={styles.modal_Text_1}>求救后此信息将传播给附近的志愿者,</Text>
                            <Text style={styles.modal_Text_2}>是否确定呼救？</Text>
                            <View style={styles.modal_btn_Container}>
                            <TouchableOpacity style={{paddingRight: 15}} onPress={() => {{
                                this.setState({
                                    isModal:false
                                })
                            }}}>
                                <Text style={styles.btnText_M}>
                                    取消
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={
                                this.handlePress.bind(this)
                            }>
                                <Text style={styles.btnText_M}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.container_M_Body}>
                    <TouchableOpacity onPress={
                        this.showModal.bind(this)
                    }>
                        <Image style={styles.img_M} source={require('/Users/Aliez/WebstormProjects/CallingU/img/faint.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.img_M} source={require('/Users/Aliez/WebstormProjects/CallingU/img/trauma.png')}
                        />
                    </TouchableOpacity>
                    <View style={styles.container_M2}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HelpList')}>
                            <Icon style={styles.icon2} name="user-md" size={60}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default MainPage;