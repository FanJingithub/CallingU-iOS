/**
 * Created by Aliez on 2018/3/30.
 */
import React from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    List,
    Switch,
} from 'antd-mobile';
import Icon from 'react-native-vector-icons/FontAwesome';
import QuitButton from './QuitButton';
import { createForm } from 'rc-form';
import style from "./Style";

const styles = style;

class PreferenceSelectionList extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        const {getFieldProps} = this.props.form;
        return (
            <List>
                <List.Item
                    extra={<Switch
                        {...getFieldProps('Switch', {
                            initialValue: false,
                            valuePropName: 'checked',
                        })}
                        platform="ios"
                        color="green"
                    />}
                >
                    <Text style={styles.preferText1}>自动拨打 120</Text>
                    <Text/>
                    <Text style={styles.preferText2}>开启后，当确认呼救时，将自动拨打120</Text>
                </List.Item>
            </List>
        );
    }
}

class ContactsList extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <List>
                <TouchableOpacity style={styles.btn_A1}>
                    <Text style={styles.btnText_A}>
                        ➕
                    </Text>
                </TouchableOpacity>
            </List>
        )
    }
}

class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.MessageExample}>
                <Text style={styles.messageText}>
                    请帮助我！我遇到麻烦了！
                </Text>
                <Text/>
            </View>
        )
    }
}

class PreferenceSelection extends React.Component{
    static navigationOptions = {
        title: '偏好设置',
        header: null,
        drawerLabel: '偏好设置',
        drawerIcon:({tintColor}) => (
            <Icon name="chevron-circle-right"/>
        ),
        drawerPosition: "left",
    };

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            // value: false,
        }
    }

    render(){
        return(
            <View style={styles.container_C}>
                <View style={styles.header}>
                    <Icon.Button style={styles.icon} name="list" backgroundColor="rgb(247,92,47)"
                                 size={30} onPress={() => this.props.navigation.navigate('DrawerOpen')}/>
                    <Text style={styles.headerText_P}>偏好设置</Text>
                    <QuitButton navigation={this.state.navigation}/>
                </View>
                <View style={styles.PreferenceSelectionListExample}>
                    <Text/>
                    <PreferenceSelectionListExample/>
                    <Text/>
                    <View style={styles.ContactListExample}>
                        <Text style={styles.preferText3}>联系人</Text>
                    </View>
                    <ContactsListExample/>
                    <View style={styles.ContactListExample}>
                        <Text style={styles.preferText3}>短信内容</Text>
                    </View>
                    <MessageExample/>
                    <TouchableOpacity style={styles.btn_A2} onPress={() => this.props.navigation.navigate('Message')}>
                        <Text style={styles.btnText_A}>
                            编辑
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const PreferenceSelectionListExample = createForm()(PreferenceSelectionList);
const ContactsListExample = createForm()(ContactsList);
const MessageExample = createForm()(Message);

export default PreferenceSelection;