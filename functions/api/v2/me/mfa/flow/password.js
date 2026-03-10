// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../../../../../../api/libs/itty/responses/index.js';

export async function onRequestPost(ctx) {
  try {
    const requestData = await ctx.request.json();

    if (!requestData?.password || typeof requestData.password !== 'string') {
      return error(400, 'ERR_INVALID_PASSWORD');
    }

    try {
      await ctx.data.Http.post(
        `/api/users/${encodeURIComponent(ctx.data.userid)}/password/verify`,
        {
          data: {
            password: requestData.password,
          },
        }
      );
    } catch (verifyError) {
      return error(406, 'ERR_PASSWORD_VERIFICATION_FAILED');
    }

    await ctx.env.MfaStatus.put(ctx.data.userid, false, { expirationTtl: 900 });
    return status(204);
  } catch (e) {
    console.error(e);
    return error(e);
  }
}
