import React, { memo } from 'react'

import styled from 'styled-components'

const DropDown = memo(({ options, setBoardSize }) => {

    return (
        <DropDownWrapper>
            <select onChange={event => setBoardSize({x:+event.target.value.split('x')[0],y:+event.target.value.split('x')[1]})}>
                {options.map(el => {
                    return <option key={el._id}>{el.value.x}x{el.value.y}</option>
                })}
            </select>
        </DropDownWrapper>
    )
})


export default DropDown

const DropDownWrapper = styled.div`
    margin-right: 20px;
`