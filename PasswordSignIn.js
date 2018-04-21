/**
 * Created by Aliez on 2018/3/25.
 */
import React,{PropTypes} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { List, InputItem, Toast } from 'antd-mobile';
import qs from 'qs';
import style from "./Style"

const styles = style;

const Status = {
    Normal: 1,  //正常状态
    Start: 2,   //倒计时开始状态
    End: 3,     //倒计时结束
};

class PasswordSignIn extends React.Component {
    static navigationOptions = {
        title: '密码登录',
        header: null,
        headerTitle: 'Main',
    };

    static defaultProps = {
        maxTime: 60,
        normalTxt: '获取验证码',
        endTxt: '重新发送',
        countdownTxt:'秒后重新发送',
        auto: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            countdownTxt: props.normalTxt,
            text:"获取验证码",
            btnDisabled: false,
            navigation: this.props.navigation,
            number: '',
            code:'',
            hasError: true,
            value: '',
        };
        this.handlePress = this.handlePress.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.handleSubmmit = this.handleSubmmit.bind(this)
    }

    componentDidMount() {
        if(this.props.auto){
            this.startCountdown();
        }
    }

    status = Status.Normal;
    //点击开始
    startCountdown = () => {
        if (this.status !== Status.Start) {
            if (this.props.beforeCountdown) {
                let flag = this.props.beforeCountdown();
                if (flag) {
                    this._startTimer();
                }
            }else{
                this._startTimer();
            }
        }
    };

    countdownTime = 0;//倒计时时间
    _startTimer = () => {
        const {maxTime, endTxt,countdownTxt,startCountdown} = this.props;
        if(startCountdown){
            startCountdown();
        }

        this.countdownTime = maxTime ; //倒计时时间
        this.status = Status.Start;
        this.setState({
            countdownTxt:maxTime+countdownTxt,
        });
        this.timer = setInterval(() => {
            let currTime = this.countdownTime - 1;
            if (currTime <= 0) {
                this.countdownTime = maxTime;
                this.status = Status.End;
                this.setState({
                    countdownTxt:endTxt,
                });
                clearInterval(this.timer);
            } else {
                this.countdownTime = currTime;
                if (this.countdownTime === maxTime) {
                    this.setState({
                        countdownTxt:this.countdownTime+countdownTxt,
                    });
                } else {
                    this.setState({
                        countdownTxt:this.countdownTime+countdownTxt,
                    });
                }
            }
        }, 1000);
    };

    getTouchableStyle = () => {
        var style = {};
        switch (this.status) {
            case Status.Start:
                style = [styles.btn_security_code, this.props.countdownStartStyle];
                break;
            case Status.End:
                style = [styles.btn_security_code, this.props.countdownEndStyle];
                break;
            default:
                style = [styles.btn_security_code, this.props.countdownNormalStyle];
        }
        return style;
    };

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位手机号码');
        }
    };

    onChange = (value) => {
        if (value.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            value,
        });
    };

    onChangeNumber(event){
        this.setState({number: event.nativeEvent.text});
    }

    onChangeCode(event){
        this.setState({code: event.nativeEvent.text});
    }

    onChangeDisabled(event){
        this.setState({btnDisabled: !this.state.btnDisabled});
    }

    handlePress(event){
        event.preventDefault();
        let transfer_json_to_form = (params) => { return qs.stringify(params) };
        let text={"number":this.state.number};
        let data=transfer_json_to_form(text);
        if(!this.state.hasError) {
            fetch('https://www.xiaobenji.net/api/identify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:
                data,
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
                    // this.setState({
                    //     requestSucc: true,
                    // });
                })
                .catch((err) => console.error(err));
        }
        else {
            Toast.info('请输入11位手机号码');
        }
    }

    handleSubmmit(event){
        event.preventDefault();
        let transfer_json_to_form = (params) => { return qs.stringify(params) };
        let text={"number":this.state.number,"code":this.state.code};
        let data=transfer_json_to_form(text);
        if(!this.state.hasError) {
            fetch('https://www.xiaobenji.net/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:
                data,
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
                    alert(JSON.stringify(res));
                    this.state.navigation.navigate('MainPage')
                })
                .catch((err) => console.error(err));
        }
        else {
            Toast.info('请输入11位手机号码');
        }
    }

    render() {
        let btnBackgroundColor = {
            backgroundColor: this.state.btnDisabled ? '#d3d3d3' : 'rgb(247,92,47)',
        };
        // let btnText = this.state.btnDisabled ? "获取验证码" : "";
        return (
            <View style={styles.container_P}>
                <View style={styles.header}>
                    <Icon.Button style={styles.icon} name="angle-left" backgroundColor="rgb(247,92,47)"
                                 size={30} onPress={() => this.props.navigation.goBack()}/>
                    <Text style={styles.headerText}>登录</Text>
                    <Text/>
                </View>
                <View style={styles.introText}>
                    <Text style={styles.introTextHeader}>验证码登录</Text>
                    <Text style={styles.introTextContent}>请输入您的手机号以获取验证码</Text>
                </View>
                <View style={styles.PasswordSignInListExample}>
                    {/*<PasswordSignInListExample navigation={this.state.navigation}/>*/}
                    <InputItem
                        type="number"
                        placeholder="input your phone"
                        error={this.state.hasError}
                        onErrorClick={this.onErrorClick}
                        onChange={this.onChange}
                        onEndEditing={this.onChangeNumber.bind(this)}
                        value={this.state.value}
                        maxLength={11}
                        keyboardType="phone-pad"
                        returnKeyType="done"
                        clearButtonMode="while-editing"
                    >手机号</InputItem>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: 200}}>
                            <InputItem
                                type="number"
                                placeholder=""
                                maxLength={4}
                                keyboardType="phone-pad"
                                returnKeyType="done"
                                onEndEditing={this.onChangeCode.bind(this)}
                                clearButtonMode="while-editing">验证码</InputItem>
                        </View>
                        <View style={{paddingLeft: 56.5, paddingTop: 5}}>
                            <TouchableOpacity style={[styles.btn_security_code,btnBackgroundColor]} disabled = {this.state.btnDisabled}
                                              onPress={this.handlePress.bind(this)}>
                                <Text style={styles.btnText_security_code}>
                                    {this.state.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.forgetPassword}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Forget')}>
                            <Text style={styles.forgetPasswordText}>
                                忘记密码?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.btn_P}
                                       onPress={this.handleSubmmit.bind(this)
                                           // () => this.props.navigation.navigate('MainPage')
                                       }>
                        <Text style={styles.btnText_P}>
                            确定
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.reminder}>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.shift_P}
                                onPress={this._onPress}>
                                <Text style={styles.information}>
                                    微信登录
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shift_P}
                                              onPress={() => this.props.navigation.navigate('ChangePhone')}>
                                <Text style={styles.information}>
                                    更换手机号
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.watermakeContainer}>
                    <Text style={styles.watermake}>By LFChicken (2018)</Text>
                </View>
            </View>
        );
    }
}

export default PasswordSignIn;