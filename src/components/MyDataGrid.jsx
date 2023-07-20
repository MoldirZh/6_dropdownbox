import React from 'react'
import { useContext, useCallback, useState } from 'react'
import { MyContext } from '../App'
import DataGrid, { Selection, Column } from 'devextreme-react/data-grid'

const columns = ['ID', 'CompanyName', 'City', 'Phone']

const MyDataGrid = ({ data }) => {
  const { value, component } = data
  const { state, dispatch, dataSource } = useContext(MyContext)
  const [selectedRowKey, setSelectedRowKeys] = useState([0]) //since selected rows are not shared between other components, they can be defined using useState

  let { focusedRowKey, isKeyDown, isClick } = state;

  const contentReady = useCallback((e) => {
    if (!e.component.isNotFirstLoad) {
      e.component.isNotFirstLoad = true;
      component.focus();
      dispatch({ type: 'DATA_GRID_INSTANCE', instance: e.component })
    }
  }, [component, dispatch])

  const selectionChanged = useCallback((e) => {
    if (isKeyDown)
      dispatch({ type: 'ALL', value: e.selectedRowKeys, opened: false })
    if (isClick)
      dispatch({ type: 'ALL', value: e.selectedRowKeys, opened: true })
  }, [dispatch, isKeyDown, isClick])

  const keyDown = useCallback((e) => {
    if (e.event.keyCode === 13) {
      setSelectedRowKeys([focusedRowKey])
      dispatch({ type: 'ALL', value: [focusedRowKey], opened: false, isKeyDown: true, isClick: false })
    }
  }, [dispatch, focusedRowKey])

  const rowClick = useCallback((e) => {
    dispatch({ type: 'ALL', value: [e.key], opened: true, isKeyDown: false, isClick: true })
  }, [dispatch])

  const focusedRowChanged = useCallback((e) => {
    dispatch({ type: 'FOCUSED_ROW_KEY', focusedRowKey: e.row.key })
  }, [dispatch])

  return (
    <div>
      <DataGrid
        dataSource={dataSource}
        onContentReady={contentReady}
        autoNavigateToFocusedRow={false}
        hoverStateEnabled={true}
        onSelectionChanged={selectionChanged}
        defaultSelectedRowKeys={value}
        selectedRowKeys={selectedRowKey}
        focusedRowEnabled={true}
        focusedRowKey={focusedRowKey}
        onFocusedRowChanged={focusedRowChanged}
        onKeyDown={keyDown}
        onRowClick={rowClick}
        height="100%"
      >
        {columns.map((item, i) => {
          return <Column
          key={i} 
          dataField={item}/>
        })}
        <Selection mode="single" />
      </DataGrid>
    </div>
  )
}

export default MyDataGrid