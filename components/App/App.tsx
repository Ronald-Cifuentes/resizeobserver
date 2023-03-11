import { FC, createRef, RefObject, useEffect, useState } from 'react'
import { AppContainer } from './App.styled'
import { AppProps } from './types'
import styled from 'styled-components'
import styledContainerQuery from 'styled-container-query'

const Note1 = styled.div`
  width: 100%;
`
const Note2 = styled.div`
  width: 100%;
`

const Parent = styledContainerQuery.div`
  padding: 5px;
  background: violet;
  resize: both;
  overflow: scroll;
  &:container(max-width: 500px) {
    ${Note1} {
      display: none;
    }
  }
  &:container(min-width: 500px) {
    ${Note2} {
      display: none;
    }
  }
`

export type useRefDimensionsOut = {
  width: number
  height: number
}

export type useRefDimensionsProps = (ref: RefObject<HTMLElement>) => useRefDimensionsOut

export const useRefDimensions: useRefDimensionsProps = (ref, initRef = { width: 0, height: 0 }) => {
  const [dimensions, setDimensions] = useState(initRef)

  useEffect(() => {
    if (ref.current) {
      const { current } = ref
      const resizeObserver = new ResizeObserver(entries => {
        if (!Array.isArray(entries)) return
        if (!entries.length) return

        const entry = entries[0]
        if (JSON.stringify(dimensions) !== JSON.stringify(entry.contentRect)) {
          setDimensions(entry.contentRect)
        }
      })
      resizeObserver.observe(current)

      return () => resizeObserver.disconnect()
    }
  }, [ref])
  return dimensions
}

export type Dimensions = {
  width: number
  height: number
}
export type useDimensionsOut = [RefObject<HTMLDivElement>, Dimensions]
export type useDimensionsProps = () => useDimensionsOut

const useResize: useDimensionsProps = () => {
  const ref = createRef<HTMLDivElement>()
  const { width, height } = useRefDimensions(ref)

  return [ref, { width, height }]
}

const App: FC<AppProps> = ({ dataTestId = 'app' }) => {
  const [parent, { width: wParent, height: hParent }] = useResize()
  const [note1, { width: wNote1, height: hNote1 }] = useResize()
  const [note2, { width: wNote2, height: hNote2 }] = useResize()

  return (
    <AppContainer data-testid={dataTestId}>
      <h2>
        Parent: {wParent} - {hParent}
      </h2>
      <h2>
        Note1: {wNote1} - {hNote1}
      </h2>
      <h2>
        Note2: {wNote2} - {hNote2}
      </h2>
      <Parent ref={parent}>
        <Note1 ref={note1}>Note1</Note1>
        <Note2 ref={note2}>Note2</Note2>
      </Parent>
    </AppContainer>
  )
}

export default App
