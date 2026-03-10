// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../api/libs/itty/responses/index.js'

export async function onRequestGet(ctx) {
  try {
    const organizations = await ctx.data.Http.get(
      `/api/users/${encodeURIComponent(ctx.data.userid)}/organizations`,
      {
        resTo400: 'ERR_FAILED_TO_FETCH_ORGANIZATIONS'
      }
    )

    return json(
      organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
        description: organization.description,
        organizationRoles: organization.organizationRoles ?? [],
        createdAt: organization.createdAt
      }))
    )
  } catch (e) {
    console.error('Error in grabbing organization data:' + e)
    return error(e)
  }
}
