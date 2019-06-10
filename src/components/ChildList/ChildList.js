import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapReduxStateToProps from '../../modules/maxReduxStateToProps';
import './ChildList.css';
import ReactDropdown from 'react-dropdown';
import './Dropdown.css';

const options = [
    'Yes',
    'No',
];

class ChildList extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'GET_CHILD_LIST'});
  }

    state = {
        newChild: {
            name: '',
            number: ''
        },
        newApproved: {
            name: '',
            number: '',
            childId: null
        },
        selectedChild: null,
        selectedApproved: null,
        phoneNumbers: '',
        nonApprovedNumbers: '',
        reviewed: false
    }

    changeReviewed = config => dropdownObj => {
        console.log('reviewed changed- dropdownObj:', dropdownObj);
        this.props.dispatch({type: 'UPDATE_REVIEWED', payload: {
                id: config.nonId,
                childId: config.childId,
                reviewed: dropdownObj === 'Yes' ? true : false,
            }
        });
        this.setState({
            reviewed: ''
        });    
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
        this.props.dispatch({ type: 'ADD_NEW_CHILD', payload: this.state.newChild })
        this.setState({
            newChild: {
                name: '',
                number: '',
            }
        });
    }

    selectChild = (value) => event => {
        if(!this.state.selectedChild){
            // HERE WE WOULD WANT TO GET THE CURRENT CHILD PHONE NUMBERS.
            // YOU WILL NEED TO DISPATCH HERE TO GET THE LIST OF NUMBERS (APPROVED OR NOT)
            console.log('Child database id: ' , event.target.dataset.id);
            this.props.dispatch({type: 'GET_APPROVED', payload: { id: event.target.dataset.id }});
            this.props.dispatch({type: 'GET_NON_APPROVED', payload: { id: event.target.dataset.id }});
            this.setState({
                selectedChild: value,
                newApproved: {
                    ...this.state.newApproved,
                    childId: event.target.dataset.id
                }
            });
        } else {
            this.setState({
                selectedChild: null
            });
        }
    }

    onFormChange = (dataname) => event => {
        this.setState({
            newApproved: {
                ...this.state.newApproved,
                [dataname] : event.target.value
            }
        });
    }

    addNewApproved = event => {
        event.preventDefault();
        this.props.dispatch({ type: 'ADD_APPROVED', payload: this.state.newApproved })
        this.setState({
            newApproved: {
                name: '',
                number: '',
            }
        });
    }

    render() {
        const listArray = this.props.reduxState.childListReducer.map((item, index) => {
            return (
                <button key={index} data-id={item.child_id} onClick={this.selectChild('name')}>
                    {item.name}
                </button>
            )
        })

        const addNumberField = (
            <div>
                <form className="addField" onSubmit={this.addNewApproved}>
                    <p className="formHeader">Add New Approved</p>
                    <br /><input type="text" onChange={this.onFormChange('name')} placeholder="Name" />
                    <input type="text" onChange={this.onFormChange('number')} placeholder="Number" />
                    <input type="submit" value="Add"/>
                </form>
            </div>
        )

        let childView = <div></div>;

        const phoneNumbers = this.props.reduxState.phoneNumbersReducer.map((item, index) => {
            console.log(item);
            return (
                <div className="table-scroll">
                <table className="tableStyle">
                    <thead>
                        <tr>
                            <th>Approved Numbers</th>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.number}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            )
        })

        const nonApprovedNumbers = this.props.reduxState.nonApprovedReducer.map((non, index) => {
            console.log(non);
            return (
                <table className="tableStyle">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Time</th>
                            <th>Reviewed?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{non.number}</td>
                            <td>{non.time}</td>
                            <td>
                                <ReactDropdown
                                    options={options}
                                    onChange={this.changeReviewed({ nonId: non.non_approved_id, childId: non.child_id })}
                                    value={non.reviewed ? 'Yes' : 'No'}
                                    placeholder="No"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        })

        if(this.state.selectedChild) {
            childView = (
                <div className="childView">
                    {phoneNumbers}
                    {nonApprovedNumbers}
                    {addNumberField}
                </div>
            )
        }


        return (
            <div className="page">
                <h2>Children:</h2>
                {listArray}
                {childView}
                <form className="addField" onSubmit={this.addNewChild}>
                <p className="formHeader">Add New Child</p>
                    <br /><input type='text' value={this.state.newChild.name}
                                        onChange={this.handleChange('name')}
                                        placeholder="Name"/>
                    <input type='text' value={this.state.newChild.number}
                                        onChange={this.handleChange('number')}
                                        placeholder="Phone Number"/>
                    <input type='submit' value='Add' />
                </form>
            </div>
        );
    }
}


export default connect(mapReduxStateToProps)(ChildList);