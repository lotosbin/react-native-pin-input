/**
 * @flow
 * */
import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import Immutable from 'immutable';
type P ={
    keyboardType?: string,
    placeHolder?: string,
}
type S={

}
export default class PinInput extends Component<void,P,S> {
    pinItemStyle: any;
    onPinCompleted: Function;
    pinItemProps: {};

    constructor(props) {
        super(props);
        this.pinLength = this.props.pinLength || 4;
        this.state = {
            pins: Array.from((this.props.placeHolder || '_').repeat(this.pinLength))
        };
        this.pinInputItems = new Array(this.pinLength);
    }

    setPin(pin: string) {
        if (pin) {
            if (pin.length !== this.pinLength) {
                throw new Error(`pin length is not equal ${this.pinLength}`)
            }
            this.setState({pins: Array.from(pin)});
            this.focusPin(this.pinLength - 1)
        }
    }

    getPin(): string {
        return this.state.pins.join('');
    }

    clearPin() {
        let pins = Array.from((this.props.placeHolder || '_').repeat(this.pinLength));
        this.setState({pins: Immutable.List(pins).set(0, '').toArray()});
        this.focusPin(0)
    }
    onPinItemChanged(i, t) {
        this.setState({pins: Immutable.List(this.state.pins).set(i, t).toArray()}, () => {
            if (i + 1 < this.pinLength) {
                this.focusPin(i + 1);
            } else {
                //end
                if (this.props.onPinCompleted) this.props.onPinCompleted(this.state.pins.join(''));
            }
        })
    }

    focusPin(i) {
        this.refs[`pin_${(i)}`].focus();
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
                                autoFocus={i === 0}
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
                                keyboardType={(this.props.pinItemProps||{}).keyboardType || 'default'}
                                clearTextOnFocus={true}
                                maxLength={1}
                                onChangeText={(t) => {
                                    this.onPinItemChanged.call(this, i, t);
                                }}
                                value={this.state.pins[i]}/>
                        )
                    })
                }
            </View>
        )

    }
}