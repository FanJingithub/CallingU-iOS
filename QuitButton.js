/**
 * Created by Aliez on 2018/4/11.
 */
import React,{PropTypes} from 'react';
import {
    Image,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from "./Style"

const styles = style;

export default class QuitButton extends React.Component {
    static navigationOptions = {
        title: '退出',
        header: null,
    };

    constructor(props){
        super(props);
        this.state={
            isModal: false,
            transparent: true,
        };

        this.showModal = this.showModal.bind(this);
    }

    showModal() {
        this.setState({
            isModal: true
        })
    }

    render(){
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 20 }
            : null;
        return(
            <View>
                <Modal animationType={"fade"} transparent={ true } visible={this.state.isModal}
                       onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={[styles.container_Modal, modalBackgroundStyle]}>
                        <View style={[styles.inner_Modal, innerContainerTransparentStyle]}>

                            <Text style={styles.modal_Text_1}>确定退出登录？</Text>
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
                                    () => {this.setState({isModal:false});this.props.navigation.navigate('Welcome');}
                                }>
                                    <Text style={styles.btnText_M}>
                                        确定
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Icon.Button name="power-off" backgroundColor="rgb(247,92,47)" size={30} style={{
                    paddingTop: 20,
                    paddingRight: 0,}} onPress={() => {this.setState({
                    isModal: true
                })}}/>
            </View>
        );
    }
}