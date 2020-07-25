import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EventCards from '../components/EventCards'
import PageTitle from '../components/PageTitle'
import Hr from '../components/Hr'

const propTypes = {
  tag: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
}

export default class TagRelatedEvent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {tag, events, totalCount} = this.props
    console.log("=======EVENTS=======", events)
    return (
      <>
        <div className="white--background border-top">
          <PageTitle eventCount={totalCount} title={tag.name} />
          <Hr />
          {events && <EventCards events={events} />}
        </div>
      </>
    )
  }
}

TagRelatedEvent.propTypes = propTypes