import axios from 'axios'
import api from './apiConfig'

export default class Requests {
  getUser(query) {
    return axios({
      method: 'GET',
      url: `${api.user}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: query
    })
  }

  getUserById(id) {
    return axios({
      method: 'GET',
      url: `${api.user}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  updateUserProfile(payload) {
    const config = {
      method: 'PUT',
      url: `${api.user}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        ...(payload instanceof FormData ? {} : { 'Content-Type': 'application/json' })
      }
    };
    
    return axios(config)
  }

  //Course API
  courseRequest(payload) {
    return axios({
      method: 'GET',
      url: `${api.course}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: payload
    })
  }

  courseRequestStudent(payload) {
    return axios({
      method: 'GET',
      url: `${api.course}/student`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: payload
    })
  }
  oneCourseRequest(id) {
    return axios({
      method: 'GET',
      url: `${api.course}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  createCourseRequest(payload) {
    return axios({
      method: 'POST',
      url: `${api.course}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  updateCourseRequest(payload) {
    return axios({
      method: 'PUT',
      url: `${api.course}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  }

  getNotification(payload) {
    return axios({
      method: 'POST',
      url: `${api.notification}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  updatenotification(payload) {
    return axios({
      method: 'POST',
      url: `${api.notification}/update`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  deleteCourseRequest(id) {
    return axios({
      method: 'DELETE',
      url: `${api.course}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }
  deleteCourseManyRequest(payload) {
    return axios({
      method: 'POST',
      url: `${api.course}/delete-many`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  getTotalCourse(payload) {
    return axios({
      method: 'POST',
      url: `${api.course}/count`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  searchCouses(title) {
    return axios({
      method: 'GET',
      url: `${api.course}/search/?title=${title ? title : ''}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  Setlevel(filter) {
    return axios({
      method: 'GET',
      url: `${api.course}/search/level/`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: filter
    })
  }

  TotalCouses(payload) {
    return axios({
      method: 'GET',
      url: `${api.course}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: payload
    })
  }

  //Student Profile API
  studentProfile(payload) {
    return axios({
      method: 'POST',
      url: `${api.studentProfile}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  getStudentProfile() {
    return axios({
      method: 'GET',
      url: `${api.studentProfile}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  putStudentProfile(payload) {
    return axios({
      method: 'PUT',
      url: `${api.studentProfile}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  //Enterprice API
  enterpriseRequest() {
    return axios({
      method: 'GET',
      url: `${api.enterprise}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  createEnterpriseProfile(payload) {
    return axios({
      method: 'POST',
      url: `${api.enterprise}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  updateEnterpriseProfile(payload) {
    return axios({
      method: 'PUT',
      url: `${api.enterprise}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  //Course Category
  getCategories(payload) {
    return axios({
      method: 'GET',
      url: `${api.category}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: payload
    })
  }

  getOneCategory(id) {
    return axios({
      method: 'GET',
      url: `${api.category}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  createCategoryRequest(payload) {
    return axios({
      method: 'POST',
      url: `${api.category}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  updateCategoryRequest(payload) {
    return axios({
      method: 'PUT',
      url: `${api.category}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  deleteCategoryRequest(id) {
    return axios({
      method: 'DELETE',
      url: `${api.category}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  deleteManyCategoryRequest(payload) {
    return axios({
      method: 'POST',
      url: `${api.category}/delete-many`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  //Enrollment API
  getEnrollCourse(params) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/getEnrollCourse`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: params
    })
  }

  updateEnrollCourse(params) {
    return axios({
      method: 'PUT',
      url: `${api.enrollment}/`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: params
    })
  }

  updateEnrollCourse(params) {
    return axios({
      method: 'PUT',
      url: `${api.enrollment}/`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: params
    })
  }

  unenrollEnterprisecourse(payload) {
    return axios({
      method: 'DELETE',
      url: `${api.enrollment}/${payload._id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  updateCompleteTask(params) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/updateCompleteTask`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: params
    })
  }

  getAllEnrollment(payload) {
    return axios({
      method: 'GET',
      url: `${api.enrollment}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: payload
    })
  }

  getLastEnrollment(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/last`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  setEnrollment(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  countEnrollment() {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/count`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  topCourseCount(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/topCourse`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  getTotalStudentCount(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/student`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  getTotalGraduate(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/graduate`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      data: payload
    })
  }

  adminViewers() {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/admin/viewers`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }
  adminCompletedgraduations() {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/admin/completedgraduations`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }
  adminMonthUser() {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/admin/month`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }

  enterpriseViewers(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/enterprise/viewer`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }
  enterpriseCompletedgraduations(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/enterprise/completedgraduation`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }
  enterpriseMonthUser(payload) {
    return axios({
      method: 'POST',
      url: `${api.enrollment}/enterprise/month`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
  }
}
