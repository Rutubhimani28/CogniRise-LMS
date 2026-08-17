const navigation = () => {
  return [
    //Admin Menu
    {
      title: 'Courses',
      path: '/admin-courses',
      subject: 'admin',
      icon: 'tabler:file'
    },
    {
      title: 'Instructors',
      path: '/admin-instructor',
      subject: 'admin',
      icon: 'tabler:book'
    },

    //Enterprise Menu
    {
      title: 'Reports',
      path: '/enterprise',
      subject: 'enterprise',
      icon: 'tabler:book'
    },
    {
      title: 'Courses',
      path: '/enterprise-courses',
      subject: 'enterprise',
      icon: 'tabler:file'
    },
    {
      title: 'Settings',
      path: '/enterprise-profile',
      subject: 'enterprise',
      icon: 'tabler:settings'
    },

    //Student Menu
    {
      title: 'Courses',
      path: '/my-all-courses',
      subject: 'student',
      icon: 'tabler:file'
    },
    {
      title: 'MyLearning',
      path: '/my-learning',
      subject: 'student',
      icon: 'tabler:book'
    },
    {
      title: 'Settings',
      path: '/student-profile',
      subject: 'student',
      icon: 'tabler:settings'
    }
  ]
}

export default navigation
