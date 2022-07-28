import React, { useCallback, useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Typography } from '@mui/material';
import UnscheduledTodo from './UnscheduledTodo';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import {colorMap} from '../theme';


const styledCalendar = styled(Calendar)`
  .rbc-current-time-indicator {
    background-color: #3f50b5;
  }
  .rbc-time-content {
    border-bottom: 1px solid #ddd;
    border-top: none;
    gap: 20px;
  }
  .rbc-time-content > * + * > * {
    border-left: none;
  }
  .rbc-time-header {
    gap: 20px;
  }
  .rbc-time-header-content {
    border-left: none;
    border-bottom: 1px solid #f44336;
  }
  .rbc-timeslot-group {
    border-bottom: none;
  }
  .rbc-label {
    font-size: 12px;
    font-weight: 600;
    color: #3f50b5;
  }
  .rbc-time-view {
    border-top: 1px solid #ddd;
    border-left: none;
    border-right: none;
    border-bottom: none;
    width: 90%;
    margin: 0 auto;
  }
  .rbc-today {
    background-color: #fff;
  }
`

const initialEvents = [
  {
    id: 0,
    user_id: 1,
    cat_id: 2,
    // once data is received, need to be reformatted to display with proper links...
    // example: title needs to be reformatted from string to add a hyperlink so can open to display to-do details
    title: 'Petit Event',
    descript: 'This is a modified event to include a description',
    allDay: false,
    start: new Date(2022, 6, 27, 3, 30, 0),
    end: new Date(2022, 6, 27, 7, 30, 0),
    complete: false
  },
  {
    id: 1,
    user_id: 1,
    cat_id: 1,
    title: 'All Day Event very long title',
    allDay: false,
    start: new Date(2022, 6, 27, 16, 30, 0),
    end: new Date(2022, 6, 27, 18, 30, 0),
  },

  {
    id: 4,
    user_id: 1,
    cat_id: 3,
    title: 'Some Event',
    start: new Date(2022, 6, 27, 0, 0, 0),
    end: new Date(2022, 9, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: 'Conference',
    user_id: 1,
    cat_id: 5,
    start: new Date(2022, 6, 27),
    end: new Date(2022, 6, 27),
    desc: 'Big conference for important people',
  }
]

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const EventComponent = (event) => {
  return (
    <div className='eventTitle'>
      {event.title}
      <a href="/" onClick={(e) => { alert('edit') }}>x</a>
      <a href="/" onClick={(e) => { alert('edit') }}>🖊️</a>
      <input type="checkbox" id="complete" name="complete" onClick={(e) => { alert('mark as complete') }}></input>
    </div>)
}



const CustomToolbar = () => {
  return (
    <div className='rbc-toolbar'>
    <div className="customView">
    <form method="GET" action="/">
      <select name="calendar-view" id="calendar-view">
        <option value="/">My Calendar</option>
        <option value="/tam">Tam</option>
        <option value="/school">School</option>
        <option value="/holidays">Holidays</option>
      </select>
    </form>
    </div>
  </div>
  )
}



const DragAndDropCalendar = withDragAndDrop(styledCalendar)

export default function DailyCalendar({ date, toggleUnscheduledTodo, setToggleUnscheduledTodo }) {
  const [myEvents, setMyEvents] = useState(initialEvents);
  const [draggedEvent, setDraggedEvent] = useState();
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(undefined)
  const [modalState, setModalState] = useState(false)



  const handleSelectedEvent = (myEvents) => {
    setSelectedEvent(myEvents)
    modalState === true ? setModalState(false) : setModalState(true)
  }

  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])

  const newEvent = useCallback(
    (event) => {
      setMyEvents((prev) => {
        return [...prev, event]
      })
    },
    [setMyEvents]
  )

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }) => {
      const { id, title } = draggedEvent;
      const event = {
        id,
        title,
        start,
        end,
        isAllDay,
      }
      setDraggedEvent(null)
      newEvent(event)
    },
    [draggedEvent, setDraggedEvent, newEvent]
  )



  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay }]
      })
    },
    [setMyEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setMyEvents]
  )

  const defaultDate = useMemo(() => new Date(), [])


  return (
    <div>
      <Typography
        sx={{ my: 2, textAlign: 'center', color: 'primary.main', fontWeight: 900 }}
      >
        {date}
      </Typography>
      <DragAndDropCalendar
        defaultDate={defaultDate}
        date={date}
        onNavigate={() => { }}
        view='day'
        onView={() => { }}
        events={myEvents}
        localizer={localizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        popup
        resizable
        step={60}
        dragFromOutsideItem={
          displayDragItemInCell ? dragFromOutsideItem : null
        }
        onDropFromOutside={onDropFromOutside}
        onSelectSlot={newEvent}
        onSelectEvent={(e) => handleSelectedEvent(e)}
        draggable
        eventPropGetter={(event) => {
          // backgroundColor can be set to any color we decide based on the category id of the to-do item
          let backgroundColor = colorMap[event.cat_id]
          console.log(backgroundColor)
          // visibility is decided based on whether the to-do item is completed or not
          const visibility = event.complete === true ? 'hidden' : 'visible';
          return { style: { backgroundColor, visibility } }
        }}
        components={{
          event: EventComponent,
          toolbar: CustomToolbar
        }}
      />
      <UnscheduledTodo
        toggleUnscheduledTodo={toggleUnscheduledTodo}
        setToggleUnscheduledTodo={setToggleUnscheduledTodo}
        setDraggedEvent={setDraggedEvent}
      />
      {/* {selectedEvent && <ToDoEditModal />} */}
    </div>
  )
}

