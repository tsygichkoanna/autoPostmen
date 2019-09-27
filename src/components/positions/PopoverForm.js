import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextFieldGroup from '../common/TextFieldGroup'
import { Button, Overlay } from 'react-bootstrap'
import { validateJobForm } from '../../validations/positions'
import { delPos, getAllPositions } from '../../actions/positions.action'

function AddItemPopover ({ errors, name, code, handleClose, handleOnChange, handleOnSubmit }) {
  return (
    <div className="popover_wrap_add">
      <div className="close-popover"><i onClick={handleClose} className="fa fa-times" aria-hidden="true"/></div>

      <form>
        <TextFieldGroup
          field="name"
          label="Назва"
          value={name}
          error={errors}
          onChange={handleOnChange}
        />
        <TextFieldGroup
          field="code"
          label="Код"
          value={code}
          onChange={handleOnChange}
        />
        <Button type="submit" onClick={(event) => {
          event.preventDefault()
          handleClose()
          return handleOnSubmit({ name, code })
        }} bsClass="btn btn-primary">Додати</Button>
      </form>
    </div>
  )
}

export const DeleteItemPopover = ({handleClose, handleDeleteItem}) => (
  <div className="popover_wrap">
    <Button type="submit" bsClass="btn btn-danger" onClick={(event) => {
      handleClose()
      handleDeleteItem(event)
    }}>Видалити</Button>
  </div>
)

class PopoverForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      errors: '',
      name: '',
      code: '',
    }

  }

  // methods
  toggle = () => {
    this.setState({ show: !this.state.show })
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  isValid = () => {
    const { errors, isValid } = validateJobForm(this.state.name)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid
  }

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleOnSubmit = (e) => {
    e.preventDefault()
    if (this.isValid()) {
      this.setState({ errors: '' })
      let data = [{ 'name': this.state.name, 'code': this.state.code }]
      // this.props.addJob(data)
      this.setState({ name: '', code: '' })
      this.handleClose()
    }
  }

  handleDeleteProj = (e) => {
    e.preventDefault()
    if (this.props.data_id) {
      this.props.delJob(this.props.data_name)
      this.handleClose()
    } else {
      this.props.delJob(this.props.data_name)
      this.handleClose()
    }
  }

  handleDeletePos = (e) => {
    e.preventDefault()
    this.props.delPos(this.props.data_id).then(
      (res) => {
        this.props.getAllPositions(this.props.setLoading)
        this.handleClose()
      },
      // TODO: (err) =>  err handle
    )
  }

  // ..methods

  checkType = (type, state) => {
    let Content
    let Trigger
    switch (type) {
      case 'addWork':
        Trigger =
          <a className="btn btn-primary btn-add" onClick={this.toggle}>
            Додати
          </a>
        Content =
          <AddItemPopover
            handleOnChange={this.handleOnChange}
            handleOnSubmit={this.props.onAddWork}
            handleClose={this.handleClose}
            {...state}
          />
        break
      case 'delJob':
        Trigger =
          <a className="btn btn-primary btn-delete" onClick={this.toggle}>
            <i className="fa fa-trash" aria-hidden="true"/>
          </a>
        Content =
          <DeleteItemPopover
            handleDeleteItem={this.props.onDeleteWork}
            handleClose={this.handleClose}
          />
        break
      case 'delPos':
        Trigger =
          <a className="btn btn-primary btn-delete" onClick={this.toggle}>
            <i className="fa fa-trash" aria-hidden="true"/>
          </a>
        Content =
          <DeleteItemPopover
            handleDeleteItem={this.handleDeletePos}
            handleClose={this.handleClose}
          />
        break
      default:

    }
    return { Content, Trigger }
  }

  render () {

    const { Trigger, Content } = this.checkType(this.props.type, this.state)

    return (
      <div style={{ position: 'relative' }}>

        {Trigger}

        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="top"
          container={this}
          rootClose={true}
        >
          {Content}

        </Overlay>
      </div>
    )
  }
}

export default connect(
  state => ({
    jobs: state.position.jobs
  }),
  { delPos, getAllPositions })(PopoverForm)
