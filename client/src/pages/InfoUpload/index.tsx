// 此页面用于查看RenderInputBox的工作效果

import { gql, useQuery } from '@apollo/client';
import React, { Key, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
// import RenderInputBox from '../../components/InfoPlatform/index';
import RenderInputBox from '../../components/InfoPlatform/RenderInputBox/index'
import { Select } from 'antd';
import { useParams, useSearchParams } from '@umijs/max';

export default () => {
    const match = useParams()
    const type = match['type'] || 'Teacher'
    // fork from entity
    const [params,setParams] = useSearchParams();
    const entityId = params.get('id')
    return (
        <PageContainer>
            {/* <RenderInputBox schemaName="Teacher"></RenderInputBox> */}
            <RenderInputBox 
                // schemaName='Article'
                schemaName={type}
                id={entityId||undefined}
            ></RenderInputBox>

        </PageContainer>
    )
}