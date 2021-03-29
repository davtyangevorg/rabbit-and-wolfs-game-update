import React, { memo } from 'react'

import styled from 'styled-components'

const DropDown = memo(({ options, setBoardSize }) => {

    return (
        <DropDownWrapper>
            <select onChange={event => setBoardSize(prevState => prevState = event.target.value.split('x'))}>
                {options.map(el => {
                    return <option key={el._id}>{el.value}</option>
                })}
            </select>
        </DropDownWrapper>
    )
})


export default DropDown

const DropDownWrapper = styled.div`
    margin-right: 20px;
`