import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.id]: event.target.value.trim()
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const input = {};
    Object.keys(this.props.fields).forEach(key => input[key] = (this.state[key] || ''));
    this.props.onSubmit(input);
  }

  render() {
    const fields = this.props.fields;
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
        {Object.keys(fields).map(key => {
          return (
            <FormGroup key={key} controlId={key} bsSize="large">
              <ControlLabel>{fields[key].label}</ControlLabel>
              <FormControl type={fields[key].type} value={this.state[key] || ''} onChange={this.handleChange.bind(this)} />
            </FormGroup>
          );
        })}
          <Button block bsSize="large" type="submit">
            {this.props.submitButtonText}
          </Button>
        </form>
      </div>
    );
  }
}
import PropTypes from 'prop-types';
Form.propTypes = {
  submitButtonText: PropTypes.string.isRequired,
  fields: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string.isRequired).isRequired).isRequired,
  onSubmit: PropTypes.func.isRequired
};
