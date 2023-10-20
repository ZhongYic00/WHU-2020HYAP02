import { gql, useQuery } from '@apollo/client';
import React, { Key, useState } from 'react';
export function ask4data(
    gqlQueryStr: string | readonly string[]
) {
    const gqlQuery = gql(gqlQueryStr);
    const { loading, error, data } = useQuery(gqlQuery);
    return data;
}   