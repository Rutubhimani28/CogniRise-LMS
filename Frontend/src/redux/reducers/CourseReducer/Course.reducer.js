const INITIAL_STATE = {
  selectedLesson: null,
  updateMyCourse: null,
  courseId: null
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SELECTED_LESSON':
      return {
        ...state,
        selectedLesson: action.payload
      }
    case 'UPDATE_MYCOURSE':
      return {
        ...state,
        updateMyCourse: action.payload
      }
    case 'COURSE_ID':
      return {
        ...state,
        courseId: action.payload
      }

    default:
      return state
  }
}

export default reducer
