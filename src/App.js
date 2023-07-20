import 'devextreme/dist/css/dx.light.css'
import { customers } from "./data.js"
import './App.css'
import DataSource from 'devextreme/data/data_source';
import { useReducer, createContext, useMemo } from 'react'
import MyDropDownBox from './components/MyDropDownBox.jsx'

export const MyContext = createContext()

const initalState = {
  value: [1],
  opened: false,
  focusedRowKey: null,
  dataGridInstance: null,
  isKeyDown: false,
  isClick: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'ALL':
      return {
        ...state,
        opened: action.opened,
        value: action.value
      }
    case 'OPEN_CLOSE':
      return {
        ...state,
        opened: action.opened
      }
    case "DATA_GRID_INSTANCE":
      return {
        ...state,
        dataGridInstance: action.instance
      }
    case 'FOCUSED_ROW_KEY':
      return {
        ...state,
        focusedRowKey: action.focusedRowKey
      }
    case 'VALUE': {
      return {
        ...state,
        value: action.value
      }
    }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initalState)

  const dataSource = useMemo(() => new DataSource({
    store: {
      data: customers,
      key: 'ID',
      type: 'array',
    },
  }), []);

  return (
    <MyContext.Provider
      value={{ state, dispatch, dataSource }}
    >
      <MyDropDownBox />
    </MyContext.Provider>
  )
}

export default App;
