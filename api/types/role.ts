export enum RoleKeys {
  system = 'system',
  organisation_admin = 'organisation_admin',
  branch_admin = 'branch_admin',
}

export enum RoleAccessLevel {
  system = 'system',
  organisation = 'organisation',
  branch = 'branch',
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
]

export const RoleKeysAuditorAppList = [
  {
    key: RoleKeys.organisation_admin,
    value: 'Organisation',
  },
]

export const LevelPiority = {
  orgBranch: [RoleAccessLevel.organisation, RoleAccessLevel.branch],
  branchOrg: [RoleAccessLevel.branch, RoleAccessLevel.organisation],
}
