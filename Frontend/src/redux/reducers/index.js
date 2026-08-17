import { combineReducers } from 'redux'
import CourseReducer from './CourseReducer/Course.reducer'
import data from './notificationreducer/Notification.reducer'

export default combineReducers({
  course: CourseReducer,
  notification: data
})
