/**
 * @flow
 * */
import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import Immutable from 'immutable';
type P ={
    keyboardType?: string,
    placeHolder?: string,
    autoFocus: boolean,
    value?: string,
}
type S={

}
export default class PinInput extends Component<void,P,S> {
    pinItemStyle: any;
    onPinCompleted: Function;
    pinItemProps: {};

    constructor(props) {
        super(props);
        this.props.autoFocus = props.autoFocus || true;
        this.pinLength = this.props.pinLength || 4;
        this.state = {
            pins: Array.from((this.props.placeHolder || '_').repeat(this.pinLength))
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
    setPin(pin: string) {
        if (pin) {
            if (pin.length !== this.pinLength) {
                throw new Error(`pin length is not equal ${this.pinLength}`)
            }
            this.setState({pins: Array.from(pin)});
            if (this.props.autoFocus) {
                this.focusPin(this.pinLength - 1)
            }
        }
    }

    getPin(): string {
        return this.state.pins.join('');
    }

    clearPin() {
        for (let i = 0; i < this.pinLength; i++) {
            this.blurPin(i)
        }
        let pins = Array.from((this.props.placeHolder || '_').repeat(this.pinLength));
        this.setState({pins: Immutable.List(pins).toArray()});
        if (this.props.autoFocus) {
            this.setState({pins: Immutable.List(pins).set(0, '').toArray()});
            this.focusPin(0)
        }
    }

    async onPinItemChanged(i, t) {
        await this.setState({pins: Immutable.List(this.state.pins).set(i, t).toArray()});
        let placeholder = this.props.placeHolder || '_';
        if (!t || t === placeholder) {
            return
        }
        if (i + 1 < this.pinLength) {
            this.focusPin(i + 1);
        } else {
            //end
            if (this.props.onPinCompleted) this.props.onPinCompleted(this.state.pins.join(''));
        }
    }

    focusPin(i) {
        this.refs[`pin_${(i)}`].focus();
    }

    blurPin(i) {
        this.refs[`pin_${i}`].blur();
    }


    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                {
                    this.state.pins.map((v, i) => {
                        return (
                            <TextInput
                                key={"pin_" + i}
                                ref={`pin_${i}`}
                                autoFocus={this.props.autoFocus && i === 0}
                                style={{
                                    padding: 2,
                                    margin: 2,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    width: 30,
                                    height: 30,
                                    textAlign: 'center',
                                    ...this.props.pinItemStyle
                                }}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={(this.props.pinItemProps||{}).keyboardType || 'default'}
                                returnKeyType={(this.props.pinItemProps || {}).returnKeyType || 'default'}
                                secureTextEntry={(v !== (this.props.placeHolder || '_') && (this.props.pinItemProps || {}).secureTextEntry ) || false}
                                // clearTextOnFocus={true}
                                maxLength={1}
                                onFocus={(e) => this.onPinFocus(i)}
                                onBlur={async (e) => await this.onPinBlur(e, i)}
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

    onPinFocus(i) {
        this.setState({pins: Immutable.List(this.state.pins).set(i, '').toArray()})
    }

    async onPinBlur(e, i) {
        let value = e.nativeEvent.text;
        let placeholder = this.props.placeHolder || '_';
        if (!value && value !== placeholder) {
            await this.setState({pins: Immutable.List(this.state.pins).set(i, placeholder).toArray()})
        }
    }

    onPinKeyPress(e, i) {
        let key = e.nativeEvent.key;
        if (key === 'Backspace') {
            let pin = this.state.pins[i];
            if (pin === '') {
                this.focusPin(Math.max(i - 1, 0))
            }
        }
    }
}