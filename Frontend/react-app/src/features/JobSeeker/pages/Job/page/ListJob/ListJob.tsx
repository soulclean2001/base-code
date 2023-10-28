import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination as SwiperPage, Mousewheel } from 'swiper/modules'
import { Button, Col, Pagination, Row, Select } from 'antd'
import { useState } from 'react'
import JobItem from '../../Components/JobItem/JobItem'

import './style.scss'
import CompanyRightItem from './components/CompanyRightItem'
import { useLocation } from 'react-router-dom'
import apiPost, { PostRequestSearchType } from '~/api/post.api'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import { getAllIndustries } from '~/api/industries.api'

// const listField = [
//   { value: 'Tất cả lĩnh vực' },
//   { value: 'Bán lẻ/Bán sỉ' },
//   { value: 'Bảo hiểm' },
//   { value: 'Bất động sản' },
//   { value: 'Cơ khí/Máy móc/Thiết bị công nghiệp' },
//   { value: 'Phần mềm CNTT' }
// ]
const listLevel = [
  { value: 'Tất cả cấp bật' },
  { value: 'Thực tập sinh/Sinh viên' },
  { value: 'Mới tối nghiệp' },
  { value: 'Nhân viên' },
  { value: 'Trưởng phòng' },
  { value: 'Giám đốc' }
]
const listTypeJobs = [
  { value: 'Tất cả loại hình' },
  { value: 'Bán thời gian' },
  { value: 'Toàn thời gian' },
  { value: 'Thực tập' },
  { value: 'Online' },
  { value: 'Nghề tự do' },
  { value: 'Hợp đồng thời vụ' },
  { value: 'Khác' }
]
const listSalary = [
  { value: 'all', label: 'Tất cả mức lương' },
  { value: '0-4999999', label: 'Dưới 5 triệu' },
  { value: '5000000-10000000', label: 'Từ 5 đến 10 triệu' },
  { value: '10000000-15000000', label: 'Từ 10 đến 15 triệu' },
  { value: '15000001-max', label: 'Trên 15 triệu' }
]

const dataTopCompany = [
  { id: '1', img: 'https://insieutoc.vn/wp-content/uploads/2021/03/mau-logo-dep.jpg', name: 'KIMBERLY-CLARK 1' },
  { id: '2', img: 'https://insieutoc.vn/wp-content/uploads/2021/03/mau-logo-dep.jpg', name: 'KIMBERLY-CLARK 2' },
  {
    id: '3',
    img: 'https://anhdepfree.com/wp-content/uploads/2022/11/anh-nen-co-chu-cute_60900974387-607x1080.jpg',
    name: 'KIMBERLY-CLARK 3'
  },
  { id: '4', img: 'https://images.vietnamworks.com/logo/pvcom_vip_124084.png', name: 'KIMBERLY-CLARK 4' },
  { id: '5', img: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_640.jpg', name: 'KIMBERLY-CLARK 5' },
  { id: '6', img: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_640.jpg', name: 'KIMBERLY-CLARK 5' },
  { id: '7', img: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_640.jpg', name: 'KIMBERLY-CLARK 5' }
]
interface JobItemType {
  _id: string
  logo: string
  jobTitle: string
  companyName: string
  salary_range: { min: number; max: number }
  working_locations: WorkingLocation[]
  created_at: string
  is_salary_visible: boolean
}
const ListJob = () => {
  const location = useLocation()
  const limitOnPage = 10
  const [totalItems, setTotalItems] = useState(1)
  const [activeSort, setActiveSort] = useState('last-post-date')
  const [requestSearch, setRequestSearch] = useState<PostRequestSearchType>({
    sort_by_post_date: 0,
    page: '1',
    limit: '10',
    content: location.state ? location.state.content : '',
    working_location: location.state ? location.state.cityName : ''
  })
  const [listJobs, setListJobs] = useState<Array<JobItemType>>([])
  const [pageClick, setPageClick] = useState('')
  useEffect(() => {
    if (location && location.state) {
      setRequestSearch({ ...requestSearch, content: location.state.content, working_location: location.state.cityName })
    }
  }, [location.state])
  useEffect(() => {
    getJobs()
  }, [requestSearch])
  const getJobs = async (page?: string) => {
    await apiPost.searchJobs({ ...requestSearch, page: page ? page : '1' }).then((rs) => {
      let jobs: JobItemType[] = []
      rs.result.jobs.map((job: any) => {
        jobs.push({
          _id: job._id,
          logo: job.company.logo,
          companyName: job.company.company_name,
          created_at: job.created_at.slice(0, 10),
          is_salary_visible: job.salary_visible,
          jobTitle: job.job_title,
          salary_range: job.salary_range,
          working_locations: job.working_locations
        })
      })
      setListJobs(jobs)
      setTotalItems(rs.result.total)
    })
  }

  const handleActiveSort = (event: any) => {
    if (event.target.id === 'last-post-date') setRequestSearch({ ...requestSearch, sort_by_post_date: -1 })
    if (event.target.id === 'old-post-date') setRequestSearch({ ...requestSearch, sort_by_post_date: 1 })
    if (event.target.id === 'salary-low-to-hight') setRequestSearch({ ...requestSearch, sort_by_salary: 1 })
    if (event.target.id === 'salary-hight-to-low') setRequestSearch({ ...requestSearch, sort_by_salary: -1 })
    setActiveSort(event.target.id)
    // console.log('event.target.id', event.target.id)
  }

  const handleSetSalary = (value: string) => {
    if (value === 'all') {
      setRequestSearch({ ...requestSearch, 'salary[min]': '', 'salary[max]': '' })
      return
    }
    let parts = value.split('-')

    let min = parts[0]
    let max = ''

    if (parts[1] !== 'max') {
      max = parts[1]
    }

    setRequestSearch({ ...requestSearch, 'salary[min]': min, 'salary[max]': max })
  }
  //set value page click
  const handleChangePage = (valuePageClick: any) => {
    // setPageClick(valuePageClick)
    // setPageClick(valuePageClick)
    // setRequestSearch({ ...requestSearch, page: valuePageClick })
    getJobs(valuePageClick)
  }
  //
  return (
    <div className='list-job-page-container'>
      <div className='title'>
        <div>
          <span>Dánh sách việc làm</span>
        </div>
      </div>
      <div className='job-content'>
        <Row className='menu-sort-job'>
          <Col lg={5} md={0} sm={0} xs={0} className='select-menu select-carrer'>
            <Select
              // mode='tags'
              defaultValue='Tất cả ngành nghề'
              showSearch
              //   optionLabelProp='children'
              style={{ width: '100%' }}
              // maxTagCount={1}
              // maxTagTextLength={15}
              size='large'
              options={[{ value: 'Tất cả ngành nghề' }, ...getAllIndustries]}
              onChange={(value) =>
                setRequestSearch({ ...requestSearch, career: value === 'Tất cả ngành nghề' ? '' : value })
              }
            />
          </Col>
          {/* <Col lg={6} md={0} sm={0} xs={0} className=' select-menu select-carrer-field'>
            <Select
              placeholder={'Tất cả lĩnh vực'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listField}
            />
          </Col> */}
          <Col lg={4} md={0} sm={0} xs={0} className='select-menu select-level'>
            <Select
              defaultValue={'Tất cả cấp bật'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listLevel}
              onChange={(value) =>
                setRequestSearch({ ...requestSearch, job_level: value === 'Tất cả cấp bật' ? '' : value })
              }
            />
          </Col>
          <Col lg={4} md={0} sm={0} xs={0} className='select-menu select-type-job'>
            <Select
              defaultValue={'Tất cả loại hình'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listTypeJobs}
              onChange={(value) =>
                setRequestSearch({ ...requestSearch, job_type: value === 'Tất cả loại hình' ? '' : value })
              }
            />
          </Col>
          <Col lg={4} md={0} sm={0} xs={0} className='select-menu select-salary'>
            <Select
              defaultValue={'all'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listSalary}
              onChange={(value) => handleSetSalary(value)}
            />
          </Col>
          <Col lg={0} md={24} sm={24} xs={24}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button>Bộ lọc</Button>
              <Button>Sắp xếp</Button>
            </div>
          </Col>
        </Row>
        <Row className='list-job-container'>
          <Col lg={16} md={24} sm={24} xs={24}>
            <div className='sort-list-job'>
              <span>Sắp xếp theo </span>
              <div id='sort-container'>
                <div
                  id='last-post-date'
                  className={activeSort === 'last-post-date' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Ngày đăng (mới nhất)`}</div>
                <div
                  id='old-post-date'
                  className={activeSort === 'old-post-date' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Ngày đăng (cũ nhất)`}</div>

                <div
                  id='salary-low-to-hight'
                  className={activeSort === 'salary-low-to-hight' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Lương (thấp-cao)`}</div>
                <div
                  id='salary-hight-to-low'
                  className={activeSort === 'salary-hight-to-low' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Lương(cao-thấp)`}</div>
              </div>
            </div>
            <div>
              {listJobs &&
                listJobs.map((item) => (
                  <JobItem
                    key={item._id}
                    idJob={item._id}
                    img={item.logo}
                    nameJob={item.jobTitle}
                    salary={
                      !item.is_salary_visible
                        ? `${item.salary_range.min.toLocaleString('vi', {
                            currency: 'VND'
                          })} - ${item.salary_range.max.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`
                        : 'Thương lượng'
                    }
                    nameCompany={item.companyName}
                    area={item.working_locations
                      .map((loc) => {
                        return loc.city_name
                      })
                      .filter((value, index, self) => {
                        return self.indexOf(value) === index
                      })}
                    timePost={item.created_at}
                  />
                ))}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 0' }}>
                <Pagination
                  onChange={handleChangePage}
                  responsive
                  defaultCurrent={1}
                  pageSize={limitOnPage}
                  //   current={totalItems}
                  //   showLessItems={false}
                  showSizeChanger={false}
                  total={totalItems}
                />
              </div>
            </div>
          </Col>
          <Col lg={7} md={0} sm={0} xs={0} className='right-job-content'>
            <div className='list-top-company'>
              <div className='title'>Các Công Ty Hàng Đầu</div>

              <Swiper
                style={{ width: '100%', height: '100%', maxHeight: '190vh' }}
                slidesPerView={5}
                direction={'vertical'}
                // spaceBetween={'180px'}
                pagination={{
                  clickable: true
                }}
                mousewheel={true}
                modules={[SwiperPage, Mousewheel]}
                className='mySwiper'
              >
                {dataTopCompany &&
                  dataTopCompany.map((item) => (
                    <SwiperSlide key={item.id} style={{ height: '100%', width: '100%' }}>
                      <CompanyRightItem />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ListJob
