import React, {useCallback, useMemo, useState } from 'react'
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

const styledCalendar = styled(Calendar)`
  .rbc-current-time-indicator {
    background-color: #3f50b5;
  }
  .rbc-time-content {
    border-top: 2px solid #ddd;
  }

  .rbc-time-content > * + * > * {
    border-left: none;
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
    width: 96%;
    margin: 0 auto;
  }

  .rbc-today {
    background-color: #fff;
  }
  
`

const initialEvents = [
    {
      id: 0,
      title: 'All Day Event very long title',
      allDay: true,
      start: new Date(2022, 6, 22),
      end: new Date(2022, 6, 22),
    },
  
    {
      id: 4,
      title: 'Some Event',
      start: new Date(2022, 6, 22, 0, 0, 0),
      end: new Date(2015, 3, 10, 0, 0, 0),
    },
    {
      id: 5,
      title: 'Conference',
      start: new Date(2022, 6, 22),
      end: new Date(2022, 6, 22),
      desc: 'Big conference for important people',
    },
    {
      id: 6,
      title: 'Meeting',
      start: new Date(2022, 6, 22, 10, 30, 0, 0),
      end: new Date(2022, 6, 22, 12, 30, 0, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
      id: 7,
      title: 'Lunch',
      start: new Date(2022, 6, 22, 12, 0, 0, 0),
      end: new Date(2022, 6, 22, 13, 0, 0, 0),
      desc: 'Power lunch',
    },
    {
      id: 8,
      title: 'Meeting',
      start: new Date(2022, 6, 22, 14, 0, 0, 0),
      end: new Date(2022, 6, 22, 15, 0, 0, 0),
    },
    {
      id: 9,
      title: 'Happy Hour',
      start: new Date(2022, 6, 22, 17, 0, 0, 0),
      end: new Date(2022, 6, 22, 17, 30, 0, 0),
      desc: 'Most important meal of the day',
    },
    {
      id: 10,
      title: 'Dinner',
      start: new Date(2022, 6, 23, 20, 0, 0, 0),
      end: new Date(2022, 6, 23, 21, 0, 0, 0),
    },
    {
      id: 11,
      title: 'Planning Meeting with Paige',
      start: new Date(2022, 6, 23, 8, 0, 0),
      end: new Date(2022, 6, 23, 10, 30, 0),
    },
    
    {
      id: 23,
      title: 'Go to the gym',
      start: new Date(2022, 6, 23, 18, 30, 0),
      end: new Date(2022, 6, 23, 20, 0, 0),
    },
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

const DragAndDropCalendar = withDragAndDrop(styledCalendar)

export default function DailyCalendar({date, toggleUnscheduledTodo, setToggleUnscheduledTodo}) {
  const [myEvents, setMyEvents] = useState(initialEvents);
  const [draggedEvent, setDraggedEvent] = useState();
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)


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
          sx={{my: 2, textAlign: 'center', color: 'primary.main', fontWeight: 900}}
        >
          {date}
        </Typography>
        <DragAndDropCalendar
            defaultDate={defaultDate}
            date={date}
            onNavigate={() => {}}
            view='day' 
            onView={() => {}}
            events={myEvents}
            localizer={localizer}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            popup
            resizable
            step={60}
            toolbar={false}
            dragFromOutsideItem={
              displayDragItemInCell ? dragFromOutsideItem : null
            }
            onDropFromOutside={onDropFromOutside}
            onSelectSlot={newEvent}
            selectable
        />
        <UnscheduledTodo 
          toggleUnscheduledTodo={toggleUnscheduledTodo} 
          setToggleUnscheduledTodo={setToggleUnscheduledTodo}
          setDraggedEvent={setDraggedEvent}
        />
    </div>
  )
}

