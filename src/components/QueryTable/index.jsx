import React, { useState } from 'react'
import { Box, Span, Text } from '../System'
import styled from 'styled-components'
import './index.css'

const presentPeerId = peerId => peerId.substring(2, 8) + '…'
const presentQueryId = peerId => peerId.substring(0, 6) + '…'

const dateMs = date => new Date(date).getTime()

const msDiff = (date1, date2) => dateMs(date2) - dateMs(date1)

const niceDuration = ms => {
  if (ms < 1000) return ms + 'ms'
  if (ms < 60000) return Math.round(ms / 100) / 10 + 's'
  return Math.floor(ms / 60000) + 'm' + Math.round((ms % 60000) / 1000) + 's'
}

const TableHeader = () => (
  <React.Fragment>
    <Box />
    <Box textAlign='center'>XOR</Box>
    <Box textAlign='center'>Hops</Box>
    <Box />
  </React.Fragment>
)

const QuerySection = props => {
  const [expanded, setExpanded] = useState(true)
  const onQueryClick = () => setExpanded(!expanded)
  const total = msDiff(props.RunnerState.StartTime, props.RunnerState.EndTime)
  return (
    <React.Fragment>
      <QueryRow
        {...props}
        TotalDuration={total}
        onQueryClick={onQueryClick}
        expanded={expanded}
      />
      {expanded &&
        props.PeerQueries.map(peerQuery => {
          const p = {
            ...peerQuery,
            RunnerState: {
              ...props.RunnerState,
              TotalDuration: total
            }
          }
          return <QueryPeerRow key={peerQuery.PeerID} {...p} />
        })}
    </React.Fragment>
  )
}

const QueryRow = ({
  QueryID,
  RunnerState,
  PeerQueries,
  TotalDuration,
  onQueryClick,
  expanded
}) => (
  <React.Fragment>
    <Box
      onClick={onQueryClick}
      className={'query-row ' + (expanded ? 'expanded' : '')}
    >
      <Text whiteSpace='nowrap'>Query {presentQueryId(QueryID)}</Text>
    </Box>
    <Box textAlign='center'>
      <Text>{Math.min(...PeerQueries.map(q => q.XORDistance))}</Text>
    </Box>
    <Box textAlign='center'>
      <Text>{Math.max(...PeerQueries.map(q => q.Hops))}</Text>
    </Box>
    <Box>
      <TimeSpan width='80%' bg='lightgrey' paddingLeft='0.5em'>
        Seen {RunnerState.PeersSeen}, Queried {RunnerState.PeersQueried}, Dialed{' '}
        {RunnerState.PeersDialed}, ToQuery {RunnerState.PeersToQuery}, Remaining{' '}
        {RunnerState.PeersRemaining}
        {RunnerState.Result.Success ? ' - Success' : ''}
      </TimeSpan>
      <Text marginLeft='0.5em'>{niceDuration(TotalDuration)}</Text>
    </Box>
  </React.Fragment>
)

const QueryPeerRow = ({
  RunnerState,
  PeerID,
  XORDistance,
  Hops,
  CloserPeersNew,
  CloserPeersRecv,
  Spans
}) => (
  <React.Fragment>
    <Box>
      <Text whiteSpace='nowrap'>Peer {presentPeerId(PeerID)}</Text>
    </Box>
    <Box textAlign='center'>
      <Text>{XORDistance}</Text>
    </Box>
    <Box textAlign='center'>
      <Text>{Hops}</Text>
    </Box>
    <Box>
      <QueryTimeSpan
        start={RunnerState.StartTime}
        end={Spans[0].Start}
        total={RunnerState.TotalDuration}
      />
      {Spans.length >= 0 && (
        <QueryTimeSpan
          key={0}
          start={Spans[0].Start}
          end={Spans[0].End}
          total={RunnerState.TotalDuration}
          type={Spans[0].Type}
        />
      )}
      {Spans.length >= 2 && (
        <React.Fragment>
          <QueryTimeSpan
            key={1}
            start={Spans[0].End}
            end={Spans[1].Start}
            total={RunnerState.TotalDuration}
            type='Connected'
          />
          <QueryTimeSpan
            key={2}
            start={Spans[1].Start}
            end={Spans[1].End}
            total={RunnerState.TotalDuration}
            type={Spans[1].Type}
          />
        </React.Fragment>
      )}
      <Text marginLeft='2'>
        {niceDuration(msDiff(RunnerState.StartTime, Spans[0].Start))},{' '}
        {CloserPeersNew}/{CloserPeersRecv} peers
      </Text>
    </Box>
  </React.Fragment>
)

const TimeSpan = styled(Span)({
  height: '1.5em',
  verticalAlign: 'text-bottom'
})

const QueryTimeSpan = ({ start, end, total, type }) => {
  const timeSpanWidth = (msDiff(start, end) * 80) / total + '%'
  const color = (() => {
    switch (type) {
      case 'Dial':
        return 'lightgrey'
      case 'Connected':
        return 'darkblue'
      case 'Request':
        return 'lightblue'
      default:
        return undefined
    }
  })()
  return <TimeSpan width={timeSpanWidth} bg={color} />
}

export default ({ data }) => (
  <Box
    marginTop={4}
    display='grid'
    gridTemplateColumns='min-content min-content min-content auto'
    gridGap={2}
  >
    {data && <TableHeader />}
    {data && data.map(q => <QuerySection key={q.QueryID} {...q} />)}
  </Box>
)
