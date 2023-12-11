import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import apiNotify, { RequestNotify } from '~/api/notify.api'
import avatarTemp from '~/assets/HF_logo.jpg'
import paid from '~/assets/paid.png'
import jobNotify from '~/assets/jobNotify.png'
export interface NotificationType {
  _id?: string
  content: string
  type: string
  object_recieve: number
  object_sent: number
  sender?: string
  recievers: string[]
  is_readed?: boolean
  created_at?: string
  updated_at?: string
  jobTitle?: string
  job_id?: string
  sender_info?: { avatar?: string; name?: string; sender?: string; company_id?: string }
  job_applied_id?: string
  candidate_id?: string
  [key: string]: any
}
export interface NotifyState {
  notifications: NotificationType[]
  page: number
  total: number
  totalNotRead: number
  loading: boolean
  error: any
}

const initialState: NotifyState = {
  notifications: [],
  page: 0,
  totalNotRead: 0,
  loading: false,
  error: undefined,
  total: 0
}
export const getAllByMe = createAsyncThunk('notify/getAllByMe', async (request: RequestNotify, { rejectWithValue }) => {
  try {
    const rs = await apiNotify.getAllByMe(request)
    return rs
  } catch (error) {
    return rejectWithValue(error)
  }
})

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllByMe.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllByMe.rejected, (state, action) => {
      state.loading = false
      const payload = action.payload
      state.error = payload
    })
    builder.addCase(getAllByMe.fulfilled, (state, action) => {
      const { result } = action.payload
      state.page = result.page
      state.total = result.total
      state.notifications = result.notifications.map((notify: NotificationType) => {
        if (notify.type === 'cv/seen') {
          notify.content = `Nhà tuyển dụng <b>${notify.sender_info?.name}</b> vừa xem hồ sơ tìm việc của bạn`
        }
        if (notify.type === 'post/created') {
          notify.jobTitle = notify.content
          notify.content = `Nhà tuyển dụng <b>${notify.sender_info?.name}</b> vừa đăng tin tuyển dụng <b>${notify.content}</b>`
        }

        if (notify.type === 'post/approved') {
          notify.jobTitle = notify.content
          notify.content = `<b>Hệ thống</b> phê duyệt tin tuyển dụng <b>${notify.content}</b>`
          notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
        }
        if (notify.type === 'post/rejected') {
          notify.jobTitle = notify.content
          notify.content = `<b>Hệ thống</b> từ chối phê duyệt tin tuyển dụng <b>${notify.content}</b>`
          notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
        }

        if (notify.type === 'post/pending') {
          notify.jobTitle = notify.content
          notify.content = `<b>${notify.sender_info?.name}</b> đã gửi yêu cầu kiểm duyệt tin tuyển dụng <b>${notify.content}</b>`
        }

        if (notify.type === 'resume/update')
          notify.content = `Ứng viên <b>${notify.sender_info?.name}</b> bạn đang theo dõi vừa cập nhật lại hồ sơ của mình`
        if (notify.type === 'chat') {
          if (notify.content.includes('nhà tuyển dụng'))
            notify.content = `Bạn có tin nhắn mới từ nhà tuyển dụng <b>${notify.sender_info?.name}</b>`
          if (notify.content.includes('ứng viên'))
            notify.content = `Bạn có tin nhắn mới từ ứng viên <b>${notify.sender_info?.name}</b>`
        }
        if (notify.type === 'potential/update') {
          notify.content = `Ứng viên tìm năng <b>${notify.content}</b> vừa cập nhật lại hồ sơ của mình`
        }
        if (notify.type === 'post/applied') {
          notify.jobTitle = notify.content
          notify.content = `Ứng viên <b>${notify.sender_info?.name}</b> vừa nộp đơn ứng tuyển vào <b>${notify.content}</b>`
        }
        if (notify.type === 'order/success') {
          notify.sender_info = { ...notify.sender_info, avatar: paid }
          notify.content = `Đơn hàng <b>#ORDER_${notify.content}</b> đã được thanh toán`
        }
        if (notify.type === 'order/completed') {
          notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
          notify.content = `<b>Hệ thống</b> đã kích hoạt đơn hàng <b>#ORDER_${notify.content}</b> của bạn`
        }
        if (notify.type === 'post/candidate_find_job') {
          notify.jobTitle = notify.content
          notify.sender_info = { ...notify.sender_info, avatar: jobNotify }
          notify.content = `Việc làm <b>${notify.content}</b> phù hợp với bạn đang được đăng tuyển`
        }

        return notify
      })
      // .reverse()

      state.loading = false
      state.error = ''
      return state
    })
  },
  reducers: {
    setIsRead: (state, action) => {
      state.notifications = state.notifications.map((notify) => {
        if (notify._id === action.payload) {
          notify.is_readed = true
          state.totalNotRead--
        }
        return notify
      })
      return state
    },
    setMoreWhenScroll: (state, action) => {
      const { notifications } = action.payload
      notifications.map((notify: NotificationType) => {
        if (notify.type === 'cv/seen') {
          notify.content = `Nhà tuyển dụng <b>${notify.sender_info?.name}</b> vừa xem hồ sơ tìm việc của bạn`
        }
        if (notify.type === 'post/created') {
          notify.jobTitle = notify.content
          notify.content = `Nhà tuyển dụng <b>${notify.sender_info?.name}</b> vừa đăng tin tuyển dụng <b>${notify.content}</b>`
        }

        if (notify.type === 'post/approved') {
          notify.jobTitle = notify.content
          notify.content = `<b>Hệ thống</b> phê duyệt tin tuyển dụng <b>${notify.content}</b>`
          notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
        }
        if (notify.type === 'post/rejected') {
          notify.jobTitle = notify.content
          notify.content = `<b>Hệ thống</b> từ chối phê duyệt tin tuyển dụng <b>${notify.content}</b>`
          notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
        }

        if (notify.type === 'post/pending') {
          notify.jobTitle = notify.content
          notify.content = `<b>${notify.sender_info?.name}</b> đã gửi yêu cầu kiểm duyệt tin tuyển dụng <b>${notify.content}</b>`
        }

        if (notify.type === 'resume/update')
          notify.content = `Ứng viên <b>${notify.sender_info?.name}</b> bạn đang theo dõi vừa cập nhật lại hồ sơ của mình`
        if (notify.type === 'chat') {
          if (notify.content.includes('nhà tuyển dụng'))
            notify.content = `Bạn có tin nhắn mới từ nhà tuyển dụng <b>${notify.sender_info?.name}</b>`
          if (notify.content.includes('ứng viên'))
            notify.content = `Bạn có tin nhắn mới từ ứng viên <b>${notify.sender_info?.name}</b>`
        }
        if (notify.type === 'potential/update') {
          notify.content = `Ứng viên tìm năng <b>${notify.content}</b> vừa cập nhật lại hồ sơ của mình`
        }
        if (notify.type === 'post/applied') {
          notify.jobTitle = notify.content
          notify.content = `Ứng viên <b>${notify.sender_info?.name}</b> vừa nộp đơn ứng tuyển vào <b>${notify.content}</b>`
        }
        if (notify.type === 'order/success') {
          notify.sender_info = { ...notify.sender_info, avatar: paid }
          notify.content = `Đơn hàng <b>#ORDER_${notify.content}</b> đã được thanh toán`
        }
        if (notify.type === 'order/completed') {
          notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
          notify.content = `<b>Hệ thống</b> đã kích hoạt đơn hàng <b>#ORDER_${notify.content}</b> của bạn`
        }
        if (notify.type === 'post/candidate_find_job') {
          notify.jobTitle = notify.content
          notify.sender_info = { ...notify.sender_info, avatar: jobNotify }
          notify.content = `Việc làm <b>${notify.content}</b> phù hợp với bạn đang được đăng tuyển`
        }
        return notify
      })
      state.notifications = [...state.notifications, ...notifications]
      state.page = action.payload.page
      state.total = action.payload.total
      return state
    },
    addNotify: (state, action) => {
      const notify = action.payload
      if (notify.type === 'cv/seen') {
        notify.content = `Nhà tuyển dụng <b>${notify.sender_info?.name}</b> vừa xem hồ sơ tìm việc của bạn`
      }
      if (notify.type === 'post/created') {
        notify.jobTitle = notify.content
        notify.content = `Nhà tuyển dụng <b>${notify.sender_info?.name}</b> vừa đăng tin tuyển dụng <b>${notify.content}</b>`
      }

      if (notify.type === 'post/approved') {
        notify.jobTitle = notify.content
        notify.content = `<b>Hệ thống</b> phê duyệt tin tuyển dụng <b>${notify.content}</b>`
        notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
      }
      if (notify.type === 'post/rejected') {
        notify.jobTitle = notify.content
        notify.content = `<b>Hệ thống</b> từ chối phê duyệt tin tuyển dụng <b>${notify.content}</b>`
        notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
      }

      if (notify.type === 'post/pending') {
        notify.jobTitle = notify.content
        notify.content = `<b>${notify.sender_info?.name}</b> đã gửi yêu cầu kiểm duyệt tin tuyển dụng <b>${notify.content}</b>`
      }

      if (notify.type === 'resume/update')
        notify.content = `<b>${notify.sender_info?.name}</b> bạn đang theo dõi vừa cập nhật lại hồ sơ của mình`
      if (notify.type === 'chat') {
        if (notify.content.includes('nhà tuyển dụng'))
          notify.content = `Bạn có tin nhắn mới từ nhà tuyển dụng <b>${notify.sender_info?.name}</b>`
        if (notify.content.includes('ứng viên'))
          notify.content = `Bạn có tin nhắn mới từ ứng viên <b>${notify.sender_info?.name}</b>`
      }
      if (notify.type === 'potential/update') {
        notify.content = `Ứng viên tìm năng <b>${notify.content}</b> vừa cập nhật lại hồ sơ của mình`
      }
      if (notify.type === 'post/applied') {
        notify.jobTitle = notify.content
        notify.content = `Ứng viên <b>${notify.sender_info?.name}</b> vừa nộp đơn ứng tuyển vào <b>${notify.content}</b>`
      }
      if (notify.type === 'order/success') {
        notify.sender_info = { ...notify.sender_info, avatar: paid }
        notify.content = `Đơn hàng <b>#ORDER_${notify.content}</b> đã được thanh toán`
      }
      if (notify.type === 'order/completed') {
        notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
        notify.content = `<b>Hệ thống</b> đã kích hoạt đơn hàng <b>#ORDER_${notify.content}</b> của bạn`
      }
      if (notify.type === 'post/candidate_find_job') {
        notify.jobTitle = notify.content
        notify.sender_info = { ...notify.sender_info, avatar: jobNotify }
        notify.content = `Việc làm <b>${notify.content}</b> phù hợp với bạn đang được đăng tuyển`
      }
      state.notifications = [notify, ...state.notifications]
      state.totalNotRead++
      state.total++
      return state
    },
    setTotalUnRead: (state, action) => {
      state.totalNotRead = action.payload
      return state
    }
  }
})

export const { setIsRead, addNotify, setMoreWhenScroll, setTotalUnRead } = notifySlice.actions

export default notifySlice.reducer
