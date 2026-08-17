import React, { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'

import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Requests from 'src/configs/axiosRequest'

export default function ActiveStudents(props) {
  const [viewers, setViewers] = useState({})
  const [completedgraduations, setCompletedgraduations] = useState({})
  const [monthUser, setMonthUser] = useState({})
  const [monthHaver, setManthHover] = useState('')
  const [monthAddUsers, setMonthAddUsers] = useState('')
  const [manthCompletedgraduation, setManthCompletedgraduation] = useState('')
  const requestApiData = new Requests()

  useEffect(() => {
    requestApiData
      .adminViewers()
      .then(res => {
        setViewers(res?.data?.Totalusersinmanth)
      })
      .catch(err => {
        console.log('Get all categories', err)
      })

    requestApiData
      .adminCompletedgraduations()
      .then(res => {
        setCompletedgraduations(res?.data?.Totalusersinmanth)
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
    requestApiData
      .adminMonthUser()
      .then(res => {
        setMonthUser(res?.data?.Totalusersinmanth)
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [])

  const viewer = Object?.keys(viewers)
    ?.filter(key => key.includes(new Date()?.getFullYear()))
    .reduce((cur, key) => {
      return Object.assign(cur, viewers[key])
    }, {})

  const monthUsers = Object?.keys(monthUser)
    ?.filter(key => key.includes(new Date()?.getFullYear()))
    .reduce((cur, key) => {
      return Object.assign(cur, monthUser[key])
    }, {})

  const completedgraduation = Object?.keys(completedgraduations)
    ?.filter(key => key.includes(new Date()?.getFullYear()))
    .reduce((cur, key) => {
      return Object.assign(cur, completedgraduations[key])
    }, {})

  useEffect(() => {
    Object.keys(viewer)
      .filter(key => key.match(new Date().toDateString().split(' ')[1]))
      .forEach(key => {
        setManthHover(viewer[key])
      })
  }, [viewer])

  useEffect(() => {
    Object.keys(monthUsers)
      .filter(key => key.match(new Date().toDateString().split(' ')[1]))
      .forEach(key => {
        setMonthAddUsers(monthUsers[key])
      })
  }, [monthUsers])

  useEffect(() => {
    Object.keys(completedgraduation)
      .filter(key => key.match(new Date().toDateString().split(' ')[1]))
      .forEach(key => {
        setManthCompletedgraduation(completedgraduation[key])
      })
  }, [completedgraduation])

  const theme = useTheme()

  const data = [
    {
      progress: 64,
      stats: '$545.69',
      title: 'Earnings',
      avatarIcon: 'tabler:currency-dollar'
    },
    {
      progress: 59,
      title: 'Profit',
      stats: '$256.34',
      avatarColor: 'info',
      progressColor: 'info',
      avatarIcon: 'tabler:chart-pie-2'
    },
    {
      progress: 22,
      stats: '$74.19',
      title: 'Expense',
      avatarColor: 'error',
      progressColor: 'error',
      avatarIcon: 'tabler:brand-paypal'
    }
  ]

  const series1 = [{ data: Object?.values(viewer) }]

  const options1 = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="arrow_box">' +
          w.globals.labels[dataPointIndex] +
          ': ' +
          '<span>' +
          series[seriesIndex][dataPointIndex] +
          '</span>' +
          '</div>'
        )
      }
    },
    dataLabels: { enabled: false },
    colors: [
      ({ value, seriesIndex, w }) => {
        if (value === manthCompletedgraduation) {
          return '#64527f'
        } else {
          return '#cdb7ef'
        }
      }
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: -9,
        right: -10,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '14px',
          color:"black",
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: { show: false }
  }

  const series2 = [{ data: Object?.values(monthUsers) }]

  const options2 = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="arrow_box">' +
          w.globals.labels[dataPointIndex] +
          ': ' +
          '<span>' +
          series[seriesIndex][dataPointIndex] +
          '</span>' +
          '</div>'
        )
      }
    },
    dataLabels: { enabled: false },
    colors: [
      ({ value, seriesIndex, w }) => {
        if (value === monthAddUsers) {
          return '#6282F0'
        } else {
          return '#414141'
        }
      }
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: -9,
        right: -10,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '14px',
          color : "black",
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: { show: false }
  }

  const series3 = [{ data: Object?.values(completedgraduation) }]

  const options3 = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="arrow_box">' +
          w.globals.labels[dataPointIndex] +
          ': ' +
          '<span>' +
          series[seriesIndex][dataPointIndex] +
          '</span>' +
          '</div>'
        )
      }
    },
    dataLabels: { enabled: false },
    colors: [
      ({ value, seriesIndex, w }) => {
        if (value === manthCompletedgraduation) {
          return '#6282F0'
        } else {
          return '#414141'
        }
      }
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: -9,
        right: -10,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '14px',
          color : "black",
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: { show: false }
  }

  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return data !== null ? (
    <div>
      <div className='learnningTimeBox '>
        <div className='d-flex justify-content-between'>
          <div>
            <div>
              <Nav className='justify-content-end text-white' tabs>
                <NavItem>
                  <NavLink
                    className='text-white'
                    active={active === '1'}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                    Viewership
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle('2')
                    }}
                  >
                    New enrollees
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    active={active === '3'}
                    onClick={() => {
                      toggle('3')
                    }}
                  >
                    Graduates
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>
        </div>
        <TabContent activeTab={active}>
          <TabPane tabId='1'>
            <h2
              style={{
                color: '#7d9b17',
                fontWeight: '500',
                fontSize: '34px',
                paddingBottom: '18px',
                paddingLeft: '15px'
              }}
            >
              {monthHaver ? monthHaver : 0} hour
            </h2>
            <Card>
              <CardBody className='p-0'>
                <Row>
                  <Col
                    sm={{ size: 12, order: 2 }}
                    xs={{ order: 1 }}
                    className='d-flex justify-content-between flex-column text-end'
                  >
                    <ReactApexcharts
                      type='bar'
                      height={225}
                      series={series1}
                      options={options1}
                      className='viewer-chart'
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId='2'>
            <h2
              style={{
                color: '#FFFFFF',
                fontWeight: '500',
                fontSize: '34px',
                paddingBottom: '18px',
                paddingLeft: '15px'
              }}
            >
              {monthAddUsers}
            </h2>
            <Card>
              <CardBody className='p-0'>
                <Row>
                  <Col
                    sm={{ size: 12, order: 2 }}
                    xs={{ order: 1 }}
                    className='d-flex justify-content-between flex-column text-end'
                  >
                    <ReactApexcharts
                      type='bar'
                      height={225}
                      series={series2}
                      options={options2}
                      className='viewer-chart'
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId='3'>
            <h2
              style={{
                color: '#FFFFFF',
                fontWeight: '500',
                fontSize: '34px',
                paddingBottom: '18px',
                paddingLeft: '15px'
              }}
            >
              {manthCompletedgraduation}
            </h2>
            <Card>
              <CardBody className='p-0'>
                <Row>
                  <Col
                    sm={{ size: 12, order: 2 }}
                    xs={{ order: 1 }}
                    className='d-flex justify-content-between flex-column text-end'
                  >
                    <ReactApexcharts
                      type='bar'
                      height={225}
                      series={series3}
                      options={options3}
                      className='viewer-chart'
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
      </div>
    </div>
  ) : null
}
