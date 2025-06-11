import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const slice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => {
      return state + 1;
    },
    reset: () => {
      return 0;
    },
  },
});

export const store = configureStore({
  reducer: {
    counter: slice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function App() {
  return <Provider store={store}>
    {/* componentes da aplicação*/}
  </Provider>
}

function MyComponent() {
  const counter = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();
  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => slice.actions.increment()}>Increment</button>
    </div>
  );
}
