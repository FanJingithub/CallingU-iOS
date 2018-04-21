/**
 * Created by Aliez on 2018/4/7.
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';
import { Card, WingBlank, WhiteSpace, List } from 'antd-mobile';
import { createForm } from 'rc-form';
import qs from 'qs';
import style from "./Style";

const styles = style;

class RescuerList extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        const {getFieldProps} = this.props.form;
        return (
            <List>
                <List.Item>
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                            <Card.Header
                                title="救助者："
                                extra={<View>this is extra</View>}
                            />
                            <Card.Body style={{paddingLeft: 10}}>
                                <Text>This is content of `Card`</Text>
                            </Card.Body>
                            <Card.Footer content="footer content" extra={<Text>extra footer content</Text>} />
                        </Card>
                        <WhiteSpace size="lg" />
                    </WingBlank>
                </List.Item>
            </List>
        );
    }
}

class AskForHelp extends React.Component{
    static navigationOptions = {
        title: '求救界面',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            number: this.props.navigation.state.params.number,
            longitude: this.props.navigation.state.params.longitude,
            latitude: this.props.navigation.state.params.latitude,
            sos: '',
            state: '',
            navigation: this.props.navigation,
            mayType: MapTypes.NORMAL,
            zoom: 15,
            center: {
                number: this.props.navigation.state.params.number,
                longitude: this.props.navigation.state.params.longitude,
                latitude: this.props.navigation.state.params.latitude
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            markers: [{
                number: this.props.navigation.state.params.number,
                longitude: this.props.navigation.state.params.longitude,
                latitude: this.props.navigation.state.params.latitude
            },],
            searchText: 'AED',
        };
        let transfer_json_to_form = (params) => { return qs.stringify(params) };
        let text={"number":this.state.number,"latitude":this.state.latitude,"longitude":this.state.longitude,
            "sos":this.state.sos,"state":this.state.state};
        let data=transfer_json_to_form(text);
        setInterval(()=>{
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
                    for(let i = 0;i<this.state.markers.length-1;i++){
                        this.state.markers.pop();
                    }
                    for(let i=0;i<res.results.length;i++){
                        this.setState({
                            markers: [...this.state.markers,{
                                number: res.results[i].number,
                                latitude: res.results[i].location.lat,
                                longitude: res.results[i].location.lng,}],
                        });
                    }
                })
                .catch((err)=>console.error(err));
        },1000*30);

        this.handleSearch=this.handleSearch.bind(this);
        this.onChangeCode=this.onChangeCode.bind(this);
    }

    onChangeCode(event){
        this.setState({searchText: event.nativeEvent.text});
    }

    handleSearch(event){
        event.preventDefault();
        fetch('http://api.map.baidu.com/place/v2/search?query='+this.state.searchText
            +'&location='+this.state.center.latitude+','+this.state.center.longitude
            +'&radius=2000&output=json&ak=R2GE2Dos0neHI4eEb8PwQeRGyGN7MWL7')
            .then((res) => res.json())
            .then((res) => {
                if(res.status === 0){
                    for(let i=0;i<res.results.length;i++){
                        this.setState({
                            markers: [...this.state.markers,{
                                    latitude: res.results[i].location.lat,
                                    longitude: res.results[i].location.lng,}],
                        });
                    }
                }
                else if(res.status === 2)
                    alert('数据请求格式不正确');
            })
            .catch((err)=>console.error(err));
    }

    render() {
        return (
            <View style={styles.container_C}>
                <View style={styles.header}>
                    <Icon.Button style={styles.icon} name="angle-left" backgroundColor="rgb(247,92,47)"
                                 size={30} onPress={() => this.props.navigation.goBack()}/>
                </View>
                    <MapView
                        trafficEnabled={this.state.trafficEnabled}
                        baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                        zoom={this.state.zoom}
                        mapType={this.state.mapType}
                        center={this.state.center}
                        marker={this.state.marker}
                        markers={this.state.markers}
                        style={{flex:0.4}}
                        onMarkerClick={(e) => {
                            console.warn(JSON.stringify(e));
                        }}
                        onMapClick={(e) => {}}/>

                <View style={{flex: 0.05,flexDirection: 'column'}}>
                    <View style={{flex: 0.1,flexDirection: 'row',justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => {this.handleSearch.bind(this)}}
                        style={{width: 80 ,height: 20,justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={styles.btnText_M}>
                                搜索AED
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{flex: 0.08}}>
                    <RescuerListExample/>
                </View>

            </View>
        );
    }
}

const RescuerListExample = createForm()(RescuerList);

export default AskForHelp;