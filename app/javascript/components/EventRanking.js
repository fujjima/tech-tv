import React from "react"
import EventCards from '../components/EventCards'
import PageTitle from '../components/PageTitle'
import MoreReadButton from '../components/MoreReadButton'
import { Nav } from "react-bootstrap"
import axios from 'axios'
const REQUEST_API_BASE_URL = "/api/v1/events/"

export default class EventRanking extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState
    this.fetchEvents = this.fetchEvents.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  get initialState() {
    return {
      events: [],
      range: 'recent',
      totalEventsCount: 0,
      page: 1,
      hasMore: false,
      isLoading: false
    }
  }

  componentDidMount = () => {
    this.fetchEvents()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.range !== prevState.range) {
      this.fetchEvents()
    }
  }

  resetState = () => {
    this.setState(this.initialState)
  }

  resetStateExceptRange = () => {
    this.setState({events: []})
    this.setState({page: 1})
    this.setState({hasMore: false})
    this.setState({isLoading: false})
  }

  handleSelect = eventKey =>  {
    this.resetStateExceptRange()
    this.setState({range: eventKey})
  }

  async fetchEvents() {
    this.setState({isLoading: true})
    const { events, page, range } = this.state
    const api = `${REQUEST_API_BASE_URL}?range=${range}&page=${page}`
    const apiResponse = await axios.get(api).catch(null)

    if(!apiResponse || !apiResponse.data || apiResponse.data.status === 500) {
      this.setState({hasMore: false})
      this.setState({isLoading: false})
      return true
    }

    const eventData = apiResponse.data
    const insertEvents = events.concat(eventData.events)

    this.setState({events: insertEvents})
    this.setState({totalEventsCount: eventData.total_count})

    this.updatePageAndHasMore()
    this.setState({isLoading: false})
  }

  updatePageAndHasMore = () => {
    const { events, totalEventsCount, page } = this.state
    if(totalEventsCount > events.length){
      const nextPage = page + 1
      this.setState({hasMore: true})
      this.setState({page: nextPage})
    } else {
      this.setState({hasMore: false})
    }
  }

  render() {
    const { events, isLoading, hasMore, range, totalEventsCount } = this.state
    return (
      <React.Fragment>
        <PageTitle eventCount={totalEventsCount} title="人気ランキング" />
        <Nav fill variant="tabs" defaultActiveKey={range} onSelect={this.handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey="recent">最近</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="monthly">月</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="all">すべて</Nav.Link>
          </Nav.Item>
        </Nav>
        {events && <EventCards events={events} />}
        <MoreReadButton isLoading={isLoading} hasMore={hasMore} fetch={this.fetchEvents} />
      </React.Fragment>
    );
  }
}
