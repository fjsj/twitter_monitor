import React from 'react';
import { connect } from 'react-redux';

import { fetchUsers } from '../actions';
import TitleRow from '../components/title_row';
import UsersTable from '../components/users_table';
import UserForm from '../containers/user_form_container';


class UsersContainer extends React.Component {

  componentDidMount() {
    this.props.fetchUsers();
    this.formHandler = this.formHandler.bind(this);
  }

  formHandler() {
    this.props.fetchUsers()
      .then(
        (response) => {
          this.setState({ users: response.payload.data });
        }
      );
  }

  render() {
    return (
      <div>
        <TitleRow title="Users" btn_id="back_btn" btn_class="default" btn_text="Back" url="/" />
        <UserForm  handler={this.formHandler}/>
        <UsersTable users={this.props.users} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

export default connect(mapStateToProps, { fetchUsers })(UsersContainer);
