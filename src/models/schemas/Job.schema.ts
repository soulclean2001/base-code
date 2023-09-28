import { ObjectId } from 'mongodb'
import { JobStatus } from '../requests/Job.request'

export interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}

export interface SalararyRange {
  min: number
  max: number
}

export interface Benefit {
  type: string
  value: string
}

export interface JobType {
  _id?: ObjectId
  job_title: string
  company_id: ObjectId
  alias: string //link tren url
  is_salary_visible: boolean // hiện mức lương
  pretty_salary: string
  expired_date?: Date
  user_id: ObjectId
  working_locations: WorkingLocation[]
  industries: [string] // linh vuc cong ty
  skills: [string] // ky nang
  job_level: string // cap bac
  posted_date?: Date // ngay dang
  salary_range: SalararyRange
  job_description: string
  job_requirement: string
  job_type: string
  status: JobStatus
  visibility: boolean // hiển thị
  benefits: Benefit[] // phúc lợi
  number_of_employees_needed: number
  application_email: string
  created_at?: Date
  updated_at?: Date
}

export default class Job {
  _id?: ObjectId
  job_title: string
  company_id: ObjectId
  alias: string //link tren url
  is_salary_visible: boolean // hiện mức lương
  pretty_salary: string
  expired_date: Date
  user_id: ObjectId
  working_locations: WorkingLocation[]
  industries: [string] // linh vuc cong ty
  skills: [string] // ky nang
  job_level: string // cap bac
  posted_date: Date // ngay dang
  salary_range: SalararyRange
  job_description: string
  job_requirement: string
  visibility: boolean // hiển thị
  benefits: Benefit[] // phúc lợi
  number_of_employees_needed: number
  application_email: string
  created_at: Date
  updated_at: Date
  status: JobStatus

  constructor(data: JobType) {
    const date = new Date()
    this._id = data._id
    this.status = data.status
    this.company_id = data.company_id
    this.alias = data.alias
    this.job_title = data.job_title
    this.is_salary_visible = data.is_salary_visible
    this.pretty_salary = data.pretty_salary
    this.expired_date = data.expired_date || date
    this.user_id = data.user_id
    this.working_locations = data.working_locations
    this.industries = data.industries
    this.skills = data.skills
    this.job_level = data.job_level
    this.posted_date = data.posted_date || date
    this.salary_range = data.salary_range
    this.job_description = data.job_description
    this.job_requirement = data.job_requirement
    this.visibility = data.visibility
    this.benefits = data.benefits
    this.created_at = data.created_at || date
    this.expired_date = data.expired_date || date
    this.updated_at = data.updated_at || date
    this.number_of_employees_needed = data.number_of_employees_needed || 10
    this.application_email = data.application_email
  }
}