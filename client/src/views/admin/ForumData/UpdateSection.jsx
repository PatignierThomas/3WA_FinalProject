import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSection } from '../../../store/slices/section'

function UpdateSection() {
    const dispatch = useDispatch()
    const { section } = useSelector(state => state.game)

    console.log(section) // undefined

    useEffect(() => {
        dispatch(fetchSection())
    }, [])

    return (
        <form>
            <legend>Modifier une section :</legend>
            <label htmlFor="sectionName">Nom de la section :</label>
            <input type="text" name="sectionName" id="updateSectionName" />
            <input type="submit" value="Modifier" />
        </form>
    )
}

export default UpdateSection