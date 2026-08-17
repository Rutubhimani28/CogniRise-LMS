import { StudentQuizView } from 'src/features/student/components/StudentQuizView'

const StudentQuiz = () => {
  return <StudentQuizView />
}

StudentQuiz.acl = {
  subject: 'student'
}

export default StudentQuiz
