// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../../api/libs/itty/responses'

export async function onRequestGet(ctx) {
  try {
    const connectors = await ctx.data.Http.get('/api/connectors', {})
    const socialConnectors = connectors.filter(
      (item) => item?.target && ['social', 'Social'].includes(item?.type)
    )

    return json(
      socialConnectors.map((item) => ({
        id: item.id,
        target: item.target,
        type: item.type,
        name: item.name,
        logo: item.logo,
        logoDark: item.logoDark ?? null,
        isStandard: item.isStandard
      }))
    )
  } catch (e) {
    console.error(e)
    return error(e)
  }
}
