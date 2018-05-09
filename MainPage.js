/**
 * Created by Aliez on 2018/3/30.
 */
import React from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '/Users/Aliez/WebstormProjects/CallingU/src/Util/Param.js';
import QuitButton from './QuitButton';
import { Badge } from 'antd-mobile';
import {Geolocation} from 'react-native-baidu-map';
import qs from 'qs';
import style from "./Style";

const styles = style;
const per = Dimensions.get('window').width/414;

class MainPage extends React.Component {
    static navigationOptions = {
        title: '主界面',
        header: null,
        drawerLabel: '主界面',
        drawerIcon: ({tintColor}) => (
            <Icon name="chevron-circle-right"/>
        ),
        drawerPosition: "left",
    };

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            number: '',
            latitude: 0,
            longitude: 0,
            isModal: false,
            isModal_btn: false,
            transparent: true,
            transparent_btn: true,
            setCookie: null,
        };

        this.handlePress = this.handlePress.bind(this);
        this.showModal = this.showModal.bind(this);

        this.timer = setTimeout(() => {
            Geolocation.getCurrentPosition()
                .then(data => {
                    this.state.latitude = data.latitude;
                    this.state.longitude = data.longitude;
                })
                .catch(e => {
                    console.warn(e, 'error');
                })
        }, 1000);
    }

    componentWillMount() {
        storage.load({key: 'SetCookie'})
            .then((res) => {
                this.state.setCookie = res;
            })
            .catch((error) => {
                alert(error);
            });
        storage.load({key: 'number'})
            .then((res) => {
                this.state.number = res;
            })
            .catch((error) => {
                alert(error);
            });
        storage.save({key: 'target', data: this.state.number});
        storage.save({key: 'sos', data: -1});
        storage.save({key: 'state', data: -1});
        storage.save({key: 'phonestate', data: 0});
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    showModal() {
        storage.load({key: 'help'})
            .then((res) => {
                if (res === 0) {
                    this.setState({
                        isModal: true
                    })
                }
                else if (res === 1) {
                    storage.save({key: 'sos', data: 1});
                    storage.save({key: 'state', data: 0});
                    let transfer_json_to_form = (params) => {
                        return qs.stringify(params)
                    };
                    let text = {
                        "number": this.state.number, "latitude": this.state.latitude, "longitude": this.state.longitude,
                        "sos": 1, "state": 0,
                    };
                    let data = transfer_json_to_form(text);
                    fetch('https://www.xiaobenji.net/api/get-help', {
                        method: 'POST',
                        headers: {
                            'set-cookie': this.state.setCookie,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: data,
                    })
                        .then((res) => {
                            if (res.status === 200)
                                res.json().then((res) => {
                                    this.state.navigation.navigate('AskForHelp',
                                        {
                                            number: this.state.number,
                                            latitude: this.state.latitude,
                                            longitude: this.state.longitude,
                                            rescuer: res
                                        });
                                });
                            else if (res.status === 203)
                                return Promise.reject("未知错误");
                            else if (res.status === 400)
                                return Promise.reject("请求失败");
                            else if (res.status === 500)
                                return Promise.reject("服务器错误");
                        })
                        .catch((err) => console.error(err));
                }
            })
            .catch((error) => {
                alert(error);
            })
    }

    handlePress(event) {
        event.preventDefault();
        this.setState({
            isModal: false,
        });

        storage.save({key: 'sos', data: 1});
        storage.save({key: 'state', data: 0});
        let transfer_json_to_form = (params) => {
            return qs.stringify(params)
        };
        let text1 = {
            "number": this.state.number, "target": this.state.number,
            "phonestate": 0, "state": 0,
        };
        let data1 = transfer_json_to_form(text1);
        fetch('https://www.xiaobenji.net/api/report-state-changed', {
            method: 'POST',
            headers: {
                'set-cookie': this.state.setCookie,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data1,
        })
            .then((res) => {
                if (res.status === 200)
                    res.json().then((res) => {
                    });
                else if (res.status === 203)
                    return Promise.reject("未知错误");
                else if (res.status === 400)
                    return Promise.reject("请求失败");
                else if (res.status === 500)
                    return Promise.reject("服务器错误");
            })
            .catch((err) => console.error(err));

        let text = {
            "number": this.state.number, "latitude": this.state.latitude, "longitude": this.state.longitude,
            "sos": 1, "state": 0,
        };
        let data = transfer_json_to_form(text);
        fetch('https://www.xiaobenji.net/api/get-help', {
            method: 'POST',
            headers: {
                'set-cookie': this.state.setCookie,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        })
            .then((res) => {
                if (res.status === 200)
                    res.json().then((res) => {
                        storage.save({key: 'help', data: 1});
                        this.state.navigation.navigate('AskForHelp',
                            {
                                number: this.state.number,
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                rescuer: res
                            });
                    });
                else if (res.status === 203)
                    return Promise.reject("未知错误");
                else if (res.status === 400)
                    return Promise.reject("请求失败");
                else if (res.status === 500)
                    return Promise.reject("服务器错误");
            })
            .catch((err) => console.error(err));
    }

    render() {
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? {backgroundColor: '#fff', padding: 20}
            : null;
        return (
            <View style={styles.container_M}>
                <View style={styles.header_M}>
                    <Icon.Button style={styles.icon} name="list" backgroundColor="rgb(247,92,47)"
                                 size={per*30} onPress={() => this.props.navigation.navigate('DrawerOpen')}/>
                    <Text style={styles.headerText_P}>CallingU</Text>
                    <QuitButton navigation={this.state.navigation}/>
                </View>

                <Modal animationType={"fade"} transparent={ true } visible={this.state.isModal}
                       onRequestClose={() => {
                           alert("Modal has been closed.")
                       }}>
                    <View style={[styles.container_Modal, modalBackgroundStyle]}>
                        <View style={[styles.inner_Modal, innerContainerTransparentStyle]}>

                            <Text style={styles.modal_Text_1}>求救后此信息将传播给附近的志愿者,</Text>
                            <Text style={styles.modal_Text_2}>是否确定呼救？</Text>
                            <View style={styles.modal_btn_Container}>
                                <TouchableOpacity style={{paddingRight: per*15}} onPress={() => {
                                    {
                                        this.setState({
                                            isModal: false
                                        })
                                    }
                                }}>
                                    <Text style={styles.btnText_M}>
                                        取消
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.handlePress.bind(this)}>
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
                        <Image style={styles.img_M}
                               source={require('/Users/Aliez/WebstormProjects/CallingU/img/faint.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.img_M}
                               source={require('/Users/Aliez/WebstormProjects/CallingU/img/trauma.png')}
                        />
                    </TouchableOpacity>
                    <View style={styles.container_M2}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HelpList', {
                            number: this.state.number,
                            latitude: this.state.latitude,
                            longitude: this.state.longitude
                        })}>
                            <Badge text={100}>
                                <Icon style={styles.icon2} name="user-md" size={per*60}/>
                            </Badge>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default MainPage;