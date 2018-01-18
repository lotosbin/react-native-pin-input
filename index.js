/**
 * @flow
 * */
import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Immutable from 'immutable';
type P ={
    keyboardType?: string,
    placeholder?: string,
    autoFocus: boolean,
    value?: string,
    onPinCompleted: (string) => void,
    onPinEntered: (string) => void,
    onPinKeyPress: ({}, number) => void,
    onPinsCompleted: (Array<string>) => void,
}
type S={

}
export default class PinInput extends Component<void,P,S> {
    pinItemStyle: any;
    onPinCompleted: Function;
    onPinEntered: Function;
    pinItemProps: {};

    constructor(props) {
        super(props);
        this.props.autoFocus = props.autoFocus || true;
        this.props.placeholder = props.placeholder || props.placeHolder || '_';
        this.pinLength = this.props.pinLength || 4;
        this.state = {
            pins: Array(this.pinLength).fill(null)
        };
        let value = this.props.value;
        if (value) {
            if (value.length !== this.pinLength) {
                throw new Error(`pin length is not equal ${this.pinLength}`)
            }
            this.state.pins = Array.from(value)
        }
        this.pinInputItems = new Array(this.pinLength);
    }

    componentWillReceiveProps(props) {
        this.props.autoFocus = props.autoFocus || true;
    }

    /**
     * @deprecated use setPins
     * */
    setPin(pin: string) {
        if (pin) {
            if (pin.length !== this.pinLength) {
                throw new Error(`pin length is not equal ${this.pinLength}`)
            }
            let p = (this.props.placeholder || ' ');
            this.setState({pins: Array.from(pin).map(v => v && v !== p ? v : null)});
            if (this.props.autoFocus) {
                this.focusPin(this.pinLength - 1)
            }
        }
    }

    setPins(pins: Array<string>) {
        pins = pins || Array(this.pinLength).fill(null);
        if (pins.length !== this.pinLength) {
            throw new Error(`pin length is not equal ${this.pinLength}`)
        }
        this.setState({pins: pins});
        if (this.props.autoFocus) {
            this.focusPin(this.pinLength - 1)
        }
    }

    /**
     * @deprecated use getPins
     * */
    getPin(): string {
        let pinText = this.state.pins.map(v => {
            let p = this.props.placeholder || ' ';
            return v && v !== p ? v : p;
        }).join('');
        return pinText;
    }

    getPins(): Array<string> {
        return this.state.pins;
    }
    clearPin() {
        for (let i = 0; i < this.pinLength; i++) {
            this.blurPin(i)
        }
        let pins = Array(this.pinLength).fill(null);
        this.setState({pins: Immutable.List(pins).toArray()});
        if (this.props.autoFocus) {
            this.setState({pins: Immutable.List(pins).set(0, null).toArray()});
            this.focusPin(0)
        }
    }

    async onPinItemChanged(i, t) {
        let pins = Immutable.List(this.state.pins).set(i, t).toArray();
        await this.setStateAsync({pins: pins});
        if (!t) {
            return
        }
        let pinText = this.state.pins.map(v => {
            let p = this.props.placeholder || ' ';
            return v && v !== p ? v : p;
        }).join('');
        if (this.props.onPinEntered) {
            this.props.onPinEntered(pinText);
        }
        if (this.isCompleted()) {
            if (this.props.onPinCompleted) {
                this.props.onPinCompleted(pinText);
            }
            if (this.props.onPinsCompleted) {
                this.props.onPinsCompleted(this.state.pins)
            }
            return
        }
        if (i + 1 < this.pinLength) {
            this.focusPin(i + 1);
        }
    }

    isCompleted() {
        return this.state.pins.filter(e => !e).length === 0;
    }

    focusPin(i) {
        this.refs[`pin_${(i)}`].focus();
    }

    blurPin(i) {
        this.refs[`pin_${i}`].blur();
    }


    render() {
        return (
            <View style={StyleSheet.flatten([styles.container, this.props.style])}>
                {
                    this.state.pins.map((v, i) => {
                        return (
                            <TextInput
                                key={"pin_" + i}
                                ref={`pin_${i}`}
                                autoFocus={this.props.autoFocus && i === 0}
                                style={StyleSheet.flatten([styles.pinItem, this.props.pinItemStyle])}
                                placeholder={this.props.placeholder || '_'}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={(this.props.pinItemProps||{}).keyboardType || 'default'}
                                returnKeyType={(this.props.pinItemProps || {}).returnKeyType || 'default'}
                                secureTextEntry={(v && (this.props.pinItemProps || {}).secureTextEntry ) || false}
                                underlineColorAndroid={(this.props.pinItemProps || {}).underlineColorAndroid || undefined}
                                maxLength={1}
                                onFocus={async (e) => await this.onPinFocus(i)}
                                onChangeText={async (t) => {
                                    await this.onPinItemChanged(i, t);
                                }}
                                onKeyPress={(e) => this.onPinKeyPress(e, i)}
                                value={this.state.pins[i]}/>
                        )
                    })
                }
            </View>
        )

    }

    async onPinFocus(i) {
        await this.setStateAsync({pins: Immutable.List(this.state.pins).set(i, null).toArray()})
    }

    onPinKeyPress(e, i) {
        let key = e.nativeEvent.key;
        if (key === 'Backspace') {
                this.focusPin(Math.max(i - 1, 0))
        }
        if (this.props.onPinKeyPress) {
            this.props.onPinKeyPress(e, i);
        }
    }

    async setStateAsync(partialState) {
        return await new Promise(resolve => this.setState(partialState, () => resolve()))
    }
}
const styles = StyleSheet.create({
    container: {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'},
    pinItem: {
        padding: 2,
        margin: 2,
        borderColor: 'gray',
        borderWidth: 1,
        width: 30,
        height: 30,
        textAlign: 'center',
    }
});
