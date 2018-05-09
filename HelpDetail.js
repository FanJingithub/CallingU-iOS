import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Button,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';
import { Card, WingBlank, WhiteSpace, List } from 'antd-mobile';
import storage from '/Users/Aliez/WebstormProjects/CallingU/src/Util/Param.js';
import qs from 'qs';
import style from "./Style";

const styles = style;

class HelpDetail extends React.Component{
    static navigationOption = {
        title: '求救界面',
        header: null,
    };

    _flatList;

    _renderItem = (item) => {
        let phoneNumber = item.item.number;
        return (
            <WingBlank size="lg">
                <WhiteSpace size="lg"/>
                <Card>
                    <Card.Header
                        title="救助者: "
                        extra={<View>this is extra</View>}
                    />
                    <Card.Body style={{paddingLeft: 10}}>
                        <Text>联系电话: {phoneNumber}</Text>
                    </Card.Body>
                    <Card.Footer content="footer content" extra={<Text>extra footer content</Text>}/>
                </Card>
                <WhiteSpace size="lg"/>
            </WingBlank>
        )
    };

    _header = () => {
        if(this.state.rescuer.length < 1) {
            return (
                <View>
                    <View style={{height: 2, backgroundColor: '#6A8372'}}/>
                    <WingBlank size="lg">
                        <WhiteSpace size="lg"/>
                        <Card>
                            <Card.Header
                                title="呼救者: "
                                extra={<View>this is extra</View>}
                            />
                            <Card.Body style={{paddingLeft: 10}}>
                                <Text>联系电话: {phoneNumber}</Text>
                            </Card.Body>
                            <Card.Footer content="footer content" extra={<Text>extra footer content</Text>}/>
                        </Card>
                        <WhiteSpace size="lg"/>
                    </WingBlank>
                </View>
            );
        }
        else {
            return <View style={{height: 2, backgroundColor: '#6A8372'}}/>;
        }
    };

    //以下部分逻辑未定/暂未修改
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            navigation: this.props.navigation,
            mayType: MapTypes.NORMAL,
            zoom: 15,
            center: {
                number: this.props.navigation.state.params.number,
                longitude: this.props.navigation.state.params.longitude,
                latitude: this.props.navigation.state.params.latitude,
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            markers: [
                {
                    number: this.props.navigation.state.params.number,
                    longitude: this.props.navigation.state.params.longitude,
                    latitude: this.props.navigation.state.params.latitude,
                    title: 'Your location'
                },],
            searchText: 'AED',
            setCookie: null,
            rescuer: this.props.navigation.state.params.rescuer,
        };
        let transfer_json_to_form = (params) => {
            return qs.stringify(params)
        };
        let text = {
            "number": this.state.number, "latitude": this.state.latitude, "longitude": this.state.longitude,
            "target": this.state.target, "state": this.state.state,
        };
        let data = transfer_json_to_form(text);

        this.timer = setInterval(() => {
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
                            // for(let i = 0;i<this.state.markers.length-1;i++){
                            //     this.state.markers.pop();
                            // }
                            // for(let i=0;i<res.length;i++){
                            //     this.setState({
                            //         markers: [...this.state.markers,{
                            //             number: res.number,
                            //             latitude: res.location,
                            //             longitude: res.location,}],
                            //     });
                            // }
                        });
                    else if (res.status === 203)
                        return Promise.reject("未知错误");
                    else if (res.status === 400)
                        return Promise.reject("请求失败");
                    else if (res.status === 500)
                        return Promise.reject("服务器错误");
                })
                .catch((err) => console.error(err));
        }, 1000);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }

    componentWillMount() {
        storage.load({key: 'number'})
            .then((res) => {
                this.state.target = res;
                this.state.number = res;
            })
            .catch((error) => {
                alert(error);
            });
        storage.load({key: 'SetCookie'})
            .then((res) => {
                this.state.setCookie = res;
            })
            .catch((error) => {
                alert(error);
            });
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    handleSearch(event) {
        event.preventDefault();
        fetch('http://api.map.baidu.com/place/v2/search?query=AED&location=' + this.state.center.latitude.toLocaleString() +
            ',' + this.state.center.longitude.toLocaleString() + '&radius=2000&output=json&ak=R2GE2Dos0neHI4eEb8PwQeRGyGN7MWL7')
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 0) {
                    for (let i = 0; i < res.results.length; i++) {
                        this.setState({
                            markers: [...this.state.markers, {
                                latitude: res.results[i].location.lat,
                                longitude: res.results[i].location.lng,
                                title: 'AED'
                            }],
                        });
                    }
                }
                else if (res.status === 2)
                    alert('数据请求格式不正确');
                else if (res.status === 3)
                    alert('权限校验失败');
                else if (res.status === 4)
                    alert('配额校验失败');
                else if (res.status === 5)
                    alert('ak不存在或者非法');
            })
            .catch((err) => console.error(err));
    }

    handleClear(event){
        event.preventDefault();
        for (let i = 0; i < this.state.markers.length - 1; i++) {
            if (this.state.markers[i].title === 'AED')
                this.state.markers.pop();
        }
    }

    handleFinish(event){
        event.preventDefault();
        storage.save({key: 'help',data: 0});
        storage.save({key: 'sos', data: -1});
        storage.save({key: 'state', data: -1});
        let transfer_json_to_form = (params) => {
            return qs.stringify(params)
        };
        let text1 = {
            "number": this.state.number, "target": this.state.number,
            "phonestate": 0, "state": -1,
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
        this.props.navigation.goBack();
    }

    render() {
        let data = this.state.rescuer;
        // for (let i = 0; i < 10; i++)
        //     data.push({key: i, number: 1001});
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
                    style={{flex: 0.4}}
                    onMarkerClick={(e) => {
                        console.warn(JSON.stringify(e));
                    }}
                    onMapClick={(e) => {
                    }}/>
                <View style={{flex:0.01}}/>

                <View style={{flex: 0.05, flexDirection: 'column'}}>
                    <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={this.handleSearch.bind(this)}
                                          style={{
                                              width: 80,
                                              height: 20,
                                              justifyContent: 'center',
                                              alignItems: 'center'
                                          }}>
                            <Text style={styles.btnText_M}>
                                搜索AED
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleClear.bind(this)}
                                          style={{
                                              width: 80,
                                              height: 20,
                                              justifyContent: 'center',
                                              alignItems: 'center'
                                          }}>
                            <Text style={styles.btnText_M}>
                                清除搜索
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{flex: 0.4}}>
                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this._header}
                        keyExtractor={(item, index) => index.toString()}
                        data={data}>
                    </FlatList>
                </View>

                <View style={{flex: 0.03, flexDirection: 'column'}}>
                    <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={this.handleFinish.bind(this)}
                                          style={{
                                              width: 80,
                                              height: 20,
                                              justifyContent: 'center',
                                              alignItems: 'center'
                                          }}>
                            <Text style={styles.btnText_M}>
                                结束求救
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
}

export default HelpDetail;