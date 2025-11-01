export enum RoleKeys {
  system = 'system',
  organisation_admin = 'organisation_admin',
  branch_admin = 'branch_admin',
  branch_strata = 'branch_strata',
  branch_auditor = 'branch_auditor',
  branch_sub_contractor = 'branch_sub_contractor',
  branch_sales_agent = 'branch_sales_agent',
  property_owner = 'property_owner',
  property_tenant = 'property_tenant',
  property_agent = 'property_agent',
}

export enum RoleAccessLevel {
  system = 'system',
  organisation = 'organisation',
  branch = 'branch',
  property = 'property',
}

export const RoleKeysList = [
  {
    key: RoleKeys.organisation_admin,
    value: 'organisation_admin',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.branch_admin,
    value: 'branch_admin',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.branch_strata,
    value: 'branch_strata',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.branch_auditor,
    value: 'branch_auditor',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.branch_sub_contractor,
    value: 'branch_sub_contractor',
    web: true,
    app: true,
    tradeCode: true,
  },
  {
    key: RoleKeys.branch_sales_agent,
    value: 'branch_sales_agent',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.property_owner,
    value: 'property_owner',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.property_tenant,
    value: 'property_tenant',
    web: true,
    app: true,
    tradeCode: false,
  },
  {
    key: RoleKeys.property_agent,
    value: 'property_agent',
    web: true,
    app: true,
    tradeCode: false,
  },
]

export const RoleAccessLevelList = [
  {
    key: RoleAccessLevel.system,
    value: 'system',
  },
  {
    key: RoleAccessLevel.organisation,
    value: 'organisation',
  },
  {
    key: RoleAccessLevel.branch,
    value: 'branch',
  },
  {
    key: RoleAccessLevel.property,
    value: 'property',
  },
]

export const RoleKeysOwnerAppList = [
  {
    key: RoleKeys.branch_strata,
    value: 'Strata',
  },
  {
    key: RoleKeys.property_owner,
    value: 'Owner',
  },
  {
    key: RoleKeys.property_tenant,
    value: 'Tenant',
  },
  {
    key: RoleKeys.property_agent,
    value: 'Agent',
  },
]

export const RoleKeysAuditorAppList = [
  {
    key: RoleKeys.organisation_admin,
    value: 'Organisation',
  },
  {
    key: RoleKeys.branch_auditor,
    value: 'Auditor',
  },
  {
    key: RoleKeys.branch_sub_contractor,
    value: 'Sub Contractor',
  },
  {
    key: RoleKeys.branch_sales_agent,
    value: 'Sales Agent',
  },
]

export const LevelPiority = {
  orgBranchProperty: [
    RoleAccessLevel.organisation,
    RoleAccessLevel.branch,
    RoleAccessLevel.property,
  ],
  orgPropertyBranch: [
    RoleAccessLevel.organisation,
    RoleAccessLevel.property,
    RoleAccessLevel.branch,
  ],
  branchOrgProperty: [
    RoleAccessLevel.branch,
    RoleAccessLevel.organisation,
    RoleAccessLevel.property,
  ],
  branchPropertyOrg: [
    RoleAccessLevel.branch,
    RoleAccessLevel.property,
    RoleAccessLevel.organisation,
  ],
  propertyOrgBranch: [
    RoleAccessLevel.property,
    RoleAccessLevel.organisation,
    RoleAccessLevel.branch,
  ],
  propertyBranchOrg: [
    RoleAccessLevel.property,
    RoleAccessLevel.branch,
    RoleAccessLevel.organisation,
  ],
}

export enum CompanyRoles {
  'builder' = 'builder',
  'developer' = 'developer',
  'strata' = 'strata',
  'subcontractor' = 'subcontractor',
  'salesAgent' = 'salesAgent',
  'consultant' = 'consultant',
  'auditor' = 'auditor',
}

export const CompanyRolesList = [
  { key: CompanyRoles.builder, value: 'Builder/Developer Organisation' },
  // { key: CompanyRoles.developer, value: 'developer' },
  // { key: CompanyRoles.strata, value: 'strata' },
  // { key: CompanyRoles.subcontractor, value: 'subcontractor' },
  // { key: CompanyRoles.salesAgent, value: 'salesAgent' },
  // { key: CompanyRoles.consultant, value: 'consultant' },
  // { key: CompanyRoles.auditor, value: 'auditor' },
]
