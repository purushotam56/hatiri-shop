import Branch from '#models/branch'

export type NotificationPayload = {
  title: string
  body: string
  screen?: string
  data?: Record<string, any>
  forAdmin?: boolean
  branchId: number | undefined
  organisationId: number | undefined
  type?: string
  isNeedAction?: boolean
}

export type RequestPayload = {
  title: string
  body: string
  screen: string
  data?: Record<string, any>
  forAdmin?: boolean
  type?: string
  isNeedAction?: boolean
}

export enum NotificationType {
  defectSubmissionFeedback = 'defectSubmissionFeedback',
  changeDefectSubmissionSubStatus = 'changeDefectSubmissionSubStatus',
  appointment_booked = 'appointment',
  appointment_rescheduled = 'appointment_rescheduled',
  appointment_cancelled = 'appointment_cancelled',
  inspection_started = 'inspection_started',
  inspection_end = 'inspection_end',
  defect_logged = 'defect_logged',
  ReportGeneratedSuccessfully = 'report_generated_successfully',
}

export type TriggerNotificationPayload = {
  action: string
  branch?: Branch
  userId?: number | undefined
  appointmentId?: number
  inspectionId?: number
  forAdmin?: boolean
  type?: string
  appointmentDate?: Date
  appointmentTimeslot?: string
  isGeneral?: boolean
}
