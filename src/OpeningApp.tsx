import { GlobalProvider} from "./context"
import { Opening } from "./opening"

export const OpeningApp = () => {
  return (
    <GlobalProvider>
        <Opening/>
    </GlobalProvider>
    
  )
}
