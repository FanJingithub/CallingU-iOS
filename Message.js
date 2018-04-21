import React from 'react';
import {
    Image,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from "./Style";
import {TextareaItem} from 'antd-mobile';
import {createForm} from 'rc-form';

const styles = style;

class MessageEdit extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const { getFieldProps } = this.props.form;
        return (
            <TextareaItem
                {...getFieldProps('count', {
                })}
                keyboardType="phone-pad"
                returnKeyType="done"
                rows={10}
                count={100}
            />
        )
    }
}

class Message extends React.Component{
    static navigationOptions = {
        title: '编辑短信',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
        }
    }

    render(){
        return(
            <View style={styles.container_C}>
                <View style={styles.header}>
                    <Icon.Button style={styles.icon} name="angle-left" backgroundColor="rgb(247,92,47)"
                                 size={30} onPress={() => this.props.navigation.goBack()}/>
                    <Text/>
                    <Text style={styles.headerText_P}>编辑短信</Text>
                    <TouchableOpacity>
                        <Text style={styles.headerText_P2}>保存</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContactListExample}>
                    <MessageEditExample/>
                </View>
            </View>
        );
    }
}

const MessageEditExample = createForm()(MessageEdit);

export default Message;