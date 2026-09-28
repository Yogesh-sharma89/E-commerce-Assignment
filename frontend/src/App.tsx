
import AppProvider from "./provider/AppProvider";
import { Provider } from "react-redux";
import { store } from "./store";



function App() {
  return (
    <>
    <Provider store={store}>
         <AppProvider/>
    </Provider>
    </>
  );
}

export default App;