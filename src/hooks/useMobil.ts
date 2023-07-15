import { useWindowSize } from 'react-use'

const useMobil = () => {
  const { width, height } = useWindowSize()
  return {
    isMobil: width < 1024,
    width,
    height,
  }
}

export default useMobil
