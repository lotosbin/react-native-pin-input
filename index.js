import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import Immutable from 'immutable';

export default class PinInput extends Component {
    pinItemStyle: any;
    onPinCompleted: Function;

    constructor(props) {
        super(props);
        this.pinLength = this.props.pinLength || 4;
        this.state = {
            pins: Array.from('_'.repeat(this.pinLength))
        };
        this.pinInputItems = new Array(this.pinLength);
    }

    onPinItemChanged(i, t) {
        this.setState({pins: Immutable.List(this.state.pins).set(i, t).toArray()}, () => {
            if (i + 1 < this.pinLength) {
                this.refs[`pin_${i + 1}`].focus();
            } else {
                //end
                if (this.props.onPinCompleted) this.props.onPinCompleted(this.state.pins.join(''));
            }
        })
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