import { Droppable } from 'react-beautiful-dnd'

const Drop = ({ id, type, ...props }) => {
  return (
    <Droppable key={id} droppableId={id} type={type}>
      {provided => {
        return (
          <div ref={provided.innerRef} {...provided.droppableProps} {...props}>
            {props.children}
            {provided.placeholder}
          </div>
        )
      }}
    </Droppable>
  )
}

export default Drop
