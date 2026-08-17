import { Typography } from '@mui/material'
import draftToHtml from 'draftjs-to-html'
import VideoPlayer from 'src/views/pages/components/Video'

export default function CourseContent({ courseName, instructor, lesson, data }) {
  const rawHTML = draftToHtml(data?.desc)

  return (
    <>
      <div style={{
        width: { xs: '100%', md: '70%' },
        flexGrow: 1
      }}>
        {data ? (
          <div className='course-video-wrap' style={{
            padding: '1rem',
            boxShadow: "#636363 0px 2px 8px 0px",
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <div className='d-flex justify-content-between align-items-center flex-wrap'>
              <h2 className='addHeadingColor course-video-heading' style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {data.name}
              </h2>
              <p className='text-black' style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {courseName} : Lesson {lesson}
              </p>
            </div>
            <h6 className='video-small-heading' style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Powered By:<span className='color-change ps-2'>{instructor}</span>
            </h6>
            <div className='course-video' style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              {typeof data.file === 'string' ? (
                <VideoPlayer
                  url={data.file}
                  itemNo={lesson.split('/', 1)}
                  key={lesson.split('/', 1)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                />
              ) : (
                <VideoPlayer
                  url='https://static.vecteezy.com/system/resources/previews/003/137/174/mp4/people-silhouette-near-the-seaside-free-video.mp4'
                  itemNo={lesson.split('/', 1)}
                  key={lesson.split('/', 1)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                />
              )}
            </div>
            <div
              className='py-3 text-black'
              style={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: '1.5'
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: rawHTML }} />
            </div>
          </div>
        ) : (
          <div style={{
            padding: '1rem',
            boxShadow: "#636363 0px 2px 8px 0px",
            borderRadius: '8px',
            backgroundColor: 'white',
            textAlign: 'center'
          }}>
            <Typography>Select a lesson to begin</Typography>
          </div>
        )}
      </div>
    </>
  )
}
