import { ResumeType } from '~/types/resume.type'
import './Right.scss'
import { Avatar, Button, UploadFile } from 'antd'
import { usePDF } from 'react-to-pdf'
import { RcFile } from 'antd/es/upload'
import { useState, useEffect } from 'react'
import { omit } from 'lodash'
import ReactHtmlParser from 'html-react-parser'

interface RightPropsType {
  data: ResumeType
  file: UploadFile
}

const Right = (props: RightPropsType) => {
  const { data, file } = props
  const personalInfo = omit(data.user_info, ['first_name', 'last_name', 'avatar', 'wanted_job_title'])
  const skills = data.skills
  const professionalSummary = data.professional_summary
  const hobbie = data.hobbies

  const [avatar, setAvatar] = useState('')
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' })

  const previewImage = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    setAvatar(src)
    // const imgWindow = window.open(src)

    // imgWindow?.document.write(image.outerHTML)
  }

  useEffect(() => {
    if (!file) {
      setAvatar('')
    } else previewImage(file)
  }, [file])

  return (
    <div className='wrap-preview-cv'>
      <div className='download-cv'>
        <Button size='large' type='primary' onClick={() => toPDF()}>
          Download PDF
        </Button>
      </div>

      <div className='wrap-cv'>
        <div className='preview-cv' ref={targetRef}>
          <div className='preview-left'>
            <h2 className='preview-user-name'>{data.user_info.first_name.concat(' ', data.user_info.last_name)}</h2>
            <h4 className='preview-user-wanted-job'>{data.user_info.wanted_job_title}</h4>
            {avatar && (
              <div className='preview__cover-avatar'>
                <Avatar src={avatar} size={{ xs: 44, sm: 52, md: 60, lg: 84, xl: 100, xxl: 120 }} />
              </div>
            )}

            {personalInfo &&
              Object.keys(personalInfo).map((key, index) => {
                if (key === 'property_name') {
                  return (
                    <h4 key={key} className='preview__title-info'>
                      {personalInfo.property_name}
                    </h4>
                  )
                }

                if (Object.keys(personalInfo).includes(key)) {
                  return (
                    <p key={key} className='preview__info'>
                      {data.user_info[key]}
                    </p>
                  )
                }
              })}

            {/* <p className='preview__info'>24/09/2001</p>
            <p className='preview__info'>Nam</p>
            <p className='preview__info'>0869648453</p>
            <p className='preview__info'>hirosaki217@gmail.com</p>
            <p className='preview__info'>656/40 Quang Trung, p11, Go Vap, HCM</p>
            <p className='preview__info'>github.com/hirosaki217</p> */}
            <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>

            {skills && skills.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{skills.property_name}</h4>
                {skills.data.map((skill, index) => (
                  <p key={skill.skill_name + index} className='preview__info'>
                    {' '}
                    - {skill.skill_name}
                  </p>
                ))}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.languages && data.languages.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.languages.property_name}</h4>
                {data.languages.data.map((e, index) => (
                  <p key={e.language + index} className='preview__info'>
                    - {e.language} {e.level ? 'cấp độ: ' + e.level : ''}
                  </p>
                ))}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {hobbie && hobbie.description.length > 0 && (
              <>
                <h4 className='preview__title-info'>{hobbie.property_name}</h4>
                <p className='preview__info'>{hobbie.description}</p>
              </>
            )}
          </div>
          <div className='preview-right'>
            {professionalSummary && professionalSummary.content.length > 0 && (
              <>
                <h4 className='preview__title-info'>{professionalSummary.property_name}</h4>
                <h5 className='preview__info'>{ReactHtmlParser(professionalSummary.content)}</h5>
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.employment_histories && data.employment_histories.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.employment_histories.property_name}</h4>
                {data.employment_histories.data.map((e, index) => {
                  const temp = [e.job_title, e.employer, e.city].filter((it) => it.length > 0)

                  const str = temp.length === 1 ? temp[0] : temp.join(', ')
                  const temp2 = [e.start_date, e.end_date].filter((it) => it.length > 0)
                  const startEndDate = temp2.length === 1 ? temp2[0] : temp2.join(' - ')

                  return (
                    <div key={e.job_title + index} style={{ paddingBottom: '10px' }}>
                      <p className='preview__info'>
                        <b>{str}</b>
                      </p>

                      <p className='preview__info'>
                        <i style={{ color: 'rgb(130, 139, 162)' }}>{startEndDate}</i>
                      </p>

                      <h5 className='preview__info'>{ReactHtmlParser(e.description)}</h5>
                    </div>
                  )
                })}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.educations && data.educations.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.educations.property_name}</h4>
                {data.educations.data.map((e, index) => {
                  const temp = [e.degree, e.school, e.city].filter((it) => it.length > 0)

                  const str = temp.length === 1 ? temp[0] : temp.join(', ')
                  const temp2 = [e.start_date, e.end_date].filter((it) => it.length > 0)
                  const startEndDate = temp2.length === 1 ? temp2[0] : temp2.join(' - ')

                  return (
                    <div key={e.school + index} style={{ paddingBottom: '10px' }}>
                      <p className='preview__info'>
                        <b>{str}</b>
                      </p>

                      <p className='preview__info'>
                        <i style={{ color: 'rgb(130, 139, 162)' }}>{startEndDate}</i>
                      </p>

                      <h5 className='preview__info'>{ReactHtmlParser(e.description)}</h5>
                    </div>
                  )
                })}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.social_or_website && data.social_or_website.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.social_or_website.property_name}</h4>
                {data.social_or_website.data.map((e, index) => {
                  return (
                    <div key={e.label + index} style={{ paddingBottom: '10px' }}>
                      <p className='preview__info'>
                        <b>{e.label}</b> <a href={e.link}>{e.link}</a>
                      </p>
                    </div>
                  )
                })}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.courses && data.courses.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.courses.property_name}</h4>
                {data.courses.data.map((e, index) => {
                  const temp = [e.title, e.institution].filter((it) => it.length > 0)

                  const str = temp.length === 1 ? temp[0] : temp.join(', ')
                  const temp2 = [e.start_date, e.end_date].filter((it) => it.length > 0)
                  const startEndDate = temp2.length === 1 ? temp2[0] : temp2.join(' - ')

                  return (
                    <div key={e.title + index} style={{ paddingBottom: '10px' }}>
                      <p className='preview__info'>
                        <b>{str}</b>
                      </p>

                      <p className='preview__info'>
                        <i style={{ color: 'rgb(130, 139, 162)' }}>{startEndDate}</i>
                      </p>
                    </div>
                  )
                })}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.references && data.references.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.references.property_name}</h4>
                {data.references.data.map((e, index) => {
                  const temp = [e.name, e.company].filter((it) => it.length > 0)

                  const str = temp.length === 1 ? temp[0] : temp.join(' đến ')
                  const temp2 = [e.phone, e.email].filter((it) => it.length > 0)
                  const str2 = temp2.length === 1 ? temp2[0] : temp2.join(' | ')

                  return (
                    <div key={e.name + index} style={{ paddingBottom: '10px' }}>
                      <p className='preview__info'>
                        <b>{str}</b>
                      </p>

                      <p className='preview__info'>{str2}</p>
                    </div>
                  )
                })}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}

            {data.internships && data.internships.data.length > 0 && (
              <>
                <h4 className='preview__title-info'>{data.internships.property_name}</h4>
                {data.internships.data.map((e, index) => {
                  const temp = [e.job_title, e.employer, e.city].filter((it) => it.length > 0)

                  const str = temp.length === 1 ? temp[0] : temp.join(', ')
                  const temp2 = [e.start_date, e.end_date].filter((it) => it.length > 0)
                  const startEndDate = temp2.length === 1 ? temp2[0] : temp2.join(' - ')

                  return (
                    <div key={e.job_title + index} style={{ paddingBottom: '10px' }}>
                      <p className='preview__info'>
                        <b>{str}</b>
                      </p>

                      <p className='preview__info'>
                        <i style={{ color: 'rgb(130, 139, 162)' }}>{startEndDate}</i>
                      </p>

                      <h5 className='preview__info'>{ReactHtmlParser(e.description)}</h5>
                    </div>
                  )
                })}
                <p style={{ borderBottom: '2.5px solid #ffe8c4', margin: 0, padding: '7px 0' }}></p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Right
