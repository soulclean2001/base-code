import { CreatePackageReqBody, UpdatePackageReqBody } from '~/models/requests/Package.request'
import databaseServices from './database.services'
import Package, { PackageStatus } from '~/models/schemas/Package.schema'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { deleteFileFromS3 } from '~/utils/s3'
import { escapeRegExp } from 'lodash'
import { ServicePackageStatus } from '~/models/schemas/ServiceOrder.schema'

interface getQueryPackageOwn {
  title?: string
  status?: number
  from_date?: string
  to_date?: string
  limit?: string
  page?: string
}

export default class PackageService {
  static async createPackage(data: CreatePackageReqBody) {
    const pkg = await databaseServices.package.insertOne(
      new Package({
        ...data
      })
    )

    return pkg
  }

  static async updatePackage(package_id: string, data: UpdatePackageReqBody) {
    const oldPkg = await databaseServices.package.findOne({
      _id: new ObjectId(package_id)
    })
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          ...data,
          status: PackageStatus.ARCHIVE
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }

    const oldUrls = []
    if (oldPkg && oldPkg.preview && data.preview !== undefined) {
      const previews = []
      for (let j = 0; j < data.preview.length; j++) {
        if (data.preview[j].match(/images\/.*/)) {
          previews.push(data.preview[j])
        }
      }

      for (let i = 0; i < oldPkg.preview.length; i++) {
        if (!previews.includes(oldPkg.preview[i])) {
          const convertToS3Url = oldPkg.preview[i].match(/images\/.*/)
          if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
        }
      }
    }
    if (oldUrls.length >= 1) {
      for (let i = 0; i < oldUrls.length; i++) {
        await deleteFileFromS3(oldUrls[i])
      }
    }

    return pkg.value
  }

  static async deletePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          status: PackageStatus.DELETED
        },
        $currentDate: {
          deleted_at: true,
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }

  static async archivePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          status: PackageStatus.ARCHIVE
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }

  static async removePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndDelete({
      _id: new ObjectId(package_id)
    })
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }

  static async getPackage(package_id: string) {
    const pkg = await databaseServices.package.findOne({
      _id: new ObjectId(package_id)
    })
    if (!pkg) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg
  }

  static async getAllPackagesByAdmin(
    limit: number = 10,
    page: number = 1,
    filter: { title?: string; type?: string; status?: string; sort_by_date?: string }
  ) {
    const $match: {
      [key: string]: any
    } = {}

    if (filter.title && filter.title.trim()) {
      const keyword = filter.title.trim()
      const keywords = keyword.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')

      $match['title'] = {
        $regex: regex
      }
    }

    if (filter.type) {
      $match['type'] = filter.type.toUpperCase()
    }

    if (filter.status) {
      $match['status'] = filter.status.toUpperCase()
    }

    let sortByDate = -1

    if (filter.sort_by_date && !isNaN(Number(filter.sort_by_date))) {
      sortByDate = Number(filter.sort_by_date)
    }

    const [pks, total] = await Promise.all([
      databaseServices.package
        .aggregate([
          {
            $match: {
              ...$match
            }
          },
          {
            $sort: {
              created_at: sortByDate
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.package
        .aggregate([
          {
            $match
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      pks,
      total: total[0]?.total || 0,
      limit,
      page
    }
  }

  static async getAllPackagesByTitle(
    limit: number = 10,
    page: number = 1,
    filter: { title?: string; type?: string; sort_by_date?: string }
  ) {
    // const pkg = await databaseServices.package.find({}).toArray()

    const $match: {
      [key: string]: any
    } = {}

    if (filter.title) {
      const keyword = filter.title.trim()
      const keywords = keyword.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')

      $match['title'] = {
        $regex: regex
      }
    }

    if (filter.type) {
      $match['type'] = filter.type.toUpperCase()
    }
    let sortByDate = -1
    if (filter.sort_by_date && !isNaN(Number(filter.sort_by_date))) {
      sortByDate = Number(filter.sort_by_date)
    }

    const [pks, total] = await Promise.all([
      databaseServices.package
        .aggregate([
          {
            $match: {
              ...$match,
              status: PackageStatus.ACTIVE
            }
          },
          {
            $sort: {
              created_at: sortByDate
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.package
        .aggregate([
          {
            $match: {
              ...$match,
              status: PackageStatus.ACTIVE
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      pks,
      total: total[0]?.total || 0,
      limit,
      page
    }
  }

  static convertToQueryPackageOwn(filter: getQueryPackageOwn) {
    const options: {
      [key: string]: any
    } = {}

    if (filter.title) {
      filter.title = filter.title.trim()
      const keywords = filter.title.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')
      options['package.title'] = {
        $regex: regex
      }
    }

    if (filter.status && !isNaN(Number(filter.status))) {
      options['status'] = Number(filter.status)
    }

    if (filter.from_date) {
      options['created_at'] = {
        $gte: new Date(filter.from_date)
      }
    }

    if (filter.to_date) {
      if (filter.from_date) {
        options['created_at'] = {
          $gte: new Date(filter.from_date),
          $lte: new Date(filter.to_date)
        }
      } else {
        options['created_at'] = {
          $lte: new Date(filter.to_date)
        }
      }
    }

    return options
  }

  static async getAllPackagesOwn(userId: string, filter: getQueryPackageOwn) {
    const limit = !isNaN(Number(filter.limit)) ? Number(filter.limit) : 10
    const page = !isNaN(Number(filter.page)) ? Number(filter.page) : 1

    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 404
      })

    const match = this.convertToQueryPackageOwn(filter)

    const [packages, total] = await Promise.all([
      databaseServices.serviceOrder
        .aggregate([
          {
            $match: {
              company_id: company._id,
              status: {
                $nin: [ServicePackageStatus.Canceled]
              }
            }
          },
          {
            $lookup: {
              from: 'packages',
              localField: 'package_id',
              foreignField: '_id',
              as: 'package'
            }
          },
          {
            $unwind: {
              path: '$package'
            }
          },
          {
            $match: {
              ...match
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.serviceOrder
        .aggregate([
          {
            $match: {
              company_id: company._id,
              status: {
                $nin: [ServicePackageStatus.Canceled]
              }
            }
          },
          {
            $lookup: {
              from: 'packages',
              localField: 'package_id',
              foreignField: '_id',
              as: 'package'
            }
          },
          {
            $unwind: {
              path: '$package'
            }
          },
          {
            $match: {
              ...match
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      packages,
      total: total[0]?.total || 0,
      limit,
      page
    }
  }

  static async activePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          status: PackageStatus.ACTIVE
        },
        $currentDate: {
          deleted_at: true,
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }
}