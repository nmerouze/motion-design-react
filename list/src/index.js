import React, {Component} from 'react'
import {render} from 'react-dom'
import TransitionGroup from 'react-addons-transition-group'

const enterAnimation = duration => ({
  animationDuration: `${duration}ms`,
  animationName: 'add-item',
  animationTimingFunction: 'ease-in-out'
})

const leaveAnimation = duration => ({
  background: '#bf4a3c',
  animationDuration: `${duration + 20}ms`,
  animationName: 'remove-item',
  animationTimingFunction: 'ease-in-out'
})

const moveAnimation = (duration, delay) => ({
  animationDelay: `${delay}ms`,
  animationDuration: `${duration + 20}ms`,
  animationName: 'move-item',
  animationTimingFunction: 'ease-in-out'
})

class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {isEntering: false, isLeaving: false, isHidden: false}
  }

  componentWillEnter(callback) {
    setTimeout(() => {
      this.setState({isEntering: false})
      callback()
    }, this.props.enterDuration)

    this.setState({isEntering: true})
  }

  componentWillLeave(callback) {
    setTimeout(() => {
      this.setState({isHidden: true})
    }, this.props.leaveDuration)

    setTimeout(() => {
      this.props.didLeave()
      callback()
    }, this.props.removeItemDuration)

    this.setState({isLeaving: true})
  }

  render() {
    let style = {}
    if (this.state.isEntering) style = enterAnimation(this.props.enterDuration)
    if (this.state.isLeaving) style = leaveAnimation(this.props.leaveDuration)
    if (this.props.isMoving) style = moveAnimation(this.props.moveDuration, this.props.moveDelay)
    if (this.state.isHidden) style.visibility = 'hidden'

    return <div className="list__item" style={style} onClick={this.props.onClick}/>
  }
}

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {movingItems: []}
  }

  removeItem(idx) {
    const movingItems = this.props.items.slice(idx + 1)
    this.props.onRemoveItem(idx)
    this.setState({movingItems: movingItems})
  }

  resetMovingItems() {
    this.setState({movingItems: []})
  }

  render() {
    const listItems = this.props.items.map((item, idx) => {
      let removeItemDuration = 700
      let isMoving = false
      let moveDelay = 500
      const movingIdx = this.state.movingItems.indexOf(item)

      if (movingIdx >= 0) {
        isMoving = true
        moveDelay = moveDelay + 50 * movingIdx
        removeItemDuration = removeItemDuration + (50 * (this.state.movingItems.length - 1))
      }

      return <ListItem
        key={item}
        isMoving={isMoving}
        enterDuration={500}
        leaveDuration={500}
        moveDuration={200}
        moveDelay={moveDelay}
        removeItemDuration={removeItemDuration}
        onClick={this.removeItem.bind(this, idx)}
        didLeave={this.resetMovingItems.bind(this)}/>
    })

    return (
      <TransitionGroup component="div" className="list">
        {listItems}
      </TransitionGroup>
    )
  }
}

const Button = ({onClick}) =>
  <button className="btn" onClick={onClick}>Add item</button>

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {items: [1, 2, 3, 4], nextItem: 5}
  }

  addItem() {
    const newItem = this.state.nextItem
    const newItems = this.state.items.concat([newItem])
    this.setState({items: newItems, nextItem: newItem + 1})
  }

  removeItem(idx) {
    this.state.items.splice(idx, 1)
    this.setState({items: this.state.items})
  }

  render() {
    return (
      <div>
        <List items={this.state.items} onRemoveItem={this.removeItem.bind(this)}/>
        <Button onClick={this.addItem.bind(this)}/>
      </div>
    )
  }
}

render(
  <App/>,
  document.getElementById('root')
)
