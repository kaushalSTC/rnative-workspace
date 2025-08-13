import RootContainer from './src/components/RootContainer/RootContainer';
import { Provider as ReduxProvider } from "react-redux"
import { store } from './src/redux/store';

function App() {
  return (
    <ReduxProvider store={store}>
        <RootContainer/>
    </ReduxProvider>
  );
}

export default App;
