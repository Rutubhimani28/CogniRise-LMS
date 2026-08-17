import { Draggable } from 'react-beautiful-dnd'
import { RiMenuFill } from 'react-icons/ri'

const Drag = ({ id, index, ...props }) => {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...props}>
            <div className='drag-handle' {...provided.dragHandleProps}>
              <RiMenuFill />
            </div>
            {props.children}
          </div>
        )
      }}
    </Draggable>
  )
}

export default Drag
