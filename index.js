import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
export default class PinInput extends Component {
    pinItemStyle: any;

    render() {
        return (
            <View style={{
                width: 10,
                height: 10,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'gray',
                margin: 5,
                justifyContent: 'center',
                alignItems: 'center',
                ...this.props.pinItemStyle
            }}>
                <TextInput/>
            </View>
        );
    }
}