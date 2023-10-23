// 此页面用于查看RenderInputBox的工作效果

import { gql, useQuery } from '@apollo/client';
import React, { Key, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
// import RenderInputBox from '../../components/InfoPlatform/index';
import RenderInputBox from '../../components/InfoPlatform/RenderInputBox/index'

export default () => {
    return (
        <PageContainer>
            {/* <RenderInputBox schemaName="Teacher"></RenderInputBox> */}
            <RenderInputBox 
                schemaName='Teacher' 
                id='2020302192187'
                queryFields='teachers'
            ></RenderInputBox>

        </PageContainer>
    )
}