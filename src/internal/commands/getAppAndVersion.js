// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getAppAndVersion from "@ledgerhq/live-common/lib/hw/getAppAndVersion";

type Input = {
  devicePath: string,
};

type Result = { name: string, version: string, flags: number };

const cmd = ({ devicePath }: Input): Observable<Result> =>
  withDevice(devicePath)(transport => from(getAppAndVersion(transport)));

export default cmd;
