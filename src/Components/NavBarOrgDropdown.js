import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

export class NavBarOrgDropdown extends Component {
  render() {
    let defaultOrg = this.props.orgOptions.filter(o => {
      return o.value === this.props.activeOrg;
    });
    return (
      <span>
        {' '}
        <Dropdown
          inline
          options={this.props.orgOptions}
          defaultValue={this.props.activeOrg}
          // defaultValue={this.props.ArrayOfOrgIdsFromUsers[0]}
          basic={true}
          onChange={this.props.setSelectedOrgToRedux}
        />
        <button onClick={() => console.log(defaultOrg)}>OATS</button>
      </span>
    );
  }
}
