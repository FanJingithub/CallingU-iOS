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

const styles = style;

class HelpList extends React.Component{
    static navigationOptions = {
        title: '呼救信息',
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
                    <Text style={styles.headerText_P}>呼救信息</Text>
                    <Text/>
                </View>
            </View>
        );
    }
}

export default HelpList;