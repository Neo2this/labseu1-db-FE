import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

/*
Company profile settings

- [ ]  Company name
- [ ]  Company description
- [ ]  Logo
- [ ]  User list
- [ ]  Admin list
- [ ]  If each employee is admin or not
- [ ]  Subscription type
*/

class CompanyProfileEndpoint extends Component {
  render() {
    return (
      <div>
        <div>
          <input type="text" value={this.state.ITEM_NAME} onChange={e => this.setState({ ITEM_NAME: e.target.value })} />
          <button
            onClick={e => {
              e.preventDefault();
              this.ADD_ITEM();
            }}>
            Add Item
          </button>
        </div>
        <h2>These are the companies</h2>
        {this.props.ARRAY_OF_ITEMS_FROM_DATABASE.map(ITEM => {
          return <div key={ITEM.ID}>{ITEM}</div>;
        })}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ARRAY_OF_ITEMS_FROM_DATABASE: state.firestore.ordered.COLLECTION ? state.firestore.ordered.COLLECTION.map(c => c.COLLECTION_ITEM) : []
  };
};

//We are not dispatching anything => mapDispatchToProps is empty
const mapDispatchToProps = {};

//Connect to Firestore
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [
      {
        collection: 'COLLECTION'
      }
    ];
  })
)(CompanyProfileEndpoint);
