import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapReduxStateToProps from '../../modules/maxReduxStateToProps';

class ChildList extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'GET_CHILD_LIST'});
  }

    state = {
        newChild: {
            name: '',
            number: ''
        }
    }

    handleChange = (dataname) => event => {
        this.setState({
            newChild: {
                ...this.state.newChild,
                [dataname] : event.target.value
            }
        });
    }

    addNewChild = event => {
        event.preventDefault();
        console.log('meow');
        this.props.dispatch({ type: 'ADD_NEW_CHILD', payload: this.state.newChild })
        this.setState({
            newChild: {
                name: '',
                number: '',
            }
        });
    }

    clickName = (event) => {
        this.props.history.push('/approved');
}


    render() {
        const listArray = this.props.reduxState.childListReducer.map((item, index) => {
            return (
                <button key={index} data-id={item.id} onClick={this.clickName}>
                    {item.name}
                </button>
            )
        })

        return (
            <div>
                <h2>Children:</h2>
                {listArray}
                <h5>Add New Child</h5>
                <form onSubmit={this.addNewChild}>
                    <input type='text' value={this.state.newChild.name} onChange={this.handleChange('name')} placeholder="Name"/>
                    <input type='text' value={this.state.newChild.number} onChange={this.handleChange('number')} placeholder="Phone Number"/>
                    <input type='submit' value='Add New Child' />
                </form>
            </div>
        );
    }
}


export default connect(mapReduxStateToProps)(ChildList);