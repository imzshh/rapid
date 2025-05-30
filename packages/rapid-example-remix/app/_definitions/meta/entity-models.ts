import type { RapidEntity as TRapidEntity } from '@ruiapp/rapid-extension';
import { autoConfigureRapidEntity } from '@ruiapp/rapid-extension';
import base$BaseShift from '../models/entities/base/BaseShift';
import oc$OcDepartment from '../models/entities/oc/OcDepartment';
import oc$OcRole from '../models/entities/oc/OcRole';
import oc$OcUser from '../models/entities/oc/OcUser';
import pm$PmBugIssue from '../models/entities/pm/PmBugIssue';
import pm$PmLog from '../models/entities/pm/PmLog';
import pm$PmProject from '../models/entities/pm/PmProject';
import pm$PmTask from '../models/entities/pm/PmTask';
import sys$SysAction from '../models/entities/sys/SysAction';
import sys$SysActionGroup from '../models/entities/sys/SysActionGroup';
import sys$SysCronJob from '../models/entities/sys/SysCronJob';

const entityDefinitions = [
  base$BaseShift,
  oc$OcDepartment,
  oc$OcRole,
  oc$OcUser,
  pm$PmBugIssue,
  pm$PmLog,
  pm$PmProject,
  pm$PmTask,
  sys$SysAction,
  sys$SysActionGroup,
  sys$SysCronJob,
];
const configuredEntities:TRapidEntity[] = [
  autoConfigureRapidEntity(base$BaseShift, entityDefinitions),
  autoConfigureRapidEntity(oc$OcDepartment, entityDefinitions),
  autoConfigureRapidEntity(oc$OcRole, entityDefinitions),
  autoConfigureRapidEntity(oc$OcUser, entityDefinitions),
  autoConfigureRapidEntity(pm$PmBugIssue, entityDefinitions),
  autoConfigureRapidEntity(pm$PmLog, entityDefinitions),
  autoConfigureRapidEntity(pm$PmProject, entityDefinitions),
  autoConfigureRapidEntity(pm$PmTask, entityDefinitions),
  autoConfigureRapidEntity(sys$SysAction, entityDefinitions),
  autoConfigureRapidEntity(sys$SysActionGroup, entityDefinitions),
  autoConfigureRapidEntity(sys$SysCronJob, entityDefinitions),
];
export default configuredEntities;
