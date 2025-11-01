import vine from '@vinejs/vine'

export const commonParamsIdValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)

export const commonDynamicSingleValueValidator = (field: string, type?: any) =>
  vine.compile(
    vine.object({
      [field]: type ? vine.enum(type) : vine.string().trim(),
    })
  )

export const commonParamsPropertyIdValidator = vine.compile(
  vine.object({
    propertyId: vine.number(),
  })
)

export const commonParamsBranchIdValidator = vine.compile(
  vine.object({
    branchId: vine.number(),
  })
)

export const commonParamsCommonAreaIdValidator = vine.compile(
  vine.object({
    commonAreaId: vine.number(),
  })
)

export const commonParamsInspectionIdValidator = vine.compile(
  vine.object({
    inspectionId: vine.number(),
  })
)

export const commonParamsTradeCodeIdValidator = vine.compile(
  vine.object({
    tradeCodeId: vine.number().optional(),
    tradeCodeIds: vine.array(vine.number()).optional(),
  })
)
export const includeDefectCommonAreaOnlyValidator = vine.compile(
  vine.object({
    includeDefectOnly: vine.boolean().optional(),
  })
)
