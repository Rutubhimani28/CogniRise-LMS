import React, { useRef, useEffect, useState } from 'react'
import videojs from 'video.js'
import Requests from 'src/configs/axiosRequest'
import { useSelector } from 'react-redux'

import 'video.js/dist/video-js.css'
import 'videojs-contrib-quality-levels'
import 'videojs-http-source-selector'

export const VideoPlayer = props => {
  const requestApiData = new Requests()
  const user = JSON.parse(window.localStorage.getItem('userData'))
  const courseId = useSelector(state => state?.course?.courseId)

  const videoRef = useRef(null)
  const playerRef = useRef(null)

  const options = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: props.url,
        type: 'video/mp4'
      }
    ]
  }

  const countTotalDuration = (preTotalTime, currentTime) => {
    const currentTimeToHours = parseFloat((currentTime / 3600).toFixed(4))

    return preTotalTime + currentTimeToHours
  }

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')

      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        if (player) {
          player.on('ended', event => {
            if (user?.role === 'student') {
              const params1 = {
                studentID: user?.id,
                courseID: courseId
              }
              requestApiData
                .getAllEnrollment(params1)
                .then(res => {
                  if (res?.status === 200) {
                    const completeLesson = `item_${props.itemNo}`
                    const totalDuration = countTotalDuration(res?.data[0]?.completeTaskDuration, player.duration())
                    if ((res?.data[0]?.completeTask).indexOf(completeLesson) === -1) {
                      let params = {}
                      if ((res?.data[0]?.completeTask).length + 1 === res?.data[0]?.totalTask) {
                        params = {
                          studentID: user?.id,
                          courseID: courseId,
                          completeTask: [...res?.data[0]?.completeTask, completeLesson],
                          completeTaskDuration: totalDuration,
                          status: 'Completed',
                          completeDate: Date.now()
                        }
                      } else {
                        params = {
                          studentID: user?.id,
                          courseID: courseId,
                          completeTask: [...res?.data[0]?.completeTask, completeLesson],
                          completeTaskDuration: totalDuration
                        }
                      }

                      requestApiData
                        .updateCompleteTask(params)
                        .then(res => {
                          if (res?.status === 200) {
                            console.log('Success', res?.data)
                          }
                        })
                        .catch(err => {
                          console.log('Error on set enrolment complete task', err)
                        })
                    } else {
                      console.log('22222222222222222222')
                    }
                  }
                })
                .catch(err => {
                  console.log('Error on Get enrollment data', err)
                })
            }
          })
        }
      }))
    }
  }, [props])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  )
}

export default VideoPlayer
